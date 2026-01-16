import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminStore, AuditLog } from '../../../admin/mock/adminStore';
import { DataTable } from '../../../admin/components/DataTable';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Eye, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export function AdminAudit() {
  const navigate = useNavigate();
  const [actionFilter, setActionFilter] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const logs = useMemo(() => {
    return adminStore.listAudit({
      action: actionFilter || undefined,
      entityType: entityTypeFilter || undefined,
    });
  }, [actionFilter, entityTypeFilter]);

  // Extrair ações únicas para o filtro
  const uniqueActions = useMemo(() => {
    const actions = new Set(adminStore.listAudit().map(log => log.action));
    return Array.from(actions).sort();
  }, []);

  // Extrair tipos de entidade únicos para o filtro
  const uniqueEntityTypes = useMemo(() => {
    const types = new Set(adminStore.listAudit().map(log => log.entityType));
    return Array.from(types).sort();
  }, []);

  const columns = [
    {
      key: 'createdAt',
      label: 'Data',
      render: (log: AuditLog) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {new Date(log.createdAt).toLocaleDateString('pt-BR')}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(log.createdAt).toLocaleTimeString('pt-BR')}
          </div>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Ação',
      render: (log: AuditLog) => (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
          {log.action}
        </span>
      ),
    },
    {
      key: 'entityType',
      label: 'Entidade',
      render: (log: AuditLog) => (
        <span className="text-sm text-gray-700">{log.entityType}</span>
      ),
    },
    {
      key: 'entityId',
      label: 'ID',
      render: (log: AuditLog) => (
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">{log.entityId.substring(0, 8)}...</span>
          {log.entityType === 'INSTRUCTOR' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/app/admin/instructors/${log.entityId}`)}
              className="text-xs"
            >
              Ver Instrutor
            </Button>
          )}
        </div>
      ),
    },
    {
      key: 'actor',
      label: 'Usuário',
      render: (log: AuditLog) => (
        <span className="text-sm text-gray-700">{log.actor}</span>
      ),
    },
    {
      key: 'summary',
      label: 'Resumo',
      render: (log: AuditLog) => {
        const metaKeys = Object.keys(log.meta);
        const summary = metaKeys.length > 0 
          ? `${metaKeys[0]}: ${JSON.stringify(log.meta[metaKeys[0]]).substring(0, 30)}...`
          : 'Sem detalhes';
        return (
          <span className="text-xs text-gray-600">{summary}</span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (log: AuditLog) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedLog(log)}
          className="text-xs"
        >
          <Eye className="w-3 h-3 mr-1" />
          Ver Detalhes
        </Button>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Auditoria</h1>
        <p className="text-sm text-gray-600">Histórico de ações e alterações no sistema</p>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Ação</label>
            <Select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              options={[
                { value: '', label: 'Todas' },
                ...uniqueActions.map((action) => ({
                  value: action,
                  label: action,
                })),
              ]}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Entidade</label>
            <Select
              value={entityTypeFilter}
              onChange={(e) => setEntityTypeFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos' },
                ...uniqueEntityTypes.map((type) => ({
                  value: type,
                  label: type,
                })),
              ]}
            />
          </div>
        </div>
      </div>

      {/* Tabela */}
      <DataTable
        data={logs}
        columns={columns}
        keyExtractor={(log) => log.id}
        emptyMessage="Nenhum log encontrado"
      />

      {/* Modal de Detalhes */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title="Detalhes do Log"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Data</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedLog.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Usuário</label>
                <p className="text-sm text-gray-900">{selectedLog.actor}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ação</label>
                <p className="text-sm text-gray-900">{selectedLog.action}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Entidade</label>
                <p className="text-sm text-gray-900">{selectedLog.entityType}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ID da Entidade</label>
                <p className="text-xs font-mono text-gray-500">{selectedLog.entityId}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Metadados (JSON)</label>
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs overflow-auto max-h-64">
                {JSON.stringify(selectedLog.meta, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="ghost" onClick={() => setSelectedLog(null)}>
                Fechar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
