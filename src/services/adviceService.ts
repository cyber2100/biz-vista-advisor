import { supabase, BusinessAdvice } from '@/lib/supabase';

export async function getBusinessAdvice(businessId: string) {
  try {
    const { data, error } = await supabase
      .from('business_advice')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching business advice:', error);
    return { data: null, error };
  }
}

export async function createBusinessAdvice(adviceData: Omit<BusinessAdvice, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('business_advice')
      .insert([adviceData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating business advice:', error);
    return { data: null, error };
  }
}

export async function updateBusinessAdvice(id: string, adviceData: Partial<BusinessAdvice>) {
  try {
    const { data, error } = await supabase
      .from('business_advice')
      .update(adviceData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating business advice:', error);
    return { data: null, error };
  }
}

export async function deleteBusinessAdvice(id: string) {
  try {
    const { error } = await supabase
      .from('business_advice')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting business advice:', error);
    return { error };
  }
}

export async function toggleImplementationStatus(id: string, implemented: boolean) {
  try {
    const { data, error } = await supabase
      .from('business_advice')
      .update({ implemented, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error toggling implementation status:', error);
    return { data: null, error };
  }
}

export async function searchBusinessAdvice(businessId: string, query: string) {
  try {
    const { data, error } = await supabase
      .from('business_advice')
      .select('*')
      .eq('business_id', businessId)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Store search query for future reference
    await supabase.from('search_queries').insert([
      {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        query,
        results: data,
      },
    ]);

    return { data, error: null };
  } catch (error) {
    console.error('Error searching business advice:', error);
    return { data: null, error };
  }
}

// Function to generate advice based on business profile
export async function generateAdviceForBusiness(businessId: string) {
  try {
    // Get business information
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (businessError) throw businessError;

    // In a real app, this would call an API or ML model
    // For now, we'll generate some sample advice based on business type
    const adviceTemplates = [
      {
        title: 'Optimize your currency exchange strategy',
        description: 'Based on current exchange rate trends, consider purchasing EUR in the next 2-3 months as indicators suggest favorable movement against your base currency.',
        category: 'finance',
        impact: 'high' as const,
        effort: 'medium' as const,
      },
      {
        title: 'Expand your digital marketing presence',
        description: `Your industry analytics show below-average digital presence for ${business.type} businesses. Consider investing in SEO and content marketing to improve visibility and customer acquisition.`,
        category: 'marketing',
        impact: 'high' as const,
        effort: 'high' as const,
      },
      {
        title: 'Implement customer retention program',
        description: 'Your customer retention is above industry average, but implementing a loyalty program could further increase repeat business by an estimated 15%.',
        category: 'customer',
        impact: 'medium' as const,
        effort: 'medium' as const,
      },
      {
        title: 'Review operational expenses',
        description: 'Your operational expenses are 1.5% below industry average. Continue monitoring supply chain costs which have shown volatility in recent months.',
        category: 'operations',
        impact: 'medium' as const,
        effort: 'low' as const,
      },
      {
        title: 'Consider regional market expansion',
        description: 'Market analysis shows potential growth opportunities in neighboring regions with similar customer demographics to your current base.',
        category: 'growth',
        impact: 'high' as const,
        effort: 'high' as const,
      },
    ];

    // Check if advice already exists
    const { data: existingAdvice } = await supabase
      .from('business_advice')
      .select('title')
      .eq('business_id', businessId);
    
    const existingTitles = existingAdvice?.map(a => a.title) || [];
    
    // Filter out advice that already exists
    const newAdvice = adviceTemplates.filter(a => !existingTitles.includes(a.title));
    
    if (newAdvice.length === 0) {
      return { data: [], error: null };
    }

    // Insert advice
    const adviceToInsert = newAdvice.map(advice => ({
      ...advice,
      business_id: businessId,
      implemented: false,
    }));

    const { data, error } = await supabase
      .from('business_advice')
      .insert(adviceToInsert)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error generating advice:', error);
    return { data: null, error };
  }
}