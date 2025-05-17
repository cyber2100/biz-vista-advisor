// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    data: boolean | null;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        if (data.session?.user) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching user data:', error);
          } else {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth subscription
    const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setLoading(true);

      if (event === 'SIGNED_IN' && newSession?.user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', newSession.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUser(userData);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }

      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      data?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (userError) {
          console.error('Error fetching user data:', userError);
        } else {
          setUser(userData);
        }
      }

      return { data: data.session, error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      // Create user record in users table after signup
      if (data.user) {
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              role: 'user',
            },
          ]);
          
        if (userError) {
          console.error('Error creating user record:', userError);
        }
      }

      return { data: data.session, error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      return { data, error };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { data: null, error: error as Error };
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-business-teal" />
            <p className="text-xl text-business-navy">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}