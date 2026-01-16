import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export function RoleBasedRedirect() {
  const { user, isLoading } = useAuth();

  // Aguardar carregamento do contexto/auth
  if (isLoading) {
    return null; // ou um spinner
  }

  // Se não tiver usuário, redirecionar para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role;

  // Admin / Operator
  if (role === 'ADMIN' || role === 'OPERATOR') {
    return <Navigate to="/app/admin" replace />;
  }

  // Student
  if (role === 'STUDENT') {
    return <Navigate to="/app/home" replace />;
  }

  // Instructor (ou qualquer outro)
  return <Navigate to="/app/dashboard" replace />;
}
