import { useState } from 'react';
import { Check, CreditCard, Zap, Sparkles } from 'lucide-react';
import { useBilling, PLAN_LIMITS } from '../../billing/BillingContext';
import { PlanBadge } from '../../billing/components/PlanBadge';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { toast } from '../../components/ui/Toast';
import { cn } from '../../utils/cn';

interface Plan {
  id: 'starter' | 'pro' | 'scale';
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  recommended?: boolean;
}

// Planos reais do modelo de negócio SaaS
const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 197,
    period: 'mês',
    description: 'Perfeito para instrutores começando',
    features: [...PLAN_LIMITS.starter.features],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 297,
    period: 'mês',
    description: 'Para quem quer crescer com automação',
    features: [...PLAN_LIMITS.pro.features],
    highlighted: true,
    badge: 'Mais Popular',
    recommended: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 497,
    period: 'mês',
    description: 'Máxima produtividade e suporte',
    features: [...PLAN_LIMITS.scale.features],
  },
];

export function BillingPlansPage() {
  const { plan: currentPlan, status, subscribe } = useBilling();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);

  const handleSubscribe = async (planId: 'starter' | 'pro' | 'scale') => {
    setSelectedPlan(planId);
    
    try {
      await subscribe(planId);
      toast.success(`Plano ${plans.find(p => p.id === planId)?.name} ativado! (Mock)`);
      toast.info('Em produção: você será redirecionado para o checkout de pagamento');
    } catch (error) {
      toast.error('Erro ao processar assinatura');
    } finally {
      setSelectedPlan(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Planos e Assinaturas"
        description="O sistema que organiza sua agenda, seus alunos e seu dinheiro"
      />

      {/* Plano Atual */}
      {currentPlan && (
        <Card className="mb-8 bg-gradient-to-r from-primary-50 to-white border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Plano Atual</h3>
                <PlanBadge plan={currentPlan} />
                {status === 'trial' && (
                  <Badge variant="warning">Trial - 7 dias grátis</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {status === 'trial' 
                  ? 'Aproveite o período de teste grátis'
                  : status === 'active'
                  ? 'Assinatura ativa'
                  : 'Status: ' + status
                }
              </p>
            </div>
            {status !== 'active' && (
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">
                  Ative agora e comece a organizar seus alunos!
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Toggle Annual/Monthly */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className={cn(
          'text-sm font-medium',
          !isAnnual ? 'text-gray-900' : 'text-gray-500'
        )}>
          Mensal
        </span>
        
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className="relative w-14 h-7 bg-gray-200 rounded-full transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          style={{ backgroundColor: isAnnual ? '#84cc16' : undefined }}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform',
              isAnnual && 'translate-x-7'
            )}
          />
        </button>
        
        <span className={cn(
          'text-sm font-medium',
          isAnnual ? 'text-gray-900' : 'text-gray-500'
        )}>
          Anual
        </span>
        
        {isAnnual && (
          <Badge variant="success">
            Economize 20%
          </Badge>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan) => {
          const finalPrice = isAnnual ? plan.price * 0.8 : plan.price;
          
          return (
            <Card
              key={plan.id}
              className={cn(
                'relative flex flex-col',
                plan.highlighted && 'ring-2 ring-primary-500 shadow-lg scale-105',
                currentPlan === plan.id && 'ring-2 ring-blue-500'
              )}
              padding="lg"
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="success" className="px-4 py-1 shadow-sm">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              {currentPlan === plan.id && (
                <div className="absolute -top-4 right-4">
                  <Badge variant="info" className="px-3 py-1 shadow-sm">
                    Seu Plano
                  </Badge>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {plan.description}
                </p>
                
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    R$ {finalPrice.toFixed(0)}
                  </span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                
                {isAnnual && (
                  <p className="text-xs text-gray-500">
                    R$ {(finalPrice * 12).toFixed(0)} cobrado anualmente
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? 'primary' : 'outline'}
                size="lg"
                className="w-full"
                leftIcon={<CreditCard className="w-4 h-4" />}
                onClick={() => handleSubscribe(plan.id)}
                isLoading={selectedPlan === plan.id}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id 
                  ? 'Plano Atual' 
                  : currentPlan && plans.findIndex(p => p.id === currentPlan) < plans.findIndex(p => p.id === plan.id)
                  ? `Fazer Upgrade`
                  : `Assinar ${plan.name}`
                }
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison - Preparado para expansão */}
      <Card>
        <div className="text-center mb-6">
          <Zap className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Todos os planos incluem
          </h3>
          <p className="text-gray-600">
            Funcionalidades essenciais para gestão eficiente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Segurança',
              description: 'Dados criptografados e backups automáticos diários',
            },
            {
              title: 'Atualizações',
              description: 'Novas funcionalidades e melhorias constantemente',
            },
            {
              title: 'Suporte',
              description: 'Time especializado pronto para ajudar',
            },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Integration Notice */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">
              Sistema de Pagamentos em Desenvolvimento
            </h4>
            <p className="text-sm text-blue-800">
              A integração completa com processadores de pagamento (Stripe, Mercado Pago) 
              está preparada e será ativada em breve. Toda a arquitetura já está pronta 
              para receber a implementação final.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
