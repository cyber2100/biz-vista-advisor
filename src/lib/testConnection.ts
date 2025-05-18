import { supabase } from './supabase';

async function testSupabaseConnection() {
  try {
    // Try to get the current user as a simple test
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return;
    }
    
    console.log('Supabase connection successful!');
    console.log('Current environment variables:');
    console.log('SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
    // Don't log the full anon key for security
    console.log('SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
    
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testSupabaseConnection(); 