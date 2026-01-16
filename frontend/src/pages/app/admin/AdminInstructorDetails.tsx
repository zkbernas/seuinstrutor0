import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  UserX, 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  Eye, 
  DollarSign,
  FileText,
  Calendar,
  CreditCard
} from 'lucide-react';
import { 
  adminStore, 
  Instructor, 
  Document, 
  Payment, 
  AuditLog,
  ReviewReason,
  PlanType,
  PaymentMethod,
  PaymentStatus
} from '../../../admin/mock/adminStore';
import { StatusPill } from '../../../admin/components/StatusPill';
import { DataTable } from '../../../admin/components/DataTable';
import { Tabs } from '../../../admin/components/Tabs';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { toast } from '../../../components/ui/Toast';

export function AdminInstructorDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('data');
  const [isLoading, setIsLoading] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [rejectForm, setRejectForm] = useState({ reason: '' as ReviewReason, notes: '' });
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    method: 'PIX' as PaymentMethod,
    status: 'PAID' as PaymentStatus,
    paidAt: new Date().toISOString().split('T')[0],
  });
  const [newPlan, setNewPlan] = useState<PlanType>('Starter');

  const instructor = useMemo(() => {
    if (!id) return undefined;
    return adminStore.getInstructorById(id);
  }, [id]);

  const documents = useMemo(() => {
    if (!id) return [];
    return adminStore.getInstructorDocuments(id);
  }, [id]);

  const payments = useMemo(() => {
    if (!id) return [];
    return adminStore.getInstructorPayments(id);
  }, [id]);

  const auditLogs = useMemo(() => {
    if (!id) return [];
    return adminStore.getInstructorAudit(id);
  }, [id]);

  // Estatísticas
  const stats = useMemo(() => {
    if (!instructor) return null;
    
    const pendingDocs = documents.filter(d => d.status === 'PENDING').length;
    const totalRevenue = payments
      .filter(p => p.status === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0);
    const lastPayment = payments
      .filter(p => p.status === 'PAID')
      .sort((a, b) => new Date(b.paidAt || b.createdAt).getTime() - new Date(a.paidAt || a.createdAt).getTime())[0];

    return {
      pendingDocs,
      totalRevenue,
      lastPayment,
    };
  }, [instructor, documents, payments]);

  useEffect(() => {
    if (!instructor && id) {
      toast.error('Instrutor não encontrado');
      navigate('/app/admin');
    }
  }, [instructor, id, navigate]);

  if (!instructor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const handleApproveDoc = async (doc: Document) => {
    setIsLoading(true);
    try {
      adminStore.approveDocumentWithActor(doc.id);
      toast.success('Documento aprovado com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao aprovar documento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectDoc = async () => {
    if (!selectedDoc) return;
    if (!rejectForm.reason) {
      toast.error('Selecione um motivo');
      return;
    }
    if (rejectForm.reason === 'OUTRO' && !rejectForm.notes.trim()) {
      toast.error('Informe as notas para o motivo "Outro"');
      return;
    }

    setIsLoading(true);
    try {
      adminStore.rejectDocumentWithActor(
        selectedDoc.id,
        rejectForm.reason,
        rejectForm.notes || 'Sem notas',
      );
      toast.success('Documento rejeitado');
      setShowRejectModal(false);
      setSelectedDoc(null);
      setRejectForm({ reason: '' as ReviewReason, notes: '' });
    } catch (error: any) {
      toast.error(error.message || 'Erro ao rejeitar documento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async () => {
    setIsLoading(true);
    try {
      adminStore.blockInstructor(instructor.id);
      toast.success('Instrutor bloqueado');
      setShowBlockModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao bloquear instrutor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblock = async () => {
    setIsLoading(true);
    try {
      adminStore.unblockInstructor(instructor.id);
      toast.success('Instrutor desbloqueado');
      setShowBlockModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao desbloquear instrutor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAll = async () => {
    const pendingDocs = documents.filter(d => d.status === 'PENDING');
    if (pendingDocs.length === 0) {
      toast.info('Não há documentos pendentes');
      return;
    }

    setIsLoading(true);
    try {
      pendingDocs.forEach(doc => {
        adminStore.approveDocumentWithActor(doc.id);
      });
      toast.success(`${pendingDocs.length} documento(s) aprovado(s)`);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao aprovar documentos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePlan = async () => {
    setIsLoading(true);
    try {
      adminStore.updateInstructorPlan(instructor.id, newPlan);
      toast.success(`Plano atualizado para ${newPlan}`);
      setShowPlanModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar plano');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePayment = async () => {
    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      toast.error('Informe um valor válido');
      return;
    }

    setIsLoading(true);
    try {
      adminStore.createPaymentWithActor({
        instructorId: instructor.id,
        amount: parseFloat(paymentForm.amount),
        method: paymentForm.method,
        status: paymentForm.status,
        paidAt: paymentForm.status === 'PAID' ? new Date(paymentForm.paidAt).toISOString() : undefined,
      });
      toast.success('Pagamento registrado');
      setShowPaymentModal(false);
      setPaymentForm({
        amount: '',
        method: 'PIX',
        status: 'PAID',
        paidAt: new Date().toISOString().split('T')[0],
      });
    } catch (error: any) {
      toast.error(error.message || 'Erro ao registrar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Mudar para a tab correta se necessário
      if (sectionId === 'documents') setActiveTab('documents');
      if (sectionId === 'payments') setActiveTab('payments');
    }
  };

  // Tabs
  const tabs = [
    {
      id: 'data',
      label: 'Dados',
      content: (
        <div className="space-y-6">
          <Card>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nome</label>
                  <p className="text-sm text-gray-900">{instructor.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-sm text-gray-900">{instructor.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Telefone</label>
                  <p className="text-sm text-gray-900">{instructor.phone}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cidade</label>
                  <p className="text-sm text-gray-900">{instructor.city}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Plano Atual</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">{instructor.plan}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNewPlan(instructor.plan);
                        setShowPlanModal(true);
                      }}
                    >
                      Alterar
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Criado em</label>
                  <p className="text-sm text-gray-900">
                    {new Date(instructor.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'documents',
      label: 'Documentos',
      content: (
        <div className="space-y-4" id="documents">
          <DataTable
            data={documents}
            columns={[
              {
                key: 'type',
                label: 'Tipo',
                render: (doc: Document) => <span className="text-sm text-gray-700">{doc.type}</span>,
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
                          onClick={() => handleApproveDoc(doc)}
                          disabled={isLoading}
                          className="text-xs text-green-700"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDoc(doc);
                            setShowRejectModal(true);
                            setRejectForm({ reason: '' as ReviewReason, notes: '' });
                          }}
                          disabled={isLoading}
                          className="text-xs text-red-700"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reprovar
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDoc(doc);
                        setShowDocumentModal(true);
                      }}
                      className="text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                  </div>
                ),
              },
            ]}
            keyExtractor={(doc) => doc.id}
            emptyMessage="Nenhum documento encontrado"
          />
        </div>
      ),
    },
    {
      id: 'payments',
      label: 'Pagamentos',
      content: (
        <div className="space-y-4" id="payments">
          <div className="flex justify-end">
            <Button onClick={() => setShowPaymentModal(true)}>
              <DollarSign className="w-4 h-4 mr-2" />
              Registrar Pagamento
            </Button>
          </div>
          <DataTable
            data={payments}
            columns={[
              {
                key: 'amount',
                label: 'Valor',
                render: (payment: Payment) => (
                  <span className="font-medium text-gray-900">
                    R$ {payment.amount.toFixed(2).replace('.', ',')}
                  </span>
                ),
              },
              {
                key: 'method',
                label: 'Método',
                render: (payment: Payment) => <span className="text-sm text-gray-700">{payment.method}</span>,
              },
              {
                key: 'status',
                label: 'Status',
                render: (payment: Payment) => <StatusPill status={payment.status} />,
              },
              {
                key: 'paidAt',
                label: 'Data',
                render: (payment: Payment) => (
                  <span className="text-sm text-gray-700">
                    {payment.paidAt 
                      ? new Date(payment.paidAt).toLocaleDateString('pt-BR')
                      : new Date(payment.createdAt).toLocaleDateString('pt-BR')
                    }
                  </span>
                ),
              },
            ]}
            keyExtractor={(payment) => payment.id}
            emptyMessage="Nenhum pagamento encontrado"
          />
        </div>
      ),
    },
    {
      id: 'audit',
      label: 'Auditoria',
      content: (
        <div className="space-y-4">
          <DataTable
            data={auditLogs}
            columns={[
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
                render: (log: AuditLog) => <span className="text-sm text-gray-700">{log.entityType}</span>,
              },
              {
                key: 'actor',
                label: 'Usuário',
                render: (log: AuditLog) => <span className="text-sm text-gray-700">{log.actor}</span>,
              },
              {
                key: 'summary',
                label: 'Resumo',
                render: (log: AuditLog) => {
                  const metaKeys = Object.keys(log.meta);
                  const summary = metaKeys.length > 0 
                    ? `${metaKeys[0]}: ${JSON.stringify(log.meta[metaKeys[0]]).substring(0, 30)}...`
                    : 'Sem detalhes';
                  return <span className="text-xs text-gray-600">{summary}</span>;
                },
              },
              {
                key: 'actions',
                label: 'Ações',
                render: (log: AuditLog) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedLog(log);
                      setShowAuditModal(true);
                    }}
                    className="text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Ver Detalhes
                  </Button>
                ),
              },
            ]}
            keyExtractor={(log) => log.id}
            emptyMessage="Nenhum log encontrado"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Header do Instrutor */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{instructor.name}</h1>
            <p className="text-sm text-gray-600">{instructor.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill status={instructor.status} className="text-base px-4 py-2" />
            {instructor.status === 'BLOCKED' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                <p className="text-xs text-yellow-800">Instrutor bloqueado</p>
              </div>
            )}
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Card>
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Plano</p>
              <p className="text-lg font-bold text-gray-900">{instructor.plan}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Docs Pendentes</p>
              <p className="text-lg font-bold text-gray-900">{stats?.pendingDocs || 0}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Receita Total</p>
              <p className="text-lg font-bold text-gray-900">
                R$ {(stats?.totalRevenue || 0).toFixed(2).replace('.', ',')}
              </p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Último Pagamento</p>
              <p className="text-sm font-bold text-gray-900">
                {stats?.lastPayment 
                  ? `${new Date(stats.lastPayment.paidAt || stats.lastPayment.createdAt).toLocaleDateString('pt-BR')} - R$ ${stats.lastPayment.amount.toFixed(2).replace('.', ',')}`
                  : 'N/A'
                }
              </p>
            </div>
          </Card>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          {instructor.status === 'BLOCKED' ? (
            <Button
              variant="ghost"
              onClick={() => {
                setShowBlockModal(true);
              }}
              className="text-green-700 hover:text-green-800"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Desbloquear
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => {
                setShowBlockModal(true);
              }}
              className="text-red-700 hover:text-red-800"
            >
              <UserX className="w-4 h-4 mr-2" />
              Bloquear
            </Button>
          )}
          {documents.some(d => d.status === 'PENDING') && (
            <Button
              variant="ghost"
              onClick={handleApproveAll}
              disabled={isLoading}
              className="text-green-700 hover:text-green-800"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprovar Todos os Docs
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modal de Bloquear/Desbloquear */}
      <ConfirmDialog
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onConfirm={instructor.status === 'BLOCKED' ? handleUnblock : handleBlock}
        title={instructor.status === 'BLOCKED' ? 'Desbloquear Instrutor' : 'Bloquear Instrutor'}
        description={
          instructor.status === 'BLOCKED'
            ? 'Tem certeza que deseja desbloquear este instrutor?'
            : 'Tem certeza que deseja bloquear este instrutor? Ele não poderá mais acessar o sistema.'
        }
        confirmText={instructor.status === 'BLOCKED' ? 'Desbloquear' : 'Bloquear'}
        variant="danger"
        isLoading={isLoading}
      />

      {/* Modal de Alterar Plano */}
      <Modal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        title="Alterar Plano"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Novo Plano</label>
            <Select
              value={newPlan}
              onChange={(e) => setNewPlan(e.target.value as PlanType)}
              options={[
                { value: 'Starter', label: 'Starter' },
                { value: 'Pro', label: 'Pro' },
                { value: 'Scale', label: 'Scale' },
              ]}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShowPlanModal(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleUpdatePlan} isLoading={isLoading}>
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Reprovar Documento */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedDoc(null);
          setRejectForm({ reason: '' as ReviewReason, notes: '' });
        }}
        title="Reprovar Documento"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Motivo</label>
            <Select
              value={rejectForm.reason}
              onChange={(e) => setRejectForm({ ...rejectForm, reason: e.target.value as ReviewReason })}
              options={[
                { value: 'ILEGIVEL', label: 'Documento ilegível' },
                { value: 'DIVERGENCIA', label: 'Informações divergentes' },
                { value: 'FALTANDO_DOC', label: 'Documento faltando' },
                { value: 'OUTRO', label: 'Outro' },
              ]}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Notas {rejectForm.reason === 'OUTRO' && '*'}
            </label>
            <textarea
              value={rejectForm.notes}
              onChange={(e) => setRejectForm({ ...rejectForm, notes: e.target.value })}
              placeholder="Informe o motivo da rejeição..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              rows={4}
              required={rejectForm.reason === 'OUTRO'}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowRejectModal(false);
                setSelectedDoc(null);
                setRejectForm({ reason: '' as ReviewReason, notes: '' });
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleRejectDoc} isLoading={isLoading}>
              Reprovar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Ver Documento */}
      <Modal
        isOpen={showDocumentModal}
        onClose={() => {
          setShowDocumentModal(false);
          setSelectedDoc(null);
        }}
        title="Visualizar Documento"
        size="lg"
      >
        {selectedDoc && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
                <p className="text-sm text-gray-900">{selectedDoc.type}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <StatusPill status={selectedDoc.status} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Data de Envio</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedDoc.uploadedAt).toLocaleString('pt-BR')}
                </p>
              </div>
              {selectedDoc.reviewReason && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Motivo da Rejeição</label>
                  <p className="text-sm text-gray-900">{selectedDoc.reviewReason}</p>
                </div>
              )}
            </div>
            {selectedDoc.reviewNotes && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notas</label>
                <p className="text-sm text-gray-900">{selectedDoc.reviewNotes}</p>
              </div>
            )}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Preview do documento</p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedDoc.fileUrl || selectedDoc.url || 'Arquivo não disponível'}
              </p>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => {
                setShowDocumentModal(false);
                setSelectedDoc(null);
              }}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Registrar Pagamento */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPaymentForm({
            amount: '',
            method: 'PIX',
            status: 'PAID',
            paidAt: new Date().toISOString().split('T')[0],
          });
        }}
        title="Registrar Pagamento"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Valor (R$)</label>
            <Input
              type="number"
              step="0.01"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Método</label>
            <Select
              value={paymentForm.method}
              onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value as PaymentMethod })}
              options={[
                { value: 'PIX', label: 'PIX' },
                { value: 'CARD', label: 'Cartão' },
                { value: 'TRANSFER', label: 'Transferência' },
                { value: 'OTHER', label: 'Outro' },
              ]}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <Select
              value={paymentForm.status}
              onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value as PaymentStatus })}
              options={[
                { value: 'PAID', label: 'Pago' },
                { value: 'PENDING', label: 'Pendente' },
                { value: 'FAILED', label: 'Falhou' },
              ]}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Data</label>
            <Input
              type="date"
              value={paymentForm.paidAt}
              onChange={(e) => setPaymentForm({ ...paymentForm, paidAt: e.target.value })}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowPaymentModal(false);
                setPaymentForm({
                  amount: '',
                  method: 'PIX',
                  status: 'PAID',
                  paidAt: new Date().toISOString().split('T')[0],
                });
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreatePayment} isLoading={isLoading}>
              Registrar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Detalhes do Log */}
      {selectedLog && (
        <Modal
          isOpen={showAuditModal}
          onClose={() => {
            setShowAuditModal(false);
            setSelectedLog(null);
          }}
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

            {selectedLog.entityType === 'DOCUMENT' && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAuditModal(false);
                    setActiveTab('documents');
                    setTimeout(() => scrollToSection('documents'), 100);
                  }}
                >
                  Ver Documento
                </Button>
              </div>
            )}

            {selectedLog.entityType === 'PAYMENT' && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAuditModal(false);
                    setActiveTab('payments');
                    setTimeout(() => scrollToSection('payments'), 100);
                  }}
                >
                  Ver Pagamento
                </Button>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="ghost" onClick={() => {
                setShowAuditModal(false);
                setSelectedLog(null);
              }}>
                Fechar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
