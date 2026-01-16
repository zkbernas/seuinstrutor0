import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Proteção de rotas privadas
 * Redireciona para /login se não autenticado
 * Redireciona para /pending-review se status PENDING_REVIEW ou REJECTED
 * Redireciona para /login?error=blocked se BLOCKED
 */
export function AuthGuard() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar status do usuário
  if (user.status === 'BLOCKED') {
    return <Navigate to="/login?error=blocked" replace />;
  }

  // Permitir acesso mesmo com PENDING_REVIEW ou REJECTED
  // O alerta será mostrado no perfil
  return <Outlet />;
}

/**
 * Proteção de rotas admin
 * Requer autenticação + role ADMIN ou OPERATOR
 */
export function AdminGuard() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar status
  if (user.status === 'BLOCKED') {
    return <Navigate to="/login?error=blocked" replace />;
  }

  if (user.status === 'PENDING_REVIEW' || user.status === 'REJECTED') {
    return <Navigate 
      to="/pending-review" 
      state={{ status: user.status }} 
      replace 
    />;
  }

  // Verificar role
  // Se não for ADMIN/OPERATOR, redirecionar para /app e deixar RoleBasedRedirect decidir
  if (user.role !== 'ADMIN' && user.role !== 'OPERATOR') {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}

/**
 * Proteção de rotas públicas (login, register)
 * Redireciona para /app se já autenticado
 */
export function PublicRoute() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Redirecionar para /app e deixar RoleBasedRedirect decidir o destino final
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}
