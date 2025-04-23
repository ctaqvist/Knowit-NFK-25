import { useEffect, useState, ReactNode } from "react";
import { AuthContext, AuthContextType } from './AuthContext';
import { supabase } from '../config/supabase';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthContextType["session"]>(null);
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [MFAStatus, setMFAStatus] = useState<AuthContextType["MFAStatus"]>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    (async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
        if (error || !data || !session?.user.factors) return setMFAStatus(null)
        if (data.currentLevel === 'aal1' && data.nextLevel === 'aal2') return setMFAStatus('Unverified')
        if (data.currentLevel === 'aal2' && data.nextLevel === 'aal2') return setMFAStatus('Verified')
        else if (data.currentLevel === 'aal1' && data.nextLevel === 'aal1') return setMFAStatus(null)
      } catch (error) {
        setMFAStatus(null)
      } finally {
        setLoading(false)
      }
    })()


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