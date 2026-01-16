import { cn } from '../../utils/cn';

type StatusType = 
  | 'APPROVED' 
  | 'PENDING_REVIEW' 
  | 'REJECTED' 
  | 'BLOCKED' 
  | 'ACTIVE'
  | 'PENDING'
  | 'PAID'
  | 'FAILED';

interface StatusPillProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  APPROVED: { label: 'Aprovado', className: 'bg-green-50 text-green-700 border-green-200' },
  PENDING_REVIEW: { label: 'Pendente', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  REJECTED: { label: 'Rejeitado', className: 'bg-red-50 text-red-700 border-red-200' },
  BLOCKED: { label: 'Bloqueado', className: 'bg-gray-50 text-gray-700 border-gray-200' },
  ACTIVE: { label: 'Ativo', className: 'bg-green-50 text-green-700 border-green-200' },
  PENDING: { label: 'Pendente', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  PAID: { label: 'Pago', className: 'bg-green-50 text-green-700 border-green-200' },
  FAILED: { label: 'Falhou', className: 'bg-red-50 text-red-700 border-red-200' },
};

export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-50 text-gray-700 border-gray-200' };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
