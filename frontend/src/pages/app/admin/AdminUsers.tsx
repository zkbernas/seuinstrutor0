import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserX, UserCheck, Shield, ArrowLeft } from 'lucide-react';
import { adminStore, User, UserRole, UserStatus } from '../../../admin/mock/adminStore';
import { DataTable } from '../../../admin/components/DataTable';
import { StatusPill } from '../../../admin/components/StatusPill';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { toast } from '../../../components/ui/Toast';

export function AdminUsers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | ''>('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [selectedUser, setSelectedUser] = useState<{ id: string; action: 'block' | 'unblock' | 'role'; newRole?: UserRole } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simular role do admin atual (em produção viria do AuthContext)
  const currentAdminRole: UserRole = 'ADMIN';

  const users = useMemo(() => {
    return adminStore.listUsers(searchQuery, {
      status: statusFilter || undefined,
      role: roleFilter || undefined,
    });
  }, [searchQuery, statusFilter, roleFilter]);

  const handleBlock = (user: User) => {
    setSelectedUser({ id: user.id, action: user.status === 'ACTIVE' ? 'block' : 'unblock' });
  };

  const handleChangeRole = (user: User) => {
    const newRole: UserRole = user.role === 'ADMIN' ? 'OPERATOR' : 'ADMIN';
    setSelectedUser({ id: user.id, action: 'role', newRole });
  };

  const confirmAction = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      if (selectedUser.action === 'block' || selectedUser.action === 'unblock') {
        const newStatus: UserStatus = selectedUser.action === 'block' ? 'BLOCKED' : 'ACTIVE';
        adminStore.updateUserStatus(selectedUser.id, newStatus);
        toast.success(`Usuário ${selectedUser.action === 'block' ? 'bloqueado' : 'desbloqueado'} com sucesso`);
      } else if (selectedUser.action === 'role' && selectedUser.newRole) {
        adminStore.updateUserRole(selectedUser.id, selectedUser.newRole);
        toast.success(`Role do usuário atualizado para ${selectedUser.newRole}`);
      }
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Nome',
      render: (user: User) => (
        <div>
          <div className="font-medium text-gray-900">{user.name}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (user: User) => (
        <span className="inline-flex items-center gap-1 text-sm text-gray-700">
          <Shield className="w-4 h-4" />
          {user.role}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (user: User) => <StatusPill status={user.status} />,
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (user: User) => new Date(user.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBlock(user)}
            className="text-xs"
          >
            {user.status === 'ACTIVE' ? (
              <>
                <UserX className="w-3 h-3 mr-1" />
                Bloquear
              </>
            ) : (
              <>
                <UserCheck className="w-3 h-3 mr-1" />
                Desbloquear
              </>
            )}
          </Button>
          {currentAdminRole === 'ADMIN' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleChangeRole(user)}
              className="text-xs"
            >
              Alterar Role
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/app/admin')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gerenciar Usuários</h1>
        <p className="text-sm text-gray-600">Gerencie usuários do sistema, roles e status</p>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Nome ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | '')}
              options={[
                { value: '', label: 'Todos' },
                { value: 'ACTIVE', label: 'Ativo' },
                { value: 'BLOCKED', label: 'Bloqueado' },
              ]}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | '')}
              options={[
                { value: '', label: 'Todos' },
                { value: 'ADMIN', label: 'Admin' },
                { value: 'OPERATOR', label: 'Operador' },
                { value: 'INSTRUCTOR', label: 'Instrutor' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Tabela */}
      <DataTable
        data={users}
        columns={columns}
        keyExtractor={(user) => user.id}
        emptyMessage="Nenhum usuário encontrado"
      />

      {/* Modal de confirmação */}
      {selectedUser && (
        <ConfirmDialog
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onConfirm={confirmAction}
          title={
            selectedUser.action === 'block'
              ? 'Bloquear Usuário'
              : selectedUser.action === 'unblock'
              ? 'Desbloquear Usuário'
              : 'Alterar Role'
          }
          description={
            selectedUser.action === 'block'
              ? 'Tem certeza que deseja bloquear este usuário? Ele não poderá mais acessar o sistema.'
              : selectedUser.action === 'unblock'
              ? 'Tem certeza que deseja desbloquear este usuário?'
              : `Tem certeza que deseja alterar o role deste usuário para ${selectedUser.newRole}?`
          }
          confirmText="Confirmar"
          cancelText="Cancelar"
          variant="danger"
          isLoading={isLoading}
        />
      )}

    </div>
  );
}
