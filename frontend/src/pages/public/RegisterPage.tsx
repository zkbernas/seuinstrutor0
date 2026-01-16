import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { authStore } from '../../auth/authStore';
import { useAuth } from '../../auth/AuthContext';
import { authApi } from '../../api/endpoints/auth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { toast } from '../../components/ui/Toast';

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string(),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(11, 'CPF deve ter 11 dígitos'),
  phone: z.string().min(10, 'Telefone inválido'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { login, refreshUser, isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirecionar quando autenticado (após cadastro)
  // Deixar RoleBasedRedirect decidir o destino final
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      setError(null);

      // Tentar criar conta no backend primeiro
      try {
        const response = await authApi.register({
          name: data.name,
          email: data.email,
          password: data.password,
          cpf: data.cpf.replace(/\D/g, ''), // Remove caracteres não numéricos
          phone: data.phone.replace(/\D/g, ''), // Remove caracteres não numéricos
        });

        // Salvar token e fazer login
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }

        // Fazer login automático via contexto
        await login({
          email: data.email,
          password: data.password,
          remember: false,
        });

        refreshUser();
        toast.success('Conta criada com sucesso! Complete sua verificação no perfil.');
      } catch (backendError: any) {
        // Se falhar no backend, usar mock store (para desenvolvimento)
        console.warn('Backend não disponível, usando mock store:', backendError);
        
        const user = authStore.register({
          name: data.name,
          email: data.email,
          password: data.password,
          cpf: data.cpf.replace(/\D/g, ''),
          phone: data.phone.replace(/\D/g, ''),
        });

        // Fazer login automático
        await login({
          email: data.email,
          password: data.password,
          remember: false,
        });

        refreshUser();
        toast.success('Conta criada com sucesso! Complete sua verificação no perfil.');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao criar conta';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SeuInstrutor</h1>
          <p className="text-gray-600">Crie sua conta e comece agora</p>
        </div>

        {/* Register Card */}
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Criar Conta</h2>
              <p className="text-sm text-gray-500">Preencha os dados para se cadastrar</p>
            </div>

            {/* Erro geral */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <Input
                {...register('name')}
                id="name"
                type="text"
                label="Nome completo"
                placeholder="Seu nome completo"
                error={errors.name?.message}
                required
                autoComplete="name"
                autoFocus
              />
            </div>

            <div>
              <Input
                {...register('email')}
                id="email"
                type="email"
                label="E-mail"
                placeholder="seu@email.com"
                error={errors.email?.message}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <Input
                {...register('cpf')}
                id="cpf"
                type="text"
                label="CPF"
                placeholder="00000000000"
                error={errors.cpf?.message}
                required
                maxLength={11}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  e.target.value = value;
                  register('cpf').onChange(e);
                }}
              />
            </div>

            <div>
              <Input
                {...register('phone')}
                id="phone"
                type="text"
                label="Telefone"
                placeholder="11999999999"
                error={errors.phone?.message}
                required
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  e.target.value = value;
                  register('phone').onChange(e);
                }}
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Senha"
                  placeholder="Mínimo 8 caracteres"
                  error={errors.password?.message}
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="relative">
                <Input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirmar senha"
                  placeholder="Digite a senha novamente"
                  error={errors.confirmPassword?.message}
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Entrar
                </Link>
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                Ao criar uma conta, você concorda com nossos{' '}
                <Link to="/terms" className="text-primary-600 hover:underline">
                  termos de uso
                </Link>{' '}
                e{' '}
                <Link to="/privacy" className="text-primary-600 hover:underline">
                  política de privacidade
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} SeuInstrutor. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
