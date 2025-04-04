import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';

export const AuthRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/editor");
    }
  }, [user, navigate]);

  return null;
};