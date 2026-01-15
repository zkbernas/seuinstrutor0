import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" showCloseButton={false}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className={`
            flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
            ${variant === 'danger' ? 'bg-red-100' : ''}
            ${variant === 'warning' ? 'bg-yellow-100' : ''}
            ${variant === 'info' ? 'bg-blue-100' : ''}
          `}>
            <AlertTriangle className={`
              w-5 h-5
              ${variant === 'danger' ? 'text-red-600' : ''}
              ${variant === 'warning' ? 'text-yellow-600' : ''}
              ${variant === 'info' ? 'text-blue-600' : ''}
            `} />
          </div>
          
          <p className="text-sm text-gray-600 flex-1">
            {description}
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
