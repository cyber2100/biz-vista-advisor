import { PrismaClient, Prisma, BusinessType, BusinessSize } from '@prisma/client';
import { supabase } from '../lib/supabase';
import type { StorageError } from '@supabase/storage-js';
import { validationService } from './validationService';

const prisma = new PrismaClient();

interface CreateBusinessDTO {
  name: string;
  type: BusinessType;
  size: BusinessSize;
  registrationNo?: string;
  userId: string;
}

interface UpdateBusinessDTO {
  id: string;
  name?: string;
  type?: BusinessType;
  size?: BusinessSize;
  registrationNo?: string;
}

interface FinancialRecordDTO {
  type: 'REVENUE' | 'EXPENSE' | 'INVESTMENT' | 'LOAN';
  amount: number;
  currency: string;
  date: Date;
  category: string;
  description?: string;
}

interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface BusinessDocument {
  id: string;
  business_id: string;
  file_name: string;
  file_type: string;
  file_path: string;
  uploaded_at: string;
}

export interface UploadedFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

class BusinessService {
  async createBusiness(data: CreateBusinessDTO): Promise<ServiceResponse<any>> {
    try {
      // Validate business data
      const validation = validationService.validateBusiness(data);
      if (validation.error) {
        return { data: null, error: validation.error };
      }

      const business = await prisma.business.create({
        data: {
          name: validation.data.name,
          type: validation.data.type,
          size: validation.data.size,
          registrationNo: validation.data.registrationNo,
          userId: validation.data.userId,
          subscription: {
            create: {
              plan: 'FREE',
              status: 'ACTIVE',
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
              stripeCustomerId: null, // Free tier doesn't need Stripe integration
              stripePriceId: null
            }
          }
        },
        include: {
          subscription: true
        }
      });

      return { data: business, error: null };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return { data: null, error: new Error('Business with this name already exists') };
        }
        return { data: null, error: new Error(`Database error: ${error.message}`) };
      }
      return { data: null, error: new Error('Failed to create business') };
    }
  }

  async updateBusiness(data: UpdateBusinessDTO): Promise<ServiceResponse<any>> {
    try {
      // Validate update data
      const validation = validationService.validateBusinessUpdate(data);
      if (validation.error) {
        return { data: null, error: validation.error };
      }

      const business = await prisma.business.update({
        where: { id: validation.data.id },
        data: {
          name: validation.data.name,
          type: validation.data.type,
          size: validation.data.size,
          registrationNo: validation.data.registrationNo
        },
        include: {
          subscription: true
        }
      });

      return { data: business, error: null };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return { data: null, error: new Error('Business not found') };
        }
        return { data: null, error: new Error(`Database error: ${error.message}`) };
      }
      return { data: null, error: new Error('Failed to update business') };
    }
  }

  async getBusinessById(id: string): Promise<ServiceResponse<any>> {
    try {
      const business = await prisma.business.findUnique({
        where: { id },
        include: {
          subscription: true,
          financials: {
            orderBy: { date: 'desc' },
            take: 10,
          },
          analytics: {
            orderBy: { period: 'desc' },
            take: 5,
          },
          advice: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });
      
      if (!business) {
        return { data: null, error: new Error('Business not found') };
      }
      
      return { data: business, error: null };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return { data: null, error: new Error(`Database error: ${error.message}`) };
      }
      return { data: null, error: new Error('Failed to fetch business') };
    }
  }

  async getBusinessesByUserId(userId: string): Promise<ServiceResponse<any[]>> {
    try {
      const businesses = await prisma.business.findMany({
        where: { userId },
        include: {
          subscription: true,
          financials: {
            orderBy: { date: 'desc' },
            take: 1,
          },
          analytics: {
            orderBy: { period: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return { data: businesses, error: null };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return { data: null, error: new Error(`Database error: ${error.message}`) };
      }
      return { data: null, error: new Error('Failed to fetch businesses') };
    }
  }

  async deleteBusiness(id: string) {
    try {
      await prisma.business.delete({
        where: { id },
      });
      return { error: null };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return { error: new Error('Business not found') };
        }
      }
      return { error: new Error('Failed to delete business') };
    }
  }

  // Analytics methods
  async getBusinessAnalytics(
    businessId: string,
    type: 'REVENUE_TREND' | 'EXPENSE_TREND' | 'GROWTH_METRICS' | 'PERFORMANCE_KPI',
    period: string
  ) {
    // Validate analytics query
    const validation = validationService.validateAnalyticsQuery({ businessId, type, period });
    if (validation.error) {
      return { data: null, error: validation.error };
    }

    try {
      const analytics = await prisma.analytics.findMany({
        where: {
          businessId: validation.data.businessId,
          type: validation.data.type,
          period: {
            gte: validation.data.period,
          },
        },
        orderBy: { period: 'asc' },
      });
      return { data: analytics, error: null };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return { data: null, error: new Error(`Database error: ${error.message}`) };
      }
      return { data: null, error: new Error('Failed to fetch analytics') };
    }
  }

  // Financial methods
  async addFinancialRecord(
    businessId: string,
    data: FinancialRecordDTO
  ): Promise<ServiceResponse<any>> {
    // Validate financial record
    const validation = validationService.validateFinancialRecord({
      ...data,
      businessId,
    });
    if (validation.error) {
      return { data: null, error: validation.error };
    }

    try {
      const financial = await prisma.financial.create({
        data: {
          type: validation.data.type,
          amount: validation.data.amount,
          currency: validation.data.currency,
          date: validation.data.date,
          category: validation.data.category,
          description: validation.data.description,
          businessId: validation.data.businessId,
        },
      });
      return { data: financial, error: null };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return { data: null, error: new Error('Duplicate financial record') };
        }
        if (error.code === 'P2003') {
          return { data: null, error: new Error('Business not found') };
        }
        return { data: null, error: new Error(`Database error: ${error.message}`) };
      }
      return { data: null, error: new Error('Failed to add financial record') };
    }
  }

  async getFinancialRecords(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ServiceResponse<any[]>> {
    // Validate date range
    const dateValidation = validationService.validateDateRange(startDate, endDate);
    if (dateValidation.error) {
      return { data: null, error: dateValidation.error };
    }

    try {
      const financials = await prisma.financial.findMany({
        where: {
          businessId,
          date: {
            gte: dateValidation.data.startDate,
            lte: dateValidation.data.endDate,
          },
        },
        orderBy: {
          date: 'desc',
        },
      });
      return { data: financials, error: null };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return { data: null, error: new Error(`Database error: ${error.message}`) };
      }
      return { data: null, error: new Error('Failed to fetch financial records') };
    }
  }

  // Advice methods
  async getBusinessAdvice(businessId: string) {
    try {
      const advice = await prisma.advice.findMany({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
      });
      return { data: advice, error: null };
    } catch (error) {
      return { data: null, error: new Error('Failed to fetch business advice') };
    }
  }

  async addBusinessAdvice(businessId: string, data: {
    type: 'FINANCIAL' | 'OPERATIONAL' | 'STRATEGIC' | 'RISK';
    content: string;
  }) {
    try {
      const advice = await prisma.advice.create({
        data: {
          ...data,
          businessId,
          status: 'PENDING',
        },
      });
      return { data: advice, error: null };
    } catch (error) {
      return { data: null, error: new Error('Failed to add business advice') };
    }
  }

  async getBusinessDocuments(businessId: string) {
    try {
      const { data, error } = await supabase
        .from('business_documents')
        .select('*')
        .eq('business_id', businessId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching business documents:', error);
      return { data: null, error };
    }
  }

  async uploadBusinessDocument(
    businessId: string,
    file: UploadedFile
  ): Promise<{ data: BusinessDocument | null; error: Error | StorageError | null }> {
    // Validate file
    const fileValidation = validationService.validateUploadedFile(file);
    if (fileValidation.error) {
      return { data: null, error: fileValidation.error };
    }

    const fileExt = fileValidation.data.originalname.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `business_documents/${businessId}/${fileName}`;

    try {
      // Start a Prisma transaction
      return await prisma.$transaction(async (prisma) => {
        // Verify the business exists
        const business = await prisma.business.findUnique({
          where: { id: businessId },
        });

        if (!business) {
          throw new Error('Business not found');
        }

        // Upload the file to storage
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, fileValidation.data.buffer, {
            contentType: fileValidation.data.mimetype,
          });

        if (uploadError) throw uploadError;

        // Create a record in the business_documents table
        const { data, error: dbError } = await supabase
          .from('business_documents')
          .insert([
            {
              business_id: businessId,
              file_name: fileValidation.data.originalname,
              file_type: fileValidation.data.mimetype,
              file_path: filePath,
            },
          ])
          .select()
          .single();

        if (dbError) {
          // Clean up the uploaded file if database insert fails
          await supabase.storage
            .from('documents')
            .remove([filePath]);
          throw dbError;
        }

        return { data, error: null };
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      return { data: null, error: error as Error | StorageError };
    }
  }

  async deleteBusinessDocument(id: string, filePath: string) {
    try {
      // 1. Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // 2. Delete the record from the database
      const { error: dbError } = await supabase
        .from('business_documents')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;
      return { error: null };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { error };
    }
  }

  async getDocumentUrl(filePath: string) {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 60); // 60 seconds expiry

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting document URL:', error);
      return { data: null, error };
    }
  }
}

export const businessService = new BusinessService();