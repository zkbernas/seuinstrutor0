import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Plus, Eye, Trash2, GraduationCap, Phone, Mail, Calendar } from 'lucide-react';
import { studentsApi } from '../../api/endpoints/students';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { toast } from '../../components/ui/Toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  DROPPED: 'bg-red-100 text-red-800',
};

const STATUS_LABELS = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  COMPLETED: 'Concluído',
  DROPPED: 'Desistente',
};

export function StudentsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentsApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: studentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Aluno excluído com sucesso!');
      setStudentToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erro ao excluir aluno');
    },
  });

  const filteredStudents = students?.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.user?.name?.toLowerCase().includes(searchLower) ||
      student.user?.email?.toLowerCase().includes(searchLower) ||
      student.cpf?.includes(searchLower) ||
      student.phone?.includes(searchLower)
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Alunos"
        description="Gerencie os alunos cadastrados no sistema"
        action={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/app/students/new')}
          >
            Novo Aluno
          </Button>
        }
      />

      {/* Search and Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <div className="flex-1">
          <Input
            leftIcon={<Search className="w-4 h-4" />}
            placeholder="Buscar por nome, e-mail, CPF ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Students Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : filteredStudents && filteredStudents.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                className="bg-white rounded-xl p-6 border border-cream-200 cursor-pointer"
                onClick={() => navigate(`/app/students/${student.id}`)}
              >
                {/* Avatar and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {student.avatarUrl ? (
                      <img
                        src={student.avatarUrl}
                        alt={student.user?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900">{student.user?.name}</h3>
                      <span
                        className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                          STATUS_COLORS[student.status]
                        }`}
                      >
                        {STATUS_LABELS[student.status]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{student.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{student.phone}</span>
                  </div>
                  {student.cnhType && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      <span>CNH: {student.cnhType}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {student._count?.lessons || 0} aula{student._count?.lessons !== 1 && 's'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    leftIcon={<Eye className="w-4 h-4" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/students/${student.id}`);
                    }}
                  >
                    Ver
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4 text-red-600" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setStudentToDelete(student.id);
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <EmptyState
            icon={<Users className="w-12 h-12" />}
            title="Nenhum aluno encontrado"
            description={
              searchTerm
                ? 'Tente ajustar os termos de busca'
                : 'Comece cadastrando seu primeiro aluno'
            }
            action={
              !searchTerm && (
                <Button
                  variant="primary"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => navigate('/app/students/new')}
                >
                  Cadastrar Primeiro Aluno
                </Button>
              )
            }
          />
        </motion.div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={() => studentToDelete && deleteMutation.mutate(studentToDelete)}
        title="Excluir Aluno"
        description="Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos."
        confirmText="Excluir"
        isLoading={deleteMutation.isPending}
      />
    </motion.div>
  );
}
