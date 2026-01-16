import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, XCircle, Eye, ArrowLeft } from 'lucide-react';
import { adminStore, Document, DocumentStatus, DocumentType } from '../../../admin/mock/adminStore';
import { DataTable } from '../../../admin/components/DataTable';
import { StatusPill } from '../../../admin/components/StatusPill';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { toast } from '../../../components/ui/Toast';

export function AdminDocuments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | ''>('PENDING');
  const [typeFilter, setTypeFilter] = useState<DocumentType | ''>('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const documents = useMemo(() => {
    let filtered = adminStore.listDocuments({
      status: statusFilter || undefined,
      type: typeFilter || undefined,
    });

    // Busca por nome do instrutor
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((doc) => {
        const instructor = adminStore.getInstructor(doc.instructorId);
        return instructor?.name.toLowerCase().includes(query);
      });
    }

    return filtered;
  }, [searchQuery, statusFilter, typeFilter]);

  const handleApprove = async (doc: Document) => {
    setIsLoading(true);
    try {
      adminStore.approveDocument(doc.id);
      toast.success('Documento aprovado com sucesso');
      setSelectedDoc(null);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao aprovar documento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDoc || !rejectNotes.trim()) {
      toast.error('Por favor, informe o motivo da rejeição');
      return;
    }

    setIsLoading(true);
    try {
      adminStore.rejectDocument(selectedDoc.id, rejectNotes);
      toast.success('Documento rejeitado');
      setSelectedDoc(null);
      setShowRejectModal(false);
      setRejectNotes('');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao rejeitar documento');
    } finally {
      setIsLoading(false);
    }
  };

  const openRejectModal = (doc: Document) => {
    setSelectedDoc(doc);
    setShowRejectModal(true);
    setRejectNotes('');
  };

  const columns = [
    {
      key: 'instructor',
      label: 'Instrutor',
      render: (doc: Document) => {
        const instructor = adminStore.getInstructor(doc.instructorId);
        return (
          <div>
            <div className="font-medium text-gray-900">{instructor?.name || 'N/A'}</div>
            <div className="text-xs text-gray-500">{instructor?.email || ''}</div>
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (doc: Document) => (
        <span className="text-sm text-gray-700">{doc.type}</span>
      ),
    },
    {
      key: 'uploadedAt',
      label: 'Data Envio',
      render: (doc: Document) => new Date(doc.uploadedAt).toLocaleDateString('pt-BR'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (doc: Document) => <StatusPill status={doc.status} />,
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (doc: Document) => (
        <div className="flex items-center gap-2">
          {doc.status === 'PENDING' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleApprove(doc)}
                disabled={isLoading}
                className="text-xs text-green-700 hover:text-green-800"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Aprovar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openRejectModal(doc)}
                disabled={isLoading}
                className="text-xs text-red-700 hover:text-red-800"
              >
                <XCircle className="w-3 h-3 mr-1" />
                Reprovar
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/app/admin/instructors/${doc.instructorId}`)}
            className="text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            Ver Instrutor
          </Button>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificar Documentos</h1>
        <p className="text-sm text-gray-600">Aprove ou rejeite documentos enviados por instrutores</p>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Buscar Instrutor</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Nome do instrutor..."
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
              onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | '')}
              options={[
                { value: '', label: 'Todos' },
                { value: 'PENDING', label: 'Pendente' },
                { value: 'APPROVED', label: 'Aprovado' },
                { value: 'REJECTED', label: 'Rejeitado' },
              ]}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as DocumentType | '')}
              options={[
                { value: '', label: 'Todos' },
                { value: 'CNH', label: 'CNH' },
                { value: 'CPF', label: 'CPF' },
                { value: 'COMPROV_RESIDENCIA', label: 'Comprovante de Residência' },
                { value: 'FOTO_PERFIL', label: 'Foto de Perfil' },
                { value: 'OUTRO', label: 'Outro' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Tabela */}
      <DataTable
        data={documents}
        columns={columns}
        keyExtractor={(doc) => doc.id}
        emptyMessage="Nenhum documento encontrado"
      />

      {/* Modal de Rejeição */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectNotes('');
          setSelectedDoc(null);
        }}
        title="Reprovar Documento"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Informe o motivo da rejeição deste documento:
          </p>
          <textarea
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            placeholder="Ex: Documento ilegível, informações divergentes, documento faltando..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            rows={4}
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setShowRejectModal(false);
                setRejectNotes('');
                setSelectedDoc(null);
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              isLoading={isLoading}
              disabled={!rejectNotes.trim()}
            >
              Reprovar
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
