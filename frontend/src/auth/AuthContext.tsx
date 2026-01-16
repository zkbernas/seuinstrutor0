import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authStore, User, Session } from './authStore';

interface AuthContextData {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string; remember?: boolean }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<User>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar sessão e usuário na inicialização
  useEffect(() => {
    const loadAuth = () => {
      const currentSession = authStore.getSession();
      const currentUser = authStore.getCurrentUser();

      if (currentSession && currentUser) {
        setSession(currentSession);
        setUser(currentUser);
      }

      setIsLoading(false);
    };

    loadAuth();
  }, []);

  const login = async (credentials: { email: string; password: string; remember?: boolean }) => {
    // Tentar usar backend primeiro
    try {
      const { authApi } = await import('../api/endpoints/auth');
      const response = await authApi.login(credentials);
      
      // Salvar token
      if (credentials.remember) {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        sessionStorage.setItem('access_token', response.access_token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
      }

      // Criar sessão e usuário do formato do backend
      const session: Session = {
        token: response.access_token,
        userId: response.user.id,
        role: (response.user.role || 'STUDENT') as User['role'],
        status: 'ACTIVE' as User['status'],
        expiresAt: new Date(Date.now() + (credentials.remember ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString(),
      };

      const user: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        password: '', // Não armazenar senha
        role: (response.user.role || 'STUDENT') as User['role'],
        status: 'ACTIVE' as User['status'],
        createdAt: new Date().toISOString(),
      };

      setSession(session);
      setUser(user);
    } catch (error) {
      // Fallback para mock store se backend falhar
      console.warn('Backend não disponível, usando mock store:', error);
      const session = authStore.login(credentials);
      const user = authStore.getCurrentUser();

      if (!user) {
        throw new Error('Erro ao obter dados do usuário');
      }

      setSession(session);
      setUser(user);
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    const user = authStore.register(data);
    return user;
  };

  const logout = () => {
    authStore.logout();
    setUser(null);
    setSession(null);
  };

  const refreshUser = () => {
    const currentUser = authStore.getCurrentUser();
    setUser(currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user && !!session,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
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
