import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { instructorsApi } from '../../api/endpoints/instructors';
import { lessonsApi } from '../../api/endpoints/lessons';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { toast } from '../../components/ui/Toast';

const lessonSchema = z.object({
  scheduledAt: z.string().min(1, 'Data e hora são obrigatórias'),
  duration: z.string().min(1, 'Duração é obrigatória'),
  notes: z.string().optional(),
});

type LessonForm = z.infer<typeof lessonSchema>;

export function NewLessonPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const instructorId = searchParams.get('instructorId');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LessonForm>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      duration: '50',
    },
  });

  // Buscar dados do instrutor
  const { data: instructor } = useQuery({
    queryKey: ['instructor', instructorId],
    queryFn: () => instructorsApi.getById(instructorId!),
    enabled: !!instructorId,
  });

  // Mutation para criar aula
  const createLessonMutation = useMutation({
    mutationFn: (data: LessonForm) => {
      if (!instructorId) throw new Error('ID do instrutor não encontrado');
      
      return lessonsApi.create({
        instructorId,
        scheduledAt: data.scheduledAt,
        duration: parseInt(data.duration),
        notes: data.notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Aula agendada com sucesso!');
      navigate('/app/classes');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao agendar aula');
    },
  });

  // Setar data/hora mínima como agora
  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Mínimo 30 minutos a partir de agora
    const minDateTime = now.toISOString().slice(0, 16);
    setValue('scheduledAt', minDateTime);
  }, [setValue]);

  const onSubmit = (data: LessonForm) => {
    createLessonMutation.mutate(data);
  };

  const durationOptions = [
    { value: '50', label: '50 minutos' },
    { value: '100', label: '100 minutos (1h 40min)' },
    { value: '150', label: '150 minutos (2h 30min)' },
  ];

  return (
    <div className="space-y-6">
      {/* Botão Voltar */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (instructorId) {
            navigate(`/app/instructors/${instructorId}`);
          } else {
            navigate('/app/home');
          }
        }}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <PageHeader
        title="Agendar Aula"
        description={
          instructor
            ? `Agende uma aula com ${instructor.name}`
            : 'Preencha os dados para agendar sua aula'
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Data e Hora */}
              <div>
                <Input
                  {...register('scheduledAt')}
                  id="scheduledAt"
                  type="datetime-local"
                  label="Data e Hora"
                  error={errors.scheduledAt?.message}
                  required
                  icon={Calendar}
                />
              </div>

              {/* Duração */}
              <div>
                <Select
                  {...register('duration')}
                  id="duration"
                  label="Duração da Aula"
                  error={errors.duration?.message}
                  required
                  options={durationOptions}
                />
              </div>

              {/* Observações */}
              <div>
                <label className="label-base" htmlFor="notes">
                  Observações (opcional)
                </label>
                <textarea
                  {...register('notes')}
                  id="notes"
                  rows={4}
                  className="input-base"
                  placeholder="Ex: Primeira aula prática, preciso de veículo adaptado..."
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={createLessonMutation.isPending}
                  className="flex-1"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Confirmar Agendamento
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar com Info do Instrutor */}
        {instructor && (
          <div>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informações do Instrutor
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Instrutor</p>
                  <p className="font-semibold text-gray-900">{instructor.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Valor por hora</p>
                  <p className="text-xl font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(instructor.pricePerHour)}
                  </p>
                </div>
                {instructor.vehicles && instructor.vehicles.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Veículos disponíveis</p>
                    <div className="space-y-2">
                      {instructor.vehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="text-sm text-gray-700 p-2 bg-gray-50 rounded"
                        >
                          {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
