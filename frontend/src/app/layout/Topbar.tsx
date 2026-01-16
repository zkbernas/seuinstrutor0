import { useState } from 'react';
import { Menu, Search, Bell, ChevronDown, LogOut, User as UserIcon, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useBilling } from '../../billing/BillingContext';
import { PlanBadge } from '../../billing/components/PlanBadge';
import { cn } from '../../utils/cn';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { plan, status } = useBilling();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-14 lg:h-16 bg-cream-50 border-b border-cream-200 sticky top-0 z-30 flex-shrink-0">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search - placeholder */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg min-w-[300px]">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
              disabled
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Plan Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-cream-200 rounded-lg">
            <PlanBadge />
            {status === 'trial' && (
              <span className="text-xs text-gray-600">Trial</span>
            )}
          </div>

          {/* Upgrade CTA (se não estiver no plano mais alto) */}
          {plan !== 'scale' && status !== 'none' && (
            <button
              onClick={() => navigate('/app/billing')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-primary-400 text-gray-900 hover:bg-primary-500 rounded-lg transition-colors text-sm font-bold shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade
            </button>
          )}

          {/* Notifications - placeholder */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                {/* Alerta de verificação pendente */}
                {(user?.status === 'PENDING_REVIEW' || user?.status === 'REJECTED') && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
                    <AlertCircle className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <ChevronDown className={cn(
                'w-4 h-4 text-gray-400 transition-transform',
                showUserMenu && 'rotate-180'
              )} />
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/app/settings');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors relative"
                  >
                    <UserIcon className="w-4 h-4" />
                    Meu Perfil
                    {(user?.status === 'PENDING_REVIEW' || user?.status === 'REJECTED') && (
                      <span className="ml-auto w-2 h-2 bg-yellow-500 rounded-full"></span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/app/billing');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Planos e Assinatura
                  </button>

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
