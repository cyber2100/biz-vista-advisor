import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Subscription status check
export const getSubscriptionStatus = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

// Database types
export type User = {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Business = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  foundation_date: string;
  ceo: string;
  co_founders?: string;
  website?: string;
  user_role: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type BusinessDocument = {
  id: string;
  business_id: string;
  file_name: string;
  file_type: string;
  file_path: string;
  uploaded_at: string;
};

export type Currency = {
  id: string;
  code: string;
  name: string;
  rate: number;
  change: number;
  change_percent: number;
  updated_at: string;
  is_historical?: boolean;
};

export type SearchQuery = {
  id: string;
  user_id: string;
  query: string;
  results: any;
  created_at: string;
};

export type BusinessAdvice = {
  id: string;
  business_id: string;
  title: string;
  description: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  implemented: boolean;
  created_at: string;
  updated_at: string;
};

export type SubscriptionTier = {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  created_at: string;
  updated_at: string;
};

export type UserSubscription = {
  id: string;
  user_id: string;
  tier_id: string;
  status: 'active' | 'canceled' | 'expired';
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
};

export type PaymentTransaction = {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  provider: 'stripe' | 'paypal';
  provider_transaction_id: string;
  created_at: string;
};