import { createContext, ReactNode } from 'react';
import { Auth } from './Auth';
import { authInstance } from './authInstance';

interface AuthContextType {
  auth: Auth;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const value = { auth: authInstance };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};