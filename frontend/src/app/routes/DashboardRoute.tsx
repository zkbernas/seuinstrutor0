import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { DashboardPage } from '../../pages/app/DashboardPage';

export function DashboardRoute() {
  const { user, isLoading } = useAuth();

  // Aguardar carregamento
  if (isLoading) {
    return null;
  }

  // Bloquear students - redirecionar para home
  if (user?.role === 'STUDENT') {
    return <Navigate to="/app/home" replace />;
  }

  // Permitir acesso para outros roles (ADMIN, OPERATOR, INSTRUCTOR)
  return <DashboardPage />;
}
