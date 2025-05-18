import { PrismaClient } from '@prisma/client';
import { financialAnalyticsService } from './financialAnalyticsService';
import { businessAdviceService } from './businessAdviceService';
import { validationService } from './validationService';

const prisma = new PrismaClient();

interface ReportOptions {
  includeFinancials?: boolean;
  includeAnalytics?: boolean;
  includeAdvice?: boolean;
  startDate?: Date;
  endDate?: Date;
}

interface BusinessReport {
  businessInfo: {
    id: string;
    name: string;
    type: string;
    size: string;
    registrationNo?: string;
  };
  subscription?: {
    plan: string;
    status: string;
    currentPeriodEnd: Date;
  };
  financials?: {
    summary: any;
    recentTransactions: any[];
  };
  analytics?: {
    performance: any;
    trends: any;
    risks: any[];
  };
  advice?: {
    current: any[];
    implemented: any[];
  };
  generatedAt: Date;
}

class ReportingService {
  async generateBusinessReport(
    businessId: string,
    options: ReportOptions = {}
  ): Promise<{ data: BusinessReport | null; error: Error | null }> {
    try {
      // Validate business ID
      if (!businessId) {
        throw new Error('Business ID is required');
      }

      // Validate date range if provided
      if (options.startDate && options.endDate) {
        const dateValidation = validationService.validateDateRange(
          options.startDate,
          options.endDate
        );
        if (dateValidation.error) {
          throw dateValidation.error;
        }
      }

      // Fetch basic business information
      const business = await prisma.business.findUnique({
        where: { id: businessId },
        include: {
          subscription: true,
        },
      });

      if (!business) {
        throw new Error('Business not found');
      }

      const report: BusinessReport = {
        businessInfo: {
          id: business.id,
          name: business.name,
          type: business.type,
          size: business.size,
          registrationNo: business.registrationNo || undefined,
        },
        generatedAt: new Date(),
      };

      // Add subscription information if available
      if (business.subscription) {
        report.subscription = {
          plan: business.subscription.plan,
          status: business.subscription.status,
          currentPeriodEnd: business.subscription.currentPeriodEnd,
        };
      }

      // Add financial information if requested
      if (options.includeFinancials) {
        const financialSummary = await financialAnalyticsService.generateFinancialSummary(
          businessId,
          12 // Last 12 months
        );

        const recentTransactions = await prisma.financial.findMany({
          where: {
            businessId,
            date: {
              gte: options.startDate,
              lte: options.endDate,
            },
          },
          orderBy: { date: 'desc' },
          take: 10,
        });

        report.financials = {
          summary: financialSummary.data,
          recentTransactions,
        };
      }

      // Add analytics if requested
      if (options.includeAnalytics) {
        const insights = await financialAnalyticsService.generateBusinessInsights(businessId);
        
        report.analytics = {
          performance: insights.data.performance,
          trends: insights.data.recommendations,
          risks: insights.data.risks,
        };
      }

      // Add advice if requested
      if (options.includeAdvice) {
        const currentAdvice = await prisma.advice.findMany({
          where: {
            businessId,
            status: 'PENDING',
          },
          orderBy: { createdAt: 'desc' },
        });

        const implementedAdvice = await prisma.advice.findMany({
          where: {
            businessId,
            status: 'IMPLEMENTED',
          },
          orderBy: { updatedAt: 'desc' },
          take: 5,
        });

        report.advice = {
          current: currentAdvice,
          implemented: implementedAdvice,
        };
      }

      // Store report in analytics
      await prisma.analytics.create({
        data: {
          businessId,
          type: 'PERFORMANCE_KPI',
          data: JSON.parse(JSON.stringify(report)),
          period: new Date(),
        },
      });

      return { data: report, error: null };
    } catch (error) {
      console.error('Error generating business report:', error);
      return { data: null, error: error instanceof Error ? error : new Error('Failed to generate report') };
    }
  }

  async getReportHistory(
    businessId: string,
    limit: number = 10
  ): Promise<{ data: any[] | null; error: Error | null }> {
    try {
      const reports = await prisma.analytics.findMany({
        where: {
          businessId,
          type: 'PERFORMANCE_KPI',
        },
        orderBy: {
          period: 'desc',
        },
        take: limit,
      });

      return { data: reports, error: null };
    } catch (error) {
      console.error('Error fetching report history:', error);
      return { data: null, error: new Error('Failed to fetch report history') };
    }
  }
}

export const reportingService = new ReportingService(); 