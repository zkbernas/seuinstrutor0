import { useBilling } from '../BillingContext';
import { AlertTriangle } from 'lucide-react';

interface UsageMeterProps {
  showDetails?: boolean;
}

export function UsageMeter({ showDetails = true }: UsageMeterProps) {
  const { usage, isActive, getPlanLimits } = useBilling();
  
  const limits = getPlanLimits();
  const percentage = usage.maxStudents > 0 
    ? Math.min((usage.activeStudents / usage.maxStudents) * 100, 100)
    : 0;

  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  if (!isActive || !limits) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          Ative um plano para começar a adicionar alunos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {showDetails && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Alunos ativos</span>
          <span className="font-medium text-gray-900">
            {usage.activeStudents} / {usage.maxStudents}
          </span>
        </div>
      )}

      {/* Barra de progresso */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 transition-all duration-300 ${
            isAtLimit
              ? 'bg-red-500'
              : isNearLimit
              ? 'bg-yellow-500'
              : 'bg-primary-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Avisos */}
      {isAtLimit && (
        <div className="flex items-start gap-2 text-sm text-red-600">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Você atingiu o limite do plano {limits.name}. Faça upgrade para adicionar mais alunos.
          </p>
        </div>
      )}

      {isNearLimit && !isAtLimit && (
        <div className="flex items-start gap-2 text-sm text-yellow-700">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Você está próximo do limite ({percentage.toFixed(0)}%). Considere fazer upgrade.
          </p>
        </div>
      )}

      {!showDetails && percentage < 80 && (
        <p className="text-xs text-gray-500">
          {usage.maxStudents - usage.activeStudents} vagas disponíveis
        </p>
      )}
    </div>
  );
}
