import { useEffect, useState, ReactNode } from "react";
import { AuthContext, AuthContextType } from './AuthContext';
import { supabase } from '../config/supabase';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthContextType["session"]>(null);
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error loading auth:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}