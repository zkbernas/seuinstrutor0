import { User, Lock, Bell, Palette, Shield, Database } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function SettingsPage() {
  const { user, logout } = useAuth();

  const settingsSections = [
    {
      icon: User,
      title: 'Perfil',
      description: 'Gerencie suas informações pessoais',
      available: true,
    },
    {
      icon: Lock,
      title: 'Segurança',
      description: 'Altere sua senha e configure autenticação',
      available: false,
    },
    {
      icon: Bell,
      title: 'Notificações',
      description: 'Configure alertas e e-mails',
      available: false,
    },
    {
      icon: Palette,
      title: 'Aparência',
      description: 'Personalize cores e tema',
      available: false,
    },
    {
      icon: Shield,
      title: 'Privacidade',
      description: 'Controle de dados e privacidade',
      available: false,
    },
    {
      icon: Database,
      title: 'Dados e Backup',
      description: 'Exportação e backup de dados',
      available: false,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Configurações"
        description="Gerencie suas preferências e conta"
      />

      {/* Current User Info */}
      <Card className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-700">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.name}
              </h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-400 mt-1">ID: {user?.id}</p>
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={logout}
          >
            Sair da Conta
          </Button>
        </div>
      </Card>

      {/* Profile Form - Basic */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informações do Perfil
        </h3>

        <div className="space-y-4">
          <Input
            label="Nome"
            value={user?.name || ''}
            disabled
            helperText="Em desenvolvimento - edição será habilitada em breve"
          />

          <Input
            label="E-mail"
            type="email"
            value={user?.email || ''}
            disabled
            helperText="Em desenvolvimento - edição será habilitada em breve"
          />

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button variant="outline" disabled>
              Cancelar
            </Button>
            <Button variant="primary" disabled>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </Card>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card
              key={index}
              className={`${
                section.available 
                  ? 'hover:shadow-medium transition-shadow cursor-pointer' 
                  : 'opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  section.available ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    section.available ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {section.title}
                    </h3>
                    {!section.available && (
                      <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                        Em breve
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {section.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Development Notice */}
      <Card className="mt-6 bg-purple-50 border-purple-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-purple-900 mb-1">
              Funcionalidades Avançadas em Desenvolvimento
            </h4>
            <p className="text-sm text-purple-800">
              As configurações avançadas serão habilitadas progressivamente. 
              A arquitetura está preparada para suportar todas as funcionalidades de forma escalável.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
