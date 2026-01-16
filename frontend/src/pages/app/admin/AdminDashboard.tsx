import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileCheck, 
  Shield, 
  DollarSign, 
  BarChart3, 
  CheckCircle,
  XCircle,
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import { adminStore } from '../../../admin/mock/adminStore';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redireciona se não for ADMIN - deixar RoleBasedRedirect decidir
    if (user?.role !== 'ADMIN') {
      navigate('/app');
    }
  }, [user, navigate]);

  if (user?.role !== 'ADMIN') {
    return null;
  }

  // Buscar dados reais do store
  const stats = useMemo(() => adminStore.getDashboardStats(), []);

  const kpis = [
    {
      label: 'Total de Usuários',
      value: stats.totalUsers.toString(),
      icon: Users,
    },
    {
      label: 'Instrutores Aprovados',
      value: stats.approvedInstructors.toString(),
      icon: CheckCircle,
    },
    {
      label: 'Pendentes Verificação',
      value: stats.pendingDocuments.toString(),
      icon: FileCheck,
    },
    {
      label: 'MRR Estimado',
      value: `R$ ${(stats.estimatedMRR / 1000).toFixed(1)}k`,
      icon: DollarSign,
    },
  ];

  const adminActions = [
    {
      title: 'Gerenciar Usuários',
      description: 'Ver, editar e bloquear usuários do sistema',
      icon: Users,
      route: '/app/admin/users',
    },
    {
      title: 'Verificar Documentos',
      description: 'Aprovar ou reprovar documentos de instrutores',
      icon: FileCheck,
      route: '/app/admin/documents',
    },
    {
      title: 'Relatórios Financeiros',
      description: 'Visualizar receitas, pagamentos e MRR',
      icon: BarChart3,
      route: '/app/admin/finance',
    },
    {
      title: 'Auditoria',
      description: 'Log de ações e histórico do sistema',
      icon: Shield,
      route: '/app/admin/audit',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Minimalista */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        </div>
        <p className="text-sm text-gray-600">
          Área de administração do sistema. Todas as ações são registradas.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{kpi.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Actions */}
      <div>
        <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Ferramentas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {adminActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(action.route)}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all hover:border-gray-900 text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                    <Icon className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-0.5">{action.title}</h3>
                    <p className="text-xs text-gray-600">{action.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Avisos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-700 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                {stats.pendingDocuments} documentos pendentes
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                Há instrutores aguardando aprovação.
              </p>
              <button
                onClick={() => navigate('/app/admin/documents')}
                className="text-xs font-semibold text-gray-900 hover:underline"
              >
                Ver documentos →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-gray-700 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1 text-sm">Sistema operando</h4>
              <p className="text-xs text-gray-600">
                Todos os serviços estão online.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
