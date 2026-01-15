import type { ReactNode } from 'react';
import { useBilling, type BillingPlan, PLAN_LIMITS } from '../BillingContext';
import { PaywallBanner } from '../PaywallBanner';

interface FeatureGateProps {
  requiredPlan: BillingPlan;
  children: ReactNode;
  fallback?: ReactNode;
  feature?: string;
}

const PLAN_HIERARCHY: Record<NonNullable<BillingPlan>, number> = {
  starter: 1,
  pro: 2,
  scale: 3,
};

/**
 * FeatureGate - Controla acesso a features baseado no plano
 * 
 * Uso:
 * <FeatureGate requiredPlan="pro">
 *   <AdvancedReports />
 * </FeatureGate>
 */
export function FeatureGate({
  requiredPlan,
  children,
  fallback,
  feature = 'este recurso',
}: FeatureGateProps) {
  const { plan: currentPlan, isActive } = useBilling();

  // Se não tem plano ativo, bloqueia
  if (!isActive || !currentPlan) {
    return fallback || (
      <PaywallBanner 
        feature={feature}
        showBanner={true}
      />
    );
  }

  // Se não precisa de plano específico, libera
  if (!requiredPlan) {
    return <>{children}</>;
  }

  // Verifica hierarquia de planos
  const currentLevel = PLAN_HIERARCHY[currentPlan];
  const requiredLevel = PLAN_HIERARCHY[requiredPlan];

  const hasAccess = currentLevel >= requiredLevel;

  if (!hasAccess) {
    const requiredPlanName = PLAN_LIMITS[requiredPlan].name;
    
    return fallback || (
      <PaywallBanner 
        feature={`${feature} (disponível no plano ${requiredPlanName})`}
        showBanner={true}
      />
    );
  }

  return <>{children}</>;
}
