import { createContext, useContext, useState, type ReactNode } from 'react';

export type BillingStatus = 'none' | 'trial' | 'active' | 'past_due' | 'canceled';
export type BillingPlan = 'starter' | 'pro' | 'scale' | null;

// Modelo de negócio: SaaS por planos mensais (sem comissão)
export const PLAN_LIMITS = {
  starter: {
    name: 'Starter',
    price: 197,
    maxActiveStudents: 10,
    features: [
      'Até 10 alunos ativos',
      'Agenda básica',
      'Pagamentos integrados',
      '1 WhatsApp',
      'Dashboard simples',
    ],
  },
  pro: {
    name: 'Pro',
    price: 297,
    maxActiveStudents: 20,
    features: [
      'Até 20 alunos ativos',
      'Relatórios financeiros',
      'Confirmações automáticas',
      '2 WhatsApps',
      'Regras de cancelamento/remarcação',
      'Dashboard avançado',
    ],
  },
  scale: {
    name: 'Scale',
    price: 497,
    maxActiveStudents: 50,
    features: [
      'Até 50 alunos ativos',
      'Agenda avançada',
      'Relatórios completos',
      '3 WhatsApps',
      'Automação total',
      'Suporte prioritário',
      'API de integração',
    ],
  },
} as const;

interface UsageData {
  activeStudents: number; // Dado real virá do backend
  maxStudents: number;
}

interface BillingContextData {
  status: BillingStatus;
  plan: BillingPlan;
  currentPeriodEnd: string | null;
  isActive: boolean;
  usage: UsageData;
  canAddStudent: boolean;
  // Métodos preparados para integração futura
  subscribe: (plan: BillingPlan) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updatePaymentMethod: () => Promise<void>;
  getPlanLimits: () => typeof PLAN_LIMITS[keyof typeof PLAN_LIMITS] | null;
}

const BillingContext = createContext<BillingContextData>({} as BillingContextData);

/**
 * BillingProvider - Sistema SaaS com planos reais
 * 
 * Modelo de negócio:
 * - Starter: R$ 197/mês - até 10 alunos
 * - Pro: R$ 297/mês - até 20 alunos
 * - Scale: R$ 497/mês - até 50 alunos
 * 
 * MOCK ATUAL (até integrar pagamentos):
 * - Status: trial (7 dias grátis)
 * - Plano: starter
 * - Para testar: altere manualmente aqui no código
 * 
 * PRÓXIMOS PASSOS (integração real):
 * 1. Backend: POST /subscriptions, GET /subscriptions/current
 * 2. Webhook: Stripe/Mercado Pago/PagSeguro
 * 3. Checkout: redirecionar para página de pagamento
 * 4. Atualizar contexto com dados reais da API
 */
export function BillingProvider({ children }: { children: ReactNode }) {
  // Mock - Em produção, buscar do backend via useQuery
  const [status, setStatus] = useState<BillingStatus>('trial'); // Altere aqui para testar: 'trial' | 'active' | 'past_due' | 'canceled' | 'none'
  const [plan, setPlan] = useState<BillingPlan>('starter'); // Altere aqui para testar: 'starter' | 'pro' | 'scale'
  const [currentPeriodEnd] = useState<string | null>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias de trial
  );

  // Mock de uso - Em produção, vem do GET /students/count ou similar
  const [activeStudentsCount] = useState(0); // Altere aqui para testar limites

  const isActive = status === 'active' || status === 'trial';

  const getPlanLimits = () => {
    if (!plan) return null;
    return PLAN_LIMITS[plan];
  };

  const limits = getPlanLimits();
  const maxStudents = limits?.maxActiveStudents || 0;

  const usage: UsageData = {
    activeStudents: activeStudentsCount,
    maxStudents,
  };

  const canAddStudent = isActive && activeStudentsCount < maxStudents;

  const subscribe = async (newPlan: BillingPlan) => {
    // TODO: Implementar integração real com pagamentos
    console.warn('[BILLING] Mock: Assinando plano', newPlan);
    console.log('Em produção: redirecionar para checkout de pagamento');
    
    // Simulação para testes (remover em produção)
    setPlan(newPlan);
    setStatus('active');
    
    // Código real (comentado para referência):
    // const response = await fetch('/api/subscriptions', {
    //   method: 'POST',
    //   body: JSON.stringify({ plan: newPlan }),
    // });
    // const { checkoutUrl } = await response.json();
    // window.location.href = checkoutUrl; // Redireciona para Stripe/MP
  };

  const cancelSubscription = async () => {
    console.warn('[BILLING] Mock: Cancelando assinatura');
    
    // Em produção:
    // await fetch('/api/subscriptions/current', { method: 'DELETE' });
    // setStatus('canceled');
  };

  const updatePaymentMethod = async () => {
    console.warn('[BILLING] Mock: Atualizando método de pagamento');
    
    // Em produção:
    // Redirecionar para portal de gerenciamento ou modal de atualização
  };

  return (
    <BillingContext.Provider
      value={{
        status,
        plan,
        currentPeriodEnd,
        isActive,
        usage,
        canAddStudent,
        subscribe,
        cancelSubscription,
        updatePaymentMethod,
        getPlanLimits,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const context = useContext(BillingContext);
  
  if (!context) {
    throw new Error('useBilling deve ser usado dentro de BillingProvider');
  }
  
  return context;
}
