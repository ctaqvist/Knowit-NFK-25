import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Menu from '@/components/Editor/Menu';
import AuthMFA from '@/components/Editor/AuthMFA';
import Spinner from '@/components/Spinner';
import { EnrollMFA } from '@/components/Editor/EnrollMFA';
import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';

type MFAStatus = 'Verified' | 'Unverified' | null

function Editor() {
  const { user } = useAuth()
  const [MFAStatus, setMFAStatus] = useState<MFAStatus>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getMFAStatus() {
      try {
        const { data: assuranceData, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (assuranceError || !assuranceData) throw assuranceError

        if (assuranceData.currentLevel === 'aal1' && assuranceData.nextLevel === 'aal2') {
          return setMFAStatus('Unverified');
        } else if (assuranceData.currentLevel === 'aal2') {
          return setMFAStatus('Verified');
        }
        setMFAStatus(null)

      } catch (error) {
        console.error(error)
        setMFAStatus(null)
      } finally {
        setLoading(false)
      }
    }

    getMFAStatus()
  }, [])

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) return <Spinner />

  // If user has enabled MFA + is currently unverified, will be asked to verify
  if (!MFAStatus) {
    return <EnrollMFA onEnrolled={() => window.location.reload()} />
  } else if (MFAStatus === 'Unverified') {
    return <AuthMFA onSuccess={() => window.location.reload()} />
  }
  return <Menu />
}

export default Editor;