import { supabase, Currency } from '@/lib/supabase';

export async function getCurrencies(includeHistorical: boolean = false) {
  try {
    let query = supabase
      .from('currencies')
      .select('*')
      .order('code', { ascending: true });
      
    if (!includeHistorical) {
      query = query.eq('is_historical', false);
    }
    
    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return { data: null, error };
  }
}

export async function getHistoricalCurrencies() {
  try {
    const { data, error } = await supabase
      .from('currencies')
      .select('*')
      .eq('is_historical', true)
      .order('code', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching historical currencies:', error);
    return { data: null, error };
  }
}

export async function getCurrencyByCode(code: string) {
  try {
    const { data, error } = await supabase
      .from('currencies')
      .select('*')
      .eq('code', code)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching currency:', error);
    return { data: null, error };
  }
}

// Function to simulate fetching real-time currency rates
// In a production environment, this would be replaced with an actual API call
export async function fetchLatestRates() {
  // Here we're returning mock data, but in a real app you'd call a currency API
  const mockCurrencies = [
    {
      code: "USD",
      name: "US Dollar",
      rate: 1.0,
      change: 0.0,
      change_percent: 0.0,
      is_historical: false
    },
    {
      code: "EUR",
      name: "Euro",
      rate: 0.91,
      change: -0.002,
      change_percent: -0.22,
      is_historical: false
    },
    {
      code: "GBP",
      name: "British Pound",
      rate: 0.79,
      change: 0.004,
      change_percent: 0.51,
      is_historical: false
    },
    {
      code: "JPY",
      name: "Japanese Yen",
      rate: 149.52,
      change: 0.52,
      change_percent: 0.35,
      is_historical: false
    },
    {
      code: "CNY",
      name: "Chinese Yuan",
      rate: 7.25,
      change: -0.01,
      change_percent: -0.14,
      is_historical: false
    },
    {
      code: "DEM",
      name: "German Mark",
      rate: 1.95583,
      change: 0,
      change_percent: 0,
      is_historical: true
    },
    {
      code: "FRF",
      name: "French Franc",
      rate: 6.55957,
      change: 0,
      change_percent: 0,
      is_historical: true
    },
  ];

  // In a real app you would update your database with the latest rates
  try {
    for (const currency of mockCurrencies) {
      const { error } = await supabase
        .from('currencies')
        .upsert(
          {
            ...currency,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'code' }
        );

      if (error) throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating currency rates:', error);
    return { success: false, error };
  }
}