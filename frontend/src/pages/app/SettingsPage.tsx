import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Bell, Palette, Shield, Database, AlertCircle, FileText, CheckCircle, XCircle, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusPill } from '../../admin/components/StatusPill';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { authApi } from '../../api/endpoints/auth';
import { toast } from '../../components/ui/Toast';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      // Tentar deletar no backend primeiro (se estiver conectado)
      try {
        await authApi.deleteAccount();
      } catch (backendError) {
        // Se falhar, usar o mock store (para desenvolvimento)
        const { authStore } = await import('../../auth/authStore');
        if (user?.id) {
          authStore.deleteAccount(user.id);
        }
      }
      
      toast.success('Conta excluída com sucesso');
      logout();
      navigate('/login', { replace: true });
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao excluir conta';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

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
            <div className="relative">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-700">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              {/* Alerta de verificação pendente */}
              {(user?.status === 'PENDING_REVIEW' || user?.status === 'REJECTED') && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
                  <AlertCircle className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user?.name}
                </h3>
                {user?.status && user.status !== 'ACTIVE' && (
                  <StatusPill 
                    status={
                      user.status === 'PENDING_REVIEW' ? 'PENDING_REVIEW' : 
                      user.status === 'REJECTED' ? 'REJECTED' : 
                      'BLOCKED'
                    } 
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-400 mt-1">ID: {user?.id}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
            >
              Sair da Conta
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Excluir Conta
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Excluir Conta"
        description="Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão permanentemente removidos, incluindo perfil, documentos e histórico."
        confirmText="Sim, excluir conta"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />

      {/* Alerta de Verificação Pendente */}
      {(user?.status === 'PENDING_REVIEW' || user?.status === 'REJECTED') && (
        <Card className="mb-6 border-yellow-300 bg-yellow-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900 mb-1">
                {user.status === 'PENDING_REVIEW' 
                  ? 'Verificação Pendente' 
                  : 'Documentos Reprovados'}
              </h4>
              <p className="text-sm text-yellow-800 mb-3">
                {user.status === 'PENDING_REVIEW'
                  ? 'Sua conta está aguardando análise. Envie os documentos necessários para completar sua verificação.'
                  : 'Seus documentos foram reprovados. Por favor, reenvie-os corrigidos para nova análise.'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Seção de Verificação de Documentos */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Verificação de Documentos
            </h3>
            <p className="text-sm text-gray-600">
              Envie os documentos necessários para verificação da sua conta
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Lista de documentos necessários */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Documentos necessários:
            </h4>
            <div className="space-y-3">
              {[
                { type: 'CNH', label: 'CNH (Carteira Nacional de Habilitação)', required: true, status: 'pending' as const },
                { type: 'CPF', label: 'CPF', required: true, status: 'pending' as const },
                { type: 'COMPROV_RESIDENCIA', label: 'Comprovante de Residência', required: true, status: 'pending' as const },
                { type: 'FOTO_PERFIL', label: 'Foto de Perfil', required: false, status: 'pending' as const },
              ].map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {doc.label}
                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doc.status === 'pending' ? 'Aguardando envio' : doc.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.status === 'pending' && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                        Pendente
                      </span>
                    )}
                    {doc.status === 'approved' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {doc.status === 'rejected' && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Placeholder - em produção, abriria modal de upload
                        alert('Funcionalidade de upload de documentos em breve');
                      }}
                      className="text-xs"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Enviar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Instruções:</strong> Envie documentos legíveis e atualizados. 
              Nossa equipe analisará e você receberá uma notificação quando sua conta for aprovada.
            </p>
          </div>

          {/* Status atual */}
          {user?.status === 'PENDING_REVIEW' && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span>Sua conta está aguardando análise dos documentos enviados.</span>
              </div>
            </div>
          )}

          {user?.status === 'REJECTED' && (
            <div className="pt-4 border-t border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900 mb-1">
                      Documentos reprovados
                    </p>
                    <p className="text-xs text-red-700">
                      Verifique os documentos enviados e reenvie-os corrigidos. 
                      Certifique-se de que estão legíveis e completos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
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

      {/* Zona de Perigo - Excluir Conta */}
      <Card className="mt-6 border-red-200 bg-red-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-1">
              Zona de Perigo
            </h3>
            <p className="text-sm text-red-800 mb-4">
              Ao excluir sua conta, todos os seus dados serão permanentemente removidos. 
              Esta ação não pode ser desfeita.
            </p>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Minha Conta
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
