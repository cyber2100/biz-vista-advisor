import { z } from 'zod';
import type { BusinessType, BusinessSize, FinancialType, AnalyticsType } from '@prisma/client';

// Base schemas
export const dateSchema = z.preprocess((arg) => {
  if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
  return arg;
}, z.date());

export const idSchema = z.string().min(1, 'ID is required');

export const currencySchema = z.string().length(3, 'Currency must be a 3-letter code (e.g., USD)');

export const amountSchema = z.number()
  .positive('Amount must be greater than 0')
  .finite('Amount must be a finite number');

// Business validation schemas
export const createBusinessSchema = z.object({
  name: z.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name cannot exceed 100 characters'),
  type: z.enum(['RETAIL', 'ECOMMERCE', 'SERVICE', 'MANUFACTURING', 'TECHNOLOGY', 'OTHER'] as const),
  size: z.enum(['MICRO', 'SMALL', 'MEDIUM', 'LARGE'] as const),
  registrationNo: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'),
});

export const updateBusinessSchema = z.object({
  id: z.string().min(1, 'Business ID is required'),
  name: z.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name cannot exceed 100 characters')
    .optional(),
  type: z.enum(['RETAIL', 'ECOMMERCE', 'SERVICE', 'MANUFACTURING', 'TECHNOLOGY', 'OTHER'] as const).optional(),
  size: z.enum(['MICRO', 'SMALL', 'MEDIUM', 'LARGE'] as const).optional(),
  registrationNo: z.string().optional(),
});

// Financial record validation schemas
export const createFinancialRecordSchema = z.object({
  type: z.enum(['REVENUE', 'EXPENSE', 'INVESTMENT', 'LOAN'] as const),
  amount: amountSchema,
  currency: currencySchema,
  date: dateSchema,
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  businessId: z.string().min(1, 'Business ID is required'),
});

// Analytics validation schemas
export const analyticsQuerySchema = z.object({
  businessId: idSchema,
  type: z.enum(['REVENUE_TREND', 'EXPENSE_TREND', 'GROWTH_METRICS', 'PERFORMANCE_KPI'] as const),
  period: z.string()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Invalid date format')
    .transform((val) => new Date(val)),
});

// Document validation schemas
export const uploadedFileSchema = z.object({
  originalname: z.string().min(1, 'File name is required'),
  mimetype: z.string().min(1, 'File type is required'),
  buffer: z.instanceof(Buffer),
  size: z.number()
    .positive('File size must be greater than 0')
    .max(10 * 1024 * 1024, 'File size cannot exceed 10MB'),
});

// Date range validation schema
export const dateRangeSchema = z.object({
  startDate: z.string()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Invalid start date format')
    .transform((val) => new Date(val)),
  endDate: z.string()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Invalid end date format')
    .transform((val) => new Date(val)),
}).refine(
  (data) => data.startDate <= data.endDate,
  'Start date must be before or equal to end date'
);

class ValidationService {
  validateBusiness(data: unknown) {
    const result = createBusinessSchema.safeParse(data);
    return {
      data: result.success ? result.data : null,
      error: result.success ? null : new Error(result.error.errors[0].message),
    };
  }

  validateBusinessUpdate(data: unknown) {
    const result = updateBusinessSchema.safeParse(data);
    return {
      data: result.success ? result.data : null,
      error: result.success ? null : new Error(result.error.errors[0].message),
    };
  }

  validateFinancialRecord(data: unknown) {
    const result = createFinancialRecordSchema.safeParse(data);
    return {
      data: result.success ? result.data : null,
      error: result.success ? null : new Error(result.error.errors[0].message),
    };
  }

  validateAnalyticsQuery(data: unknown) {
    const result = analyticsQuerySchema.safeParse(data);
    return {
      data: result.success ? result.data : null,
      error: result.success ? null : new Error(result.error.errors[0].message),
    };
  }

  validateUploadedFile(file: unknown) {
    const result = uploadedFileSchema.safeParse(file);
    return {
      data: result.success ? result.data : null,
      error: result.success ? null : new Error(result.error.errors[0].message),
    };
  }

  validateDateRange(startDate: unknown, endDate: unknown) {
    const result = dateRangeSchema.safeParse({ startDate, endDate });
    return {
      data: result.success ? result.data : null,
      error: result.success ? null : new Error(result.error.errors[0].message),
    };
  }
}

export const validationService = new ValidationService(); 