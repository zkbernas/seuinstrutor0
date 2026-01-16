import { StrictMode, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Providers } from './app/providers/Providers';
import { router } from './app/routes/router';
import { ToastContainer, toastState } from './components/ui/Toast';
import './styles/globals.css';

function ToastManager() {
  const toasts = useSyncExternalStore(
    toastState.subscribe.bind(toastState),
    toastState.getSnapshot.bind(toastState)
  );

  return <ToastContainer toasts={toasts} onRemove={(id) => toastState.removeToast(id)} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
      <ToastManager />
    </Providers>
  </StrictMode>
);
