import { useState, useCallback } from 'react';
import { toast, toastState, ToastType } from '../../components/ui/Toast';

export function useToast() {
  const [toasts, setToasts] = useState(toastState.getSnapshot());

  useState(() => {
    const unsubscribe = toastState.subscribe(() => {
      setToasts(toastState.getSnapshot());
    });
    return unsubscribe;
  });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    toastState.addToast(message, type);
  }, []);

  const removeToast = useCallback((id: string) => {
    toastState.removeToast(id);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast.info(message),
    warning: (message: string) => toast.warning(message),
  };
}
