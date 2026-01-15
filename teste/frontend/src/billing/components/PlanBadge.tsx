import { useBilling, type BillingPlan } from '../BillingContext';
import { Badge } from '../../components/ui/Badge';

interface PlanBadgeProps {
  plan?: BillingPlan;
  showPrice?: boolean;
}

export function PlanBadge({ plan: planProp, showPrice = false }: PlanBadgeProps) {
  const { plan: currentPlan, getPlanLimits } = useBilling();
  const plan = planProp || currentPlan;

  if (!plan) {
    return <Badge variant="default">Sem plano</Badge>;
  }

  const limits = getPlanLimits();
  
  const variants = {
    starter: 'default' as const,
    pro: 'info' as const,
    scale: 'success' as const,
  };

  const label = limits
    ? showPrice
      ? `${limits.name} - R$ ${limits.price}/mês`
      : limits.name
    : plan;

  return <Badge variant={variants[plan]}>{label}</Badge>;
}
