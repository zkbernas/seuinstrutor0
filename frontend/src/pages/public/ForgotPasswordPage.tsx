import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Lock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SeuInstrutor</h1>
        </div>

        <Card>
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Lock className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Esqueci minha senha</h2>
              <p className="text-sm text-gray-600">
                Esta funcionalidade estará disponível em breve.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Por enquanto, entre em contato com o suporte para recuperar sua senha.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              <Link to="/login">
                <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para login
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} SeuInstrutor. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
