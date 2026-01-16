import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useBilling } from './BillingContext';

/**
 * PaywallBanner - Componente preparado para bloquear features pagas
 * 
 * USO FUTURO:
 * <PaywallBanner feature="advanced_reports">
 *   <AdvancedReportsComponent />
 * </PaywallBanner>
 */

interface PaywallBannerProps {
  feature?: string;
  children?: React.ReactNode;
  showBanner?: boolean;
}

export function PaywallBanner({ 
  feature = 'premium', 
  children,
  showBanner = false 
}: PaywallBannerProps) {
  const navigate = useNavigate();
  const { isActive, plan } = useBilling();

  // Por enquanto, sempre mostra o conteúdo
  // Em produção, verificar se o plano atual tem acesso à feature
  if (!showBanner || isActive) {
    return <>{children}</>;
  }

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Recurso Premium
          </h3>
          <p className="text-gray-600 mb-4">
            Este recurso está disponível apenas para planos pagos. 
            Faça upgrade para desbloquear esta funcionalidade e muito mais.
          </p>
          
          <Button
            variant="primary"
            onClick={() => navigate('/app/billing')}
          >
            Ver Planos Disponíveis
          </Button>
        </div>
      </div>
    </Card>
  );
}
