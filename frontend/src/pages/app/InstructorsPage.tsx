import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Eye, 
  Trash2,
  UserPlus 
} from 'lucide-react';
import { instructorsApi } from '../../api/endpoints/instructors';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { toast } from '../../components/ui/Toast';
import { CreateInstructorModal } from './instructors/CreateInstructorModal';
import { formatCPF, formatPhone, formatPrice } from '../../utils/format';
import type { Instructor } from '../../api/types';

export function InstructorsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState<Instructor | null>(null);

  // Query para listar instrutores
  const { data: instructors, isLoading } = useQuery({
    queryKey: ['instructors'],
    queryFn: instructorsApi.list,
  });

  // Mutation para deletar instrutor
  const deleteMutation = useMutation({
    mutationFn: instructorsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instrutor excluído com sucesso!');
      setInstructorToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir instrutor');
    },
  });

  // Filtro de busca
  const filteredInstructors = useMemo(() => {
    if (!instructors) return [];
    
    if (!searchTerm) return instructors;

    const search = searchTerm.toLowerCase();
    return instructors.filter(
      (instructor) =>
        instructor.name.toLowerCase().includes(search) ||
        instructor.email.toLowerCase().includes(search) ||
        instructor.cpf.includes(search) ||
        instructor.phone.includes(search)
    );
  }, [instructors, searchTerm]);

  const handleDelete = (instructor: Instructor) => {
    setInstructorToDelete(instructor);
  };

  const confirmDelete = () => {
    if (instructorToDelete) {
      deleteMutation.mutate(instructorToDelete.id);
    }
  };

  return (
    <div>
      <PageHeader
        title="Instrutores"
        description="Gerencie os instrutores da sua autoescola"
        action={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            Novo Instrutor
          </Button>
        }
      />

      <Card>
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nome, e-mail, CPF ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : filteredInstructors.length === 0 ? (
          searchTerm ? (
            <EmptyState
              icon={Search}
              title="Nenhum instrutor encontrado"
              description="Tente buscar com outros termos"
            />
          ) : (
            <EmptyState
              icon={UserPlus}
              title="Nenhum instrutor cadastrado"
              description="Comece adicionando seu primeiro instrutor para gerenciar sua equipe"
              action={
                <Button
                  variant="primary"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowCreateModal(true)}
                >
                  Cadastrar Primeiro Instrutor
                </Button>
              }
            />
          )
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Valor/Hora</TableHead>
                  <TableHead>Categorias</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstructors.map((instructor) => (
                  <TableRow key={instructor.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {instructor.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          CRED: {instructor.credenicalNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600">{instructor.email}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600 font-mono text-sm">
                        {formatCPF(instructor.cpf)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600">
                        {formatPhone(instructor.phone)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-700">
                        {formatPrice(instructor.pricePerHour)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {instructor.categories.slice(0, 2).map((category) => (
                          <Badge key={category} variant="info">
                            {category}
                          </Badge>
                        ))}
                        {instructor.categories.length > 2 && (
                          <Badge variant="default">
                            +{instructor.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Eye className="w-4 h-4" />}
                          onClick={() => navigate(`/app/instructors/${instructor.id}`)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Trash2 className="w-4 h-4" />}
                          onClick={() => handleDelete(instructor)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Results count */}
        {!isLoading && filteredInstructors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Mostrando {filteredInstructors.length} de {instructors?.length || 0} instrutor(es)
            </p>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <CreateInstructorModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!instructorToDelete}
        onClose={() => setInstructorToDelete(null)}
        onConfirm={confirmDelete}
        title="Excluir Instrutor"
        description={`Tem certeza que deseja excluir o instrutor "${instructorToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
