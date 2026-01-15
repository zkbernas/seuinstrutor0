import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { instructorsApi } from '../../../api/endpoints/instructors';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Button } from '../../../components/ui/Button';
import { toast } from '../../../components/ui/Toast';
import { maskCPF, maskPhone, unmask } from '../../../utils/masks';
import type { CreateInstructorRequest } from '../../../api/types';

const instructorSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  cpf: z.string().min(11, 'CPF inválido').max(14, 'CPF inválido'),
  credenicalNumber: z.string().min(1, 'Número da credencial é obrigatório'),
  phone: z.string().min(10, 'Telefone inválido'),
  pricePerHour: z.number().positive('Valor deve ser maior que zero'),
  categories: z.array(z.string()).min(1, 'Selecione pelo menos uma categoria'),
});

type InstructorForm = z.infer<typeof instructorSchema>;

interface CreateInstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateInstructorModal({ isOpen, onClose }: CreateInstructorModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<InstructorForm>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      cpf: '',
      credenicalNumber: '',
      phone: '',
      pricePerHour: 0,
      categories: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateInstructorRequest) => instructorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instrutor cadastrado com sucesso!');
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao cadastrar instrutor');
    },
  });

  const onSubmit = (data: InstructorForm) => {
    // Remove máscaras
    const payload: CreateInstructorRequest = {
      ...data,
      cpf: unmask(data.cpf),
      phone: unmask(data.phone),
    };

    createMutation.mutate(payload);
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      reset();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Novo Instrutor"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register('name')}
            id="name"
            label="Nome Completo"
            placeholder="João da Silva"
            error={errors.name?.message}
            required
          />

          <Input
            {...register('email')}
            id="email"
            type="email"
            label="E-mail"
            placeholder="joao@email.com"
            error={errors.email?.message}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register('password')}
            id="password"
            type="password"
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            error={errors.password?.message}
            required
          />

          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="cpf"
                label="CPF"
                placeholder="000.000.000-00"
                error={errors.cpf?.message}
                required
                onChange={(e) => {
                  const masked = maskCPF(e.target.value);
                  field.onChange(masked);
                }}
                maxLength={14}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register('credenicalNumber')}
            id="credenicalNumber"
            label="Número da Credencial"
            placeholder="Ex: 12345"
            error={errors.credenicalNumber?.message}
            required
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="phone"
                label="Telefone"
                placeholder="(00) 00000-0000"
                error={errors.phone?.message}
                required
                onChange={(e) => {
                  const masked = maskPhone(e.target.value);
                  field.onChange(masked);
                }}
                maxLength={15}
              />
            )}
          />
        </div>

        <Input
          {...register('pricePerHour', {
            valueAsNumber: true,
          })}
          id="pricePerHour"
          type="number"
          label="Valor por Hora (R$)"
          placeholder="120.00"
          error={errors.pricePerHour?.message}
          required
          step="0.01"
          min="0"
        />

        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <MultiSelect
              label="Categorias"
              value={field.value}
              onChange={field.onChange}
              error={errors.categories?.message}
              required
            />
          )}
        />

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={createMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={createMutation.isPending}
          >
            Cadastrar Instrutor
          </Button>
        </div>
      </form>
    </Modal>
  );
}
