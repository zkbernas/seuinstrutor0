import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { adminStore, Payment, PaymentStatus, PaymentMethod } from '../../../admin/mock/adminStore';
import { DataTable } from '../../../admin/components/DataTable';
import { StatusPill } from '../../../admin/components/StatusPill';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { toast } from '../../../components/ui/Toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function AdminFinance() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | ''>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    instructorId: '',
    amount: '',
    method: 'PIX' as PaymentMethod,
  });

  const payments = useMemo(() => {
    return adminStore.listPayments({
      status: statusFilter || undefined,
    });
  }, [statusFilter]);

  // KPIs
  const stats = useMemo(() => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const thisMonthPayments = payments.filter(p => {
      const paymentDate = new Date(p.createdAt);
      return paymentDate >= thisMonth && p.status === 'PAID';
    });
    
    const revenue = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);
    
    // MRR estimado
    const planPrices: Record<string, number> = { Starter: 99, Pro: 199, Scale: 399 };
    const mrr = adminStore.listInstructors?.()?.reduce((sum, i) => {
      if (i.status === 'APPROVED') {
        return sum + (planPrices[i.plan] || 0);
      }
      return sum;
    }, 0) || 0;
    
    const delinquent = payments.filter(p => 
      (p.status === 'PENDING' || p.status === 'FAILED') && 
      new Date(p.createdAt) >= thisMonth
    ).length;

    return { revenue, mrr, delinquent };
  }, [payments]);

  // Dados para gráfico de receita por mês (últimos 6 meses)
  const revenueByMonth = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      months[key] = 0;
    }
    
    payments
      .filter(p => p.status === 'PAID')
      .forEach(p => {
        const date = new Date(p.createdAt);
        const key = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        if (months.hasOwnProperty(key)) {
          months[key] += p.amount;
        }
      });
    
    return Object.entries(months).map(([month, revenue]) => ({ month, revenue }));
  }, [payments]);

  // Dados para gráfico de receita por plano
  const revenueByPlan = useMemo(() => {
    const planPrices: Record<string, number> = { Starter: 99, Pro: 199, Scale: 399 };
    const counts: Record<string, number> = { Starter: 0, Pro: 0, Scale: 0 };
    
    adminStore.listInstructors().forEach(i => {
      if (i.status === 'APPROVED') {
        counts[i.plan] = (counts[i.plan] || 0) + 1;
      }
    });
    
    return Object.entries(planPrices).map(([plan, price]) => ({
      plan,
      revenue: counts[plan] * price,
      count: counts[plan],
    }));
  }, []);

  const COLORS = ['#1f2937', '#4b5563', '#6b7280'];

  const handleCreatePayment = async () => {
    if (!paymentForm.instructorId || !paymentForm.amount) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      adminStore.createPayment({
        instructorId: paymentForm.instructorId,
        amount: parseFloat(paymentForm.amount),
        method: paymentForm.method,
        status: 'PAID',
      });
      toast.success('Pagamento registrado com sucesso');
      setShowPaymentModal(false);
      setPaymentForm({ instructorId: '', amount: '', method: 'PIX' });
    } catch (error: any) {
      toast.error(error.message || 'Erro ao registrar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  const instructors = adminStore.listInstructors();

  const columns = [
    {
      key: 'instructor',
      label: 'Instrutor',
      render: (payment: Payment) => {
        const instructor = adminStore.getInstructor(payment.instructorId);
        return (
          <div>
            <div className="font-medium text-gray-900">{instructor?.name || 'N/A'}</div>
            <div className="text-xs text-gray-500">{instructor?.email || ''}</div>
          </div>
        );
      },
    },
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
      render: (payment: Payment) => (
        <span className="text-sm text-gray-700">{payment.method}</span>
      ),
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Relatórios Financeiros</h1>
          <p className="text-sm text-gray-600">Acompanhe receitas, pagamentos e MRR</p>
        </div>
        <Button onClick={() => setShowPaymentModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Registrar Pagamento
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Receita do Mês</p>
            <p className="text-2xl font-bold text-gray-900">
              R$ {stats.revenue.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">MRR Estimado</p>
            <p className="text-2xl font-bold text-gray-900">
              R$ {stats.mrr.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Inadimplentes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.delinquent}</p>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Receita por Mês</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Bar dataKey="revenue" fill="#1f2937" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Receita por Plano</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByPlan}
                  dataKey="revenue"
                  nameKey="plan"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.plan}: R$ ${entry.revenue.toFixed(2)}`}
                >
                  {revenueByPlan.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Filtros e Tabela */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | '')}
            className="max-w-xs"
            options={[
              { value: '', label: 'Todos' },
              { value: 'PAID', label: 'Pago' },
              { value: 'PENDING', label: 'Pendente' },
              { value: 'FAILED', label: 'Falhou' },
            ]}
          />
        </div>
      </div>

      <DataTable
        data={payments}
        columns={columns}
        keyExtractor={(payment) => payment.id}
        emptyMessage="Nenhum pagamento encontrado"
      />

      {/* Modal de Registrar Pagamento */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPaymentForm({ instructorId: '', amount: '', method: 'PIX' });
        }}
        title="Registrar Pagamento"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Instrutor</label>
            <Select
              value={paymentForm.instructorId}
              onChange={(e) => setPaymentForm({ ...paymentForm, instructorId: e.target.value })}
              options={[
                { value: '', label: 'Selecione um instrutor' },
                ...instructors.map((inst) => ({
                  value: inst.id,
                  label: `${inst.name} - ${inst.email}`,
                })),
              ]}
            />
          </div>
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
              ]}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowPaymentModal(false);
                setPaymentForm({ instructorId: '', amount: '', method: 'PIX' });
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

    </div>
  );
}
