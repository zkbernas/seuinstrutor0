import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CreditCard, 
  Settings,
  X 
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    to: '/app/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    to: '/app/instructors',
    icon: Users,
    label: 'Instrutores',
  },
  {
    to: '/app/students',
    icon: GraduationCap,
    label: 'Alunos',
  },
  {
    to: '/app/classes',
    icon: GraduationCap,
    label: 'Aulas',
  },
  {
    to: '/app/billing',
    icon: CreditCard,
    label: 'Planos',
  },
  {
    to: '/app/settings',
    icon: Settings,
    label: 'Configurações',
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-cream-50 border-r border-cream-200 transition-transform duration-300 lg:translate-x-0 lg:z-30',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-cream-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-gray-900" />
            </div>
            <span className="font-bold text-lg text-gray-900">SeuInstrutor</span>
          </div>

          {/* Close button mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all',
                    isActive
                      ? 'bg-primary-300 text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:bg-cream-100 hover:text-gray-900'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('w-5 h-5', isActive && 'text-gray-900')} />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cream-200 bg-cream-50">
          <div className="text-xs text-gray-500 text-center font-medium">
            v1.0.2 • {new Date().getFullYear()}
          </div>
        </div>
      </aside>
    </>
  );
}
