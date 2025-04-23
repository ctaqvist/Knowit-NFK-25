import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Menu from '@/components/Editor/Menu';
import AuthMFA from '@/components/Editor/AuthMFA';
import Spinner from '@/components/Spinner';
function Editor() {
  const { user } = useAuth()
  const { MFAStatus, loading } = useAuth()

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) return <Spinner />

  // If user has enabled MFA + is currently unverified, will be asked to verify
  if (MFAStatus === 'Unverified') {
    return <AuthMFA onSuccess={() => window.location.reload()} />
  }
  return <Menu />
}

export default Editor;