import { createContext } from "react";
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  MFAStatus: 'Verified' | 'Unverified' | null | undefined
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);