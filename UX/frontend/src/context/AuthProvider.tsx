import { useEffect, useState, ReactNode } from "react";
import { AuthContext, AuthContextType } from './AuthContext';
import { supabase } from '../config/supabase';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthContextType["session"]>(null);
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [MFAStatus, setMFAStatus] = useState<AuthContextType["MFAStatus"]>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        const { data: assuranceData, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        const { data: factorData, error: factorError } = await supabase.auth.mfa.listFactors();

        if (assuranceError || !assuranceData || factorError || factorData.all.length < 1) {
          setMFAStatus(null);
        } else if (assuranceData.currentLevel === 'aal1' && assuranceData.nextLevel === 'aal2') {
          setMFAStatus('Unverified');
        } else if (assuranceData.currentLevel === 'aal2') {
          setMFAStatus('Verified');
        } else {
          setMFAStatus(null);
        }
      } catch (error) {
        console.error('Error loading auth:', error);
        setMFAStatus(null);
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
    MFAStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}