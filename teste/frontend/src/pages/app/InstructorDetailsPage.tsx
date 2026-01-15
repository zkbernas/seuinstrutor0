import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  CreditCard, 
  Hash,
  Trash2,
  Edit,
  DollarSign 
} from 'lucide-react';
import { instructorsApi } from '../../api/endpoints/instructors';
import { PageHeader } from '../../components/common/PageHeader';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { toast } from '../../components/ui/Toast';
import { formatCPF, formatPhone, formatPrice, formatDateTime } from '../../utils/format';

export function InstructorDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: instructor, isLoading } = useQuery({
    queryKey: ['instructors', id],
    queryFn: () => instructorsApi.getById(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => instructorsApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instrutor excluído com sucesso!');
      navigate('/app/instructors');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir instrutor');
    },
  });

  if (isLoading) {
    return (
      <div>
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/app/instructors')}
          className="mb-6"
        >
          Voltar
        </Button>
        <CardSkeleton />
      </div>
    );
  }

  if (!instructor) {
    return (
      <div>
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/app/instructors')}
          className="mb-6"
        >
          Voltar
        </Button>
        <Card className="text-center py-12">
          <p className="text-gray-500">Instrutor não encontrado</p>
        </Card>
      </div>
    );
  }

  const infoItems = [
    {
      icon: Mail,
      label: 'E-mail',
      value: instructor.email,
    },
    {
      icon: CreditCard,
      label: 'CPF',
      value: formatCPF(instructor.cpf),
    },
    {
      icon: Phone,
      label: 'Telefone',
      value: formatPhone(instructor.phone),
    },
    {
      icon: Hash,
      label: 'Número da Credencial',
      value: instructor.credenicalNumber,
    },
    {
      icon: DollarSign,
      label: 'Valor por Hora',
      value: formatPrice(instructor.pricePerHour),
      highlight: true,
    },
  ];

  return (
    <div>
      <Button
        variant="ghost"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/app/instructors')}
        className="mb-6"
      >
        Voltar para Instrutores
      </Button>

      <PageHeader
        title={instructor.name}
        description={`Cadastrado em ${formatDateTime(instructor.createdAt)}`}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              leftIcon={<Edit className="w-4 h-4" />}
              disabled
              title="Endpoint de edição disponível - implementação em desenvolvimento"
            >
              Editar
            </Button>
            <Button
              variant="danger"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={() => setShowDeleteDialog(true)}
            >
              Excluir
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {infoItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      item.highlight
                        ? 'border-primary-200 bg-primary-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${
                        item.highlight ? 'text-primary-600' : 'text-gray-500'
                      }`} />
                      <span className="text-xs font-medium text-gray-600 uppercase">
                        {item.label}
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${
                      item.highlight ? 'text-primary-900' : 'text-gray-900'
                    }`}>
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Categories */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Categorias Habilitadas
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {instructor.categories.map((category) => (
                <Badge key={category} variant="info" className="text-sm px-3 py-1.5">
                  {category}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Estatísticas
            </h3>
            
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Aulas Realizadas</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
                <p className="text-xs text-gray-500 mt-1">Em desenvolvimento</p>
              </div>

              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Taxa de Aprovação</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
                <p className="text-xs text-gray-500 mt-1">Em desenvolvimento</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Avaliação Média</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
                <p className="text-xs text-gray-500 mt-1">Em desenvolvimento</p>
              </div>
            </div>
          </Card>

          <Card className="bg-primary-50 border-primary-200">
            <h3 className="text-sm font-semibold text-primary-900 mb-2">
              Próximas Funcionalidades
            </h3>
            <ul className="text-xs text-primary-800 space-y-1">
              <li>• Histórico de aulas</li>
              <li>• Agenda do instrutor</li>
              <li>• Relatórios detalhados</li>
              <li>• Avaliações de alunos</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Excluir Instrutor"
        description={`Tem certeza que deseja excluir o instrutor "${instructor.name}"? Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.`}
        confirmText="Excluir Permanentemente"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
