import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, UserRole } from '@/types';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      setAuthState({ user: JSON.parse(user), isAuthenticated: true });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const resp = await api.auth.login({ email, password });

      if (resp.success) {
        localStorage.setItem('user', JSON.stringify(resp.user));
        localStorage.setItem('token', resp.token);
        setAuthState({ user: resp.user, isAuthenticated: true });

        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${resp.user.name}`,
        });
        return true;
      }
      return false;
    } catch (err: any) {
      toast({
        title: "Échec de connexion",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuthState({ user: null, isAuthenticated: false });
    window.location.href = '/login';
  };

  const hasRole = (roles: UserRole[]) => {
    return authState.user ? roles.includes(authState.user.role) : false;
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
