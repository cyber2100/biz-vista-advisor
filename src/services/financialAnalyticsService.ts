import { PrismaClient, AnalyticsType } from '@prisma/client';
import { addMonths, startOfMonth, endOfMonth, format } from 'date-fns';

const prisma = new PrismaClient();

interface MonthlyMetrics {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  growthRate?: number;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  averageMonthlyRevenue: number;
  averageMonthlyExpenses: number;
  monthlyMetrics: MonthlyMetrics[];
}

interface AnalyticsData {
  [key: string]: any;
  totalRevenue?: number;
  totalExpenses?: number;
  monthlyMetrics?: MonthlyMetrics[];
  monthlyExpenses?: Array<{ month: string; expenses: number }>;
  monthlyGrowth?: Array<{ month: string; growthRate: number }>;
  averageGrowth?: number;
  profitMargin?: number;
  revenueGrowth?: number;
  expenseRatio?: number;
}

interface BusinessRisk {
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
}

interface BusinessRecommendation {
  type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestion: string;
}

interface BusinessPerformance {
  profitMargin: number;
  revenueGrowth: number;
  consistentGrowth: boolean;
  volatility: number;
}

class FinancialAnalyticsService {
  async generateFinancialSummary(businessId: string, months: number = 12): Promise<{ data: FinancialSummary | null; error: Error | null }> {
    try {
      const endDate = new Date();
      const startDate = addMonths(endDate, -months);

      const financials = await prisma.financial.findMany({
        where: {
          businessId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
      });

      if (!financials.length) {
        return {
          data: {
            totalRevenue: 0,
            totalExpenses: 0,
            netProfit: 0,
            averageMonthlyRevenue: 0,
            averageMonthlyExpenses: 0,
            monthlyMetrics: [],
          },
          error: null,
        };
      }

      const monthlyData = new Map<string, MonthlyMetrics>();
      let totalRevenue = 0;
      let totalExpenses = 0;

      // Initialize monthly buckets
      for (let i = 0; i < months; i++) {
        const currentMonth = addMonths(startDate, i);
        const monthKey = format(currentMonth, 'yyyy-MM');
        monthlyData.set(monthKey, {
          month: monthKey,
          revenue: 0,
          expenses: 0,
          profit: 0,
        });
      }

      // Aggregate financial data by month
      financials.forEach((record) => {
        const monthKey = format(record.date, 'yyyy-MM');
        const monthData = monthlyData.get(monthKey) || {
          month: monthKey,
          revenue: 0,
          expenses: 0,
          profit: 0,
        };

        if (record.type === 'REVENUE') {
          monthData.revenue += record.amount;
          totalRevenue += record.amount;
        } else if (record.type === 'EXPENSE') {
          monthData.expenses += record.amount;
          totalExpenses += record.amount;
        }

        monthData.profit = monthData.revenue - monthData.expenses;
        monthlyData.set(monthKey, monthData);
      });

      // Calculate growth rates
      const monthlyMetrics = Array.from(monthlyData.values());
      for (let i = 1; i < monthlyMetrics.length; i++) {
        const previousRevenue = monthlyMetrics[i - 1].revenue;
        const currentRevenue = monthlyMetrics[i].revenue;
        monthlyMetrics[i].growthRate = previousRevenue === 0 ? 0 :
          ((currentRevenue - previousRevenue) / previousRevenue) * 100;
      }

      const summary: FinancialSummary = {
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        averageMonthlyRevenue: totalRevenue / months,
        averageMonthlyExpenses: totalExpenses / months,
        monthlyMetrics,
      };

      // Store analytics results
      await prisma.analytics.create({
        data: {
          businessId,
          type: 'REVENUE_TREND',
          data: this.serializeToJson(summary),
          period: endDate,
        },
      });

      return { data: summary, error: null };
    } catch (error) {
      console.error('Error generating financial summary:', error);
      return { data: null, error: new Error('Failed to generate financial summary') };
    }
  }

  async getBusinessAnalytics(
    businessId: string,
    type: AnalyticsType,
    period: Date
  ): Promise<{ data: AnalyticsData | null; error: Error | null }> {
    try {
      const analytics = await prisma.analytics.findMany({
        where: {
          businessId,
          type,
          period: {
            gte: period,
          },
        },
        orderBy: {
          period: 'asc',
        },
      });

      if (!analytics.length) {
        // Generate new analytics if none exist
        switch (type) {
          case 'REVENUE_TREND':
            const summary = await this.generateFinancialSummary(businessId, 12);
            return { data: summary.data, error: null };
          case 'EXPENSE_TREND':
            // Similar to revenue trend but focused on expenses
            const expenseSummary = await this.generateFinancialSummary(businessId, 12);
            return {
              data: {
                totalExpenses: expenseSummary.data?.totalExpenses || 0,
                monthlyExpenses: expenseSummary.data?.monthlyMetrics.map(m => ({
                  month: m.month,
                  expenses: m.expenses
                })) || [],
              },
              error: null,
            };
          case 'GROWTH_METRICS':
            const growthSummary = await this.generateFinancialSummary(businessId, 12);
            return {
              data: {
                monthlyGrowth: growthSummary.data?.monthlyMetrics.map(m => ({
                  month: m.month,
                  growthRate: m.growthRate || 0
                })) || [],
                averageGrowth: growthSummary.data?.monthlyMetrics.reduce((sum, m) => sum + (m.growthRate || 0), 0) / 
                              (growthSummary.data?.monthlyMetrics.length || 1),
              },
              error: null,
            };
          case 'PERFORMANCE_KPI':
            const kpiSummary = await this.generateFinancialSummary(businessId, 12);
            return {
              data: {
                profitMargin: kpiSummary.data ? 
                  (kpiSummary.data.netProfit / kpiSummary.data.totalRevenue) * 100 : 0,
                revenueGrowth: kpiSummary.data?.monthlyMetrics.slice(-1)[0]?.growthRate || 0,
                expenseRatio: kpiSummary.data ? 
                  (kpiSummary.data.totalExpenses / kpiSummary.data.totalRevenue) * 100 : 0,
              },
              error: null,
            };
          default:
            throw new Error('Unsupported analytics type');
        }
      }

      return { data: analytics[0].data as AnalyticsData, error: null };
    } catch (error) {
      console.error('Error fetching business analytics:', error);
      return { data: null, error: error instanceof Error ? error : new Error('Failed to fetch analytics') };
    }
  }

  async generateBusinessInsights(businessId: string): Promise<{ data: any; error: Error | null }> {
    try {
      const summary = await this.generateFinancialSummary(businessId, 12);
      if (!summary.data) {
        throw new Error('Failed to generate financial summary');
      }

      const insights = {
        performance: this.analyzePerformance(summary.data),
        recommendations: this.generateRecommendations(summary.data),
        risks: this.identifyRisks(summary.data),
      };

      return { data: insights, error: null };
    } catch (error) {
      console.error('Error generating business insights:', error);
      return { data: null, error: new Error('Failed to generate business insights') };
    }
  }

  private analyzePerformance(summary: FinancialSummary): BusinessPerformance {
    const performance = {
      profitMargin: (summary.netProfit / summary.totalRevenue) * 100,
      revenueGrowth: 0,
      consistentGrowth: false,
      volatility: 0
    };

    if (summary.monthlyMetrics.length > 1) {
      const growthRates = summary.monthlyMetrics
        .slice(1)
        .map(m => m.growthRate || 0);

      performance.revenueGrowth = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
      performance.consistentGrowth = growthRates.every(rate => rate > 0);
      performance.volatility = Math.sqrt(
        growthRates.reduce((sum, rate) => sum + Math.pow(rate - performance.revenueGrowth, 2), 0) / growthRates.length
      );
    }

    return performance;
  }

  private generateRecommendations(summary: FinancialSummary): BusinessRecommendation[] {
    const recommendations: BusinessRecommendation[] = [];
    const profitMargin = (summary.netProfit / summary.totalRevenue) * 100;

    if (profitMargin < 20) {
      recommendations.push({
        type: 'COST_REDUCTION',
        priority: 'HIGH',
        suggestion: 'Consider reviewing operational costs to improve profit margins'
      });
    }

    if (summary.monthlyMetrics.some(m => m.growthRate && m.growthRate < 0)) {
      recommendations.push({
        type: 'REVENUE_GROWTH',
        priority: 'MEDIUM',
        suggestion: 'Develop strategies to stabilize and improve monthly revenue growth'
      });
    }

    return recommendations;
  }

  private identifyRisks(summary: FinancialSummary): BusinessRisk[] {
    const risks: BusinessRisk[] = [];
    const lastThreeMonths = summary.monthlyMetrics.slice(-3);
    
    // Check for declining revenue trend
    if (lastThreeMonths.every((m, i, arr) => 
      i === 0 || m.revenue < arr[i - 1].revenue
    )) {
      risks.push({
        type: 'REVENUE_DECLINE',
        severity: 'HIGH',
        description: 'Consistent revenue decline over the last 3 months'
      });
    }

    // Check for increasing expenses
    if (lastThreeMonths.every((m, i, arr) => 
      i === 0 || m.expenses > arr[i - 1].expenses
    )) {
      risks.push({
        type: 'EXPENSE_GROWTH',
        severity: 'MEDIUM',
        description: 'Consistently increasing expenses over the last 3 months'
      });
    }

    return risks;
  }

  private serializeToJson(data: any): Record<string, any> {
    return JSON.parse(JSON.stringify(data));
  }
}

export const financialAnalyticsService = new FinancialAnalyticsService(); 