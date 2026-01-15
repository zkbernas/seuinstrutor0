import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/endpoints/auth';
import { authStorage } from './auth.storage';
import type { User, LoginRequest } from '../api/types';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega usuário do localStorage na inicialização
  useEffect(() => {
    const storedUser = authStorage.getUser();
    const storedToken = authStorage.getToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    
    // Salva token e usuário
    authStorage.setToken(response.access_token);
    authStorage.setUser(response.user);
    
    setUser(response.user);
  };

  const logout = () => {
    authStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  
  return context;
}
