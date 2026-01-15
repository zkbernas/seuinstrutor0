import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, GraduationCap, DollarSign, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { instructorsApi } from '../../api/endpoints/instructors';
import { studentsApi } from '../../api/endpoints/students';
import { useBilling } from '../../billing/BillingContext';
import { PlanBadge } from '../../billing/components/PlanBadge';
import { UsageMeter } from '../../billing/components/UsageMeter';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';

// Mock data para gráficos (substituir por dados reais futuramente)
const revenueData = [
  { day: 'Seg', revenue: 1200 },
  { day: 'Ter', revenue: 1900 },
  { day: 'Qua', revenue: 1500 },
  { day: 'Qui', revenue: 2200 },
  { day: 'Sex', revenue: 2800 },
  { day: 'Sáb', revenue: 3200 },
  { day: 'Dom', revenue: 1800 },
];

const lessonsData = [
  { day: 'Seg', lessons: 12 },
  { day: 'Ter', lessons: 15 },
  { day: 'Qua', lessons: 10 },
  { day: 'Qui', lessons: 18 },
  { day: 'Sex', lessons: 22 },
  { day: 'Sáb', lessons: 25 },
  { day: 'Dom', lessons: 8 },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { plan, status, getPlanLimits } = useBilling();

  const { data: instructors, isLoading: loadingInstructors } = useQuery({
    queryKey: ['instructors'],
    queryFn: instructorsApi.list,
  });

  const { data: studentsStats, isLoading: loadingStudents } = useQuery({
    queryKey: ['students', 'stats'],
    queryFn: studentsApi.getStats,
  });

  const totalInstructors = instructors?.length || 0;
  const totalStudents = studentsStats?.active || 0;
  const isLoading = loadingInstructors || loadingStudents;

  const stats = [
    {
      label: 'Total de Instrutores',
      value: totalInstructors,
      icon: Users,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      label: 'Aulas Hoje',
      value: '--',
      icon: GraduationCap,
      color: 'bg-primary-500',
      trend: 'Em breve',
      isPlaceholder: true,
    },
    {
      label: 'Receita Mensal',
      value: '--',
      icon: DollarSign,
      color: 'bg-green-500',
      trend: 'Em breve',
      isPlaceholder: true,
    },
    {
      label: 'Taxa de Conclusão',
      value: '--',
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: 'Em breve',
      isPlaceholder: true,
    },
  ];

  const quickActions = [
    {
      title: 'Cadastrar Instrutor',
      description: 'Adicione um novo instrutor ao sistema',
      icon: Users,
      onClick: () => navigate('/app/instructors'),
      primary: true,
    },
    {
      title: 'Ver Instrutores',
      description: 'Visualize e gerencie todos os instrutores',
      icon: Users,
      onClick: () => navigate('/app/instructors'),
    },
    {
      title: 'Ver Planos',
      description: 'Confira planos e faça upgrade',
      icon: DollarSign,
      onClick: () => navigate('/app/billing'),
    },
  ];

  const limits = getPlanLimits();

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-200 via-primary-100 to-cream-100 rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-primary-300 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
            <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900" />
            <PlanBadge />
            {status === 'trial' && (
              <span className="text-xs lg:text-sm text-gray-900 font-bold bg-white px-2 py-0.5 rounded">
                Trial - 7 dias grátis
              </span>
            )}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-3">
            O sistema que organiza sua agenda, seus alunos e seu dinheiro
          </h1>
          <p className="text-base lg:text-lg text-gray-600 mb-4 lg:mb-6">
            Gerencie seus instrutores, agende aulas e acompanhe o crescimento do seu negócio em um só lugar.
          </p>
          {status !== 'active' && (
            <button
              onClick={() => navigate('/app/billing')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-primary-300 hover:bg-gray-800 rounded-xl transition-all font-bold text-base shadow-md hover:shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Ativar plano agora
            </button>
          )}
        </div>
      </div>

      {/* Usage Card */}
      {limits && (
        <div className="bg-white rounded-xl p-6 border border-cream-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Uso do Plano {limits.name}
          </h3>
          <UsageMeter showDetails />
          <div className="mt-4 pt-4 border-t border-cream-200">
            <p className="text-sm text-gray-700 mb-3">
              Você está no plano <strong className="text-gray-900">{limits.name}</strong> que permite até{' '}
              <strong className="text-gray-900">{limits.maxActiveStudents} alunos ativos</strong>.
            </p>
            <button
              onClick={() => navigate('/app/billing')}
              className="text-sm font-bold text-gray-900 hover:text-gray-700 underline underline-offset-2"
            >
              Ver todos os planos →
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-20" />
            </Card>
          ))
        ) : (
          stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className={`text-xs mt-2 ${
                      stat.isPlaceholder 
                        ? 'text-gray-400' 
                        : 'text-green-600'
                    }`}>
                      {stat.trend}
                    </p>
                  </div>
                  
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Decorative element */}
                <div className={`absolute -bottom-2 -right-2 w-24 h-24 ${stat.color} opacity-5 rounded-full`} />
              </Card>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div 
                key={index} 
                onClick={action.onClick}
                className="cursor-pointer"
              >
                <div 
                  className={`bg-white rounded-xl p-6 border transition-all group hover:shadow-md ${
                    action.primary 
                      ? 'border-primary-400 bg-gradient-to-br from-primary-50 to-white' 
                      : 'border-cream-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${
                      action.primary ? 'bg-primary-400' : 'bg-cream-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        action.primary ? 'text-gray-900' : 'text-gray-700'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </div>
                    
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Welcome Message */}
      {totalInstructors === 0 && !isLoading && (
        <div className="bg-gradient-to-br from-primary-100 to-cream-100 rounded-xl p-8 border border-primary-300 shadow-sm">
          <div className="text-center py-8">
            <GraduationCap className="w-12 h-12 text-gray-900 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Bem-vindo ao SeuInstrutor!
            </h3>
            <p className="text-gray-700 mb-6 max-w-md mx-auto">
              Comece cadastrando seu primeiro instrutor para aproveitar todas as funcionalidades do sistema.
            </p>
            <button
              onClick={() => navigate('/app/instructors')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-primary-300 hover:bg-gray-800 rounded-xl transition-all font-bold shadow-md hover:shadow-lg"
            >
              <Users className="w-5 h-5" />
              Cadastrar Primeiro Instrutor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
