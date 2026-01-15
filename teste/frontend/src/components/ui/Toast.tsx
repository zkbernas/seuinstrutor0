import { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: 'bg-green-50 border-green-500 text-green-900',
  error: 'bg-red-50 border-red-500 text-red-900',
  info: 'bg-blue-50 border-blue-500 text-blue-900',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-900',
};

const iconStyles = {
  success: 'text-green-600',
  error: 'text-red-600',
  info: 'text-blue-600',
  warning: 'text-yellow-600',
};

export function Toast({ message, type = 'info', onClose, duration = 5000 }: ToastProps) {
  const Icon = icons[type];

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg min-w-[320px] max-w-md animate-in slide-in-from-right',
        styles[type]
      )}
      role="alert"
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconStyles[type])} />
      
      <p className="flex-1 text-sm font-medium">{message}</p>
      
      <button
        onClick={onClose}
        className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Toast Container
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: ToastType;
  }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}

// Hook para gerenciar toasts
// Note: Esta é uma implementação simples usando subscribers
// Para projetos maiores, considere usar zustand: npm install zustand

// Implementação simples:
export const toastState = {
  listeners: new Set<() => void>(),
  toasts: [] as Array<{ id: string; message: string; type: ToastType }>,

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  getSnapshot() {
    return this.toasts;
  },

  addToast(message: string, type: ToastType = 'info') {
    const id = Math.random().toString(36).substring(7);
    this.toasts = [...this.toasts, { id, message, type }];
    this.listeners.forEach((listener) => listener());
    
    // Auto remove após 5s
    setTimeout(() => this.removeToast(id), 5000);
  },

  removeToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.listeners.forEach((listener) => listener());
  },
};

export const toast = {
  success: (message: string) => toastState.addToast(message, 'success'),
  error: (message: string) => toastState.addToast(message, 'error'),
  info: (message: string) => toastState.addToast(message, 'info'),
  warning: (message: string) => toastState.addToast(message, 'warning'),
};
