import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';


function Editor() {
  const { user, signOut } = useAuth()

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <button onClick={signOut}>Logout</button>
      <p>Currently logged in as admin: {user.email}</p>
    </>
  )

}

export default Editor;