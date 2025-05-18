import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateSubscriptionDTO {
  businessId: string;
  userId: string;
}

class SubscriptionService {
  async createFreeSubscription(data: CreateSubscriptionDTO) {
    try {
      const subscription = await prisma.subscription.create({
        data: {
          businessId: data.businessId,
          stripeCustomerId: 'free_tier',
          stripePriceId: 'free_tier',
          status: 'ACTIVE',
          plan: 'FREE',
          currentPeriodEnd: new Date('2099-12-31'), // Effectively unlimited for free tier
        },
      });

      return { data: subscription, error: null };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return { data: null, error: new Error('Subscription already exists for this business') };
        }
      }
      return { data: null, error: new Error('Failed to create subscription') };
    }
  }

  async getSubscription(businessId: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { businessId },
      });
      return { data: subscription, error: null };
    } catch (error) {
      return { data: null, error: new Error('Failed to fetch subscription') };
    }
  }

  async checkSubscriptionAccess(businessId: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { businessId },
      });

      // For now, all users have access to free tier features
      return {
        hasAccess: true,
        plan: subscription?.plan || 'FREE',
        isFreeUser: !subscription || subscription.plan === 'FREE'
      };
    } catch (error) {
      console.error('Error checking subscription access:', error);
      return { hasAccess: true, plan: 'FREE', isFreeUser: true };
    }
  }
}

export const subscriptionService = new SubscriptionService(); 