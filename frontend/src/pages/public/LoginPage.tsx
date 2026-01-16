import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { toast } from '../../components/ui/Toast';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login: loginContext, user, session, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const errorParam = searchParams.get('error');
  const blockedError = errorParam === 'blocked';

  // ✅ Redirecionar quando autenticado (após login bem-sucedido)
  // ✅ Agora SEMPRE navegamos para /app e deixamos o RoleBasedRedirect decidir.
  useEffect(() => {
    if (shouldRedirect && isAuthenticated && user && session) {
      setIsLoading(false);

      if (user.status === 'BLOCKED') {
        setError('Conta bloqueada. Contate o suporte.');
        setShouldRedirect(false);
        return;
      }

      // ✅ Não redireciona por role aqui.
      // ✅ Vai para /app (index), que executa <RoleBasedRedirect />
      navigate('/app', { replace: true });

      setShouldRedirect(false);
    }
  }, [shouldRedirect, isAuthenticated, user, session, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember: false,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError(null);

      await loginContext({
        email: data.email,
        password: data.password,
        remember: data.remember,
      });

      toast.success('Login realizado com sucesso!');

      // ✅ Marcar para redirecionar (o useEffect fará o redirect)
      setShouldRedirect(true);
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao fazer login';
      setError(errorMessage);
      toast.error(errorMessage);
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
          <p className="text-gray-600">Gerencie sua autoescola com eficiência</p>
        </div>

        {/* Login Card */}
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Entrar</h2>
              <p className="text-sm text-gray-500">Digite suas credenciais para continuar</p>
            </div>

            {/* Erro geral */}
            {(error || blockedError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  {blockedError ? 'Conta bloqueada. Contate o suporte.' : error}
                </p>
              </div>
            )}

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
                autoFocus
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Senha"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('remember')}
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Manter conectado</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Esqueci minha senha
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Cadastre-se
                </Link>
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                Ao entrar, você concorda com nossos{' '}
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
