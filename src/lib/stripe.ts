import Stripe from 'stripe';

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const STRIPE_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: ['Basic business analytics', 'Limited financial advice'],
  },
  BASIC: {
    name: 'Basic',
    price: 9.99,
    features: ['Full business analytics', 'Basic financial advice', 'Email support'],
    priceId: process.env.VITE_STRIPE_BASIC_PRICE_ID,
  },
  PRO: {
    name: 'Pro',
    price: 29.99,
    features: [
      'Advanced analytics',
      'Comprehensive financial advice',
      'Priority support',
      'Custom reports',
    ],
    priceId: process.env.VITE_STRIPE_PRO_PRICE_ID,
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 99.99,
    features: [
      'Custom analytics solutions',
      'Dedicated financial advisor',
      '24/7 support',
      'API access',
    ],
    priceId: process.env.VITE_STRIPE_ENTERPRISE_PRICE_ID,
  },
};

export const createStripeCheckoutSession = async (
  priceId: string,
  customerId?: string,
  email?: string
) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customerId,
    customer_email: !customerId ? email : undefined,
    success_url: `${window.location.origin}/app/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${window.location.origin}/app/payment/cancelled`,
  });

  return session;
};

export const createStripePortalSession = async (customerId: string) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${window.location.origin}/app/settings`,
  });

  return session;
};

export const getStripeCustomer = async (customerId: string) => {
  const customer = await stripe.customers.retrieve(customerId);
  return customer;
};

export const createStripeCustomer = async (email: string, name?: string) => {
  const customer = await stripe.customers.create({
    email,
    name,
  });
  return customer;
};

export const cancelStripeSubscription = async (subscriptionId: string) => {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}; 