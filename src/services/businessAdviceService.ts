import { PrismaClient, AdviceType, AdviceStatus } from '@prisma/client';
import { financialAnalyticsService } from './financialAnalyticsService';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface BusinessAdvice {
  type: AdviceType;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  actionItems: string[];
  industry?: string;
  trend?: string;
  effectiveness?: number;
}

interface TrendAnalysis {
  trend: string;
  significance: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: number;
}

interface BusinessInsights {
  performance: {
    profitMargin: number;
    revenueGrowth: number;
    volatility: number;
    consistentGrowth: boolean;
  };
  risks: Array<{
    type: string;
    severity: string;
    description: string;
  }>;
  recommendations: any[];
}

interface AdviceMetadata {
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  actionItems: string[];
  industry?: string;
  trend?: string;
  effectiveness?: number;
}

class BusinessAdviceService {
  private readonly industryBenchmarks = {
    RETAIL: { profitMargin: 25, growthRate: 10, volatility: 12 },
    ECOMMERCE: { profitMargin: 30, growthRate: 15, volatility: 15 },
    SERVICE: { profitMargin: 35, growthRate: 8, volatility: 10 },
    MANUFACTURING: { profitMargin: 20, growthRate: 5, volatility: 8 },
    TECHNOLOGY: { profitMargin: 40, growthRate: 20, volatility: 18 },
    OTHER: { profitMargin: 25, growthRate: 10, volatility: 12 }
  };

  async generateAdvice(businessId: string): Promise<{ data: BusinessAdvice[] | null; error: Error | null }> {
    try {
      // Get business insights and details
      const [insights, business] = await Promise.all([
        financialAnalyticsService.generateBusinessInsights(businessId),
        prisma.business.findUnique({ where: { id: businessId } })
      ]);

      if (insights.error) throw insights.error;
      if (!business) throw new Error('Business not found');

      const insightsData = insights.data as BusinessInsights;
      const adviceList: BusinessAdvice[] = [];
      const benchmark = this.industryBenchmarks[business.type] || this.industryBenchmarks.OTHER;

      // Analyze trends
      const trends = await this.analyzeTrends(businessId);
      
      // Financial advice based on industry benchmarks
      if (insightsData.performance.profitMargin < benchmark.profitMargin) {
        const effectiveness = await this.calculateAdviceEffectiveness(businessId, 'FINANCIAL');
        adviceList.push({
          type: 'FINANCIAL',
          content: `Your profit margins (${insightsData.performance.profitMargin.toFixed(1)}%) are below the ${business.type} industry average of ${benchmark.profitMargin}%.`,
          priority: 'HIGH',
          actionItems: [
            'Review and optimize operational costs',
            'Consider strategic pricing adjustments',
            'Identify and eliminate inefficient processes',
            `Research ${business.type} industry best practices for margin improvement`
          ],
          industry: business.type,
          trend: trends.find(t => t.trend === 'PROFIT_MARGIN')?.trend,
          effectiveness
        });
      }

      // Growth advice based on industry benchmarks
      if (insightsData.performance.revenueGrowth < benchmark.growthRate) {
        const effectiveness = await this.calculateAdviceEffectiveness(businessId, 'OPERATIONAL');
        adviceList.push({
          type: 'OPERATIONAL',
          content: `Your growth rate (${insightsData.performance.revenueGrowth.toFixed(1)}%) is below the ${business.type} industry average of ${benchmark.growthRate}%.`,
          priority: 'MEDIUM',
          actionItems: [
            'Develop industry-specific marketing strategies',
            'Analyze competitor growth tactics',
            'Identify new market opportunities',
            `Implement ${business.type}-focused customer acquisition strategies`
          ],
          industry: business.type,
          trend: trends.find(t => t.trend === 'REVENUE_GROWTH')?.trend,
          effectiveness
        });
      }

      // Volatility advice
      if (insightsData.performance.volatility > benchmark.volatility) {
        const effectiveness = await this.calculateAdviceEffectiveness(businessId, 'STRATEGIC');
        adviceList.push({
          type: 'STRATEGIC',
          content: `Your revenue volatility (${insightsData.performance.volatility.toFixed(1)}%) is higher than the ${business.type} industry average of ${benchmark.volatility}%.`,
          priority: 'MEDIUM',
          actionItems: [
            'Diversify revenue streams',
            'Build recurring revenue models',
            'Implement risk management strategies',
            `Study ${business.type} industry seasonality patterns`
          ],
          industry: business.type,
          trend: trends.find(t => t.trend === 'VOLATILITY')?.trend,
          effectiveness
        });
      }

      // Risk-related advice
      const riskAdvicePromises = insightsData.risks
        .filter(risk => risk.severity === 'HIGH')
        .map(async risk => {
          const effectiveness = await this.calculateAdviceEffectiveness(businessId, 'RISK');
          return {
            type: 'RISK',
            content: `${risk.description} - This is critical for your ${business.type} business.`,
            priority: 'HIGH',
            actionItems: this.generateRiskActionItems(risk.type, business.type),
            industry: business.type,
            trend: trends.find(t => t.trend === risk.type)?.trend,
            effectiveness
          } as BusinessAdvice;
        });

      const riskAdvice = await Promise.all(riskAdvicePromises);
      adviceList.push(...riskAdvice);

      // Store advice in database with enhanced metadata
      await Promise.all(adviceList.map(advice =>
        prisma.advice.create({
          data: {
            businessId,
            type: advice.type,
            content: advice.content,
            status: 'PENDING',
            metadata: {
              priority: advice.priority,
              actionItems: advice.actionItems,
              industry: advice.industry || null,
              trend: advice.trend || null,
              effectiveness: advice.effectiveness || 0
            } as unknown as Prisma.JsonValue
          }
        })
      ));

      return { data: adviceList, error: null };
    } catch (error) {
      console.error('Error generating business advice:', error);
      return { data: null, error: new Error('Failed to generate business advice') };
    }
  }

  private generateRiskActionItems(riskType: string, industryType: string): string[] {
    const baseItems = {
      REVENUE_DECLINE: [
        'Review pricing strategy',
        'Enhance marketing efforts',
        'Analyze customer churn',
        'Develop new revenue streams'
      ],
      EXPENSE_GROWTH: [
        'Conduct cost-benefit analysis',
        'Identify cost-cutting opportunities',
        'Negotiate with suppliers',
        'Optimize resource allocation'
      ]
    };

    const industrySpecificItems = {
      RETAIL: {
        REVENUE_DECLINE: [
          'Optimize store layouts and product placement',
          'Implement customer loyalty programs',
          'Analyze foot traffic patterns'
        ],
        EXPENSE_GROWTH: [
          'Review inventory management practices',
          'Optimize staffing schedules',
          'Evaluate store operating hours'
        ]
      },
      ECOMMERCE: {
        REVENUE_DECLINE: [
          'Optimize conversion funnel',
          'Improve website performance',
          'Enhance digital marketing strategies'
        ],
        EXPENSE_GROWTH: [
          'Review shipping costs and options',
          'Optimize warehouse operations',
          'Automate order processing'
        ]
      }
      // Add more industry-specific items as needed
    };

    const baseActionItems = baseItems[riskType] || [
      'Develop risk mitigation strategy',
      'Monitor key performance indicators',
      'Review business processes'
    ];

    const industryItems = industrySpecificItems[industryType]?.[riskType] || [];
    return [...baseActionItems, ...industryItems];
  }

  public async analyzeTrends(businessId: string): Promise<TrendAnalysis[]> {
    try {
      const historicalAdvice = await prisma.advice.findMany({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          metadata: true,
          status: true
        }
      });

      const trends: TrendAnalysis[] = [];
      const metrics = ['PROFIT_MARGIN', 'REVENUE_GROWTH', 'VOLATILITY'];

      for (const metric of metrics) {
        const relatedAdvice = historicalAdvice.filter(
          advice => {
            const metadata = advice.metadata as { trend?: string };
            return metadata?.trend === metric;
          }
        );

        if (relatedAdvice.length > 0) {
          const implementedCount = relatedAdvice.filter(
            advice => advice.status === 'IMPLEMENTED'
          ).length;

          const impact = (implementedCount / relatedAdvice.length) * 100;
          trends.push({
            trend: metric,
            significance: impact > 70 ? 'HIGH' : impact > 40 ? 'MEDIUM' : 'LOW',
            impact
          });
        }
      }

      return trends;
    } catch (error) {
      console.error('Error analyzing trends:', error);
      return [];
    }
  }

  public async calculateAdviceEffectiveness(businessId: string, type: AdviceType): Promise<number> {
    try {
      const historicalAdvice = await prisma.advice.findMany({
        where: { 
          businessId,
          type,
          status: 'IMPLEMENTED'
        },
        orderBy: { updatedAt: 'desc' },
        take: 5
      });

      if (historicalAdvice.length === 0) return 0;

      const implementedCount = historicalAdvice.length;
      const totalAdvice = await prisma.advice.count({
        where: {
          businessId,
          type,
          createdAt: {
            gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
          }
        }
      });

      return (implementedCount / totalAdvice) * 100;
    } catch (error) {
      console.error('Error calculating advice effectiveness:', error);
      return 0;
    }
  }

  async updateAdviceStatus(adviceId: string, status: AdviceStatus): Promise<{ error: Error | null }> {
    try {
      await prisma.advice.update({
        where: { id: adviceId },
        data: { 
          status,
          updatedAt: new Date()
        }
      });
      return { error: null };
    } catch (error) {
      console.error('Error updating advice status:', error);
      return { error: new Error('Failed to update advice status') };
    }
  }

  async getImplementedAdvice(
    businessId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: any[] | null; error: Error | null; total: number }> {
    try {
      const [advice, total] = await Promise.all([
        prisma.advice.findMany({
          where: {
            businessId,
            status: 'IMPLEMENTED'
          },
          orderBy: {
            updatedAt: 'desc'
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            business: {
              select: {
                name: true,
                type: true
              }
            }
          }
        }),
        prisma.advice.count({
          where: {
            businessId,
            status: 'IMPLEMENTED'
          }
        })
      ]);

      return { 
        data: advice, 
        error: null,
        total
      };
    } catch (error) {
      console.error('Error fetching implemented advice:', error);
      return { 
        data: null, 
        error: new Error('Failed to fetch implemented advice'),
        total: 0
      };
    }
  }
}

export const businessAdviceService = new BusinessAdviceService(); 