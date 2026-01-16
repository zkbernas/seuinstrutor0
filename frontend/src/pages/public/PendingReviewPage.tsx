import { useNavigate, useLocation, Link } from 'react-router-dom';
import { GraduationCap, CheckCircle, XCircle, AlertCircle, FileText, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function PendingReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { status?: string; justRegistered?: boolean } | null;
  const searchParams = new URLSearchParams(location.search);
  const statusParam = searchParams.get('state');

  // Determinar estado
  const status = state?.status || statusParam || 'PENDING_REVIEW';
  const isRejected = status === 'REJECTED';
  const isBlocked = status === 'BLOCKED';
  const isPending = status === 'PENDING_REVIEW' || !isRejected && !isBlocked;
  const justRegistered = state?.justRegistered || false;

  const checklist = [
    { label: 'CNH (Carteira Nacional de Habilitação)', required: true },
    { label: 'CPF', required: true },
    { label: 'Comprovante de Residência', required: true },
    { label: 'Foto de Perfil', required: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SeuInstrutor</h1>
        </div>

        <Card>
          <div className="space-y-6">
            {/* Header com ícone */}
            <div className="text-center">
              {isRejected && (
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              )}
              {isBlocked && (
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-600" />
                </div>
              )}
              {isPending && (
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isRejected && 'Documentos Reprovados'}
                {isBlocked && 'Conta Bloqueada'}
                {isPending && (justRegistered ? 'Conta Criada com Sucesso!' : 'Conta em Análise')}
              </h2>
              <p className="text-gray-600">
                {isRejected && 'Seus documentos foram reprovados. Por favor, reenvie-os para nova análise.'}
                {isBlocked && 'Sua conta foi bloqueada. Entre em contato com o suporte para mais informações.'}
                {isPending && (justRegistered 
                  ? 'Sua conta foi criada! Agora envie seus documentos para análise.'
                  : 'Sua conta está em análise. Aguarde a aprovação dos administradores.'
                )}
              </p>
            </div>

            {/* Conteúdo específico por estado */}
            {isPending && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Documentos necessários para análise:
                  </h3>
                  <div className="space-y-2">
                    {checklist.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-700">
                            {item.label}
                            {item.required && <span className="text-red-500 ml-1">*</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Próximos passos:</strong> Envie seus documentos através do sistema. 
                    Nossa equipe analisará e você receberá uma notificação quando sua conta for aprovada.
                  </p>
                </div>
              </div>
            )}

            {isRejected && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 mb-3">
                    <strong>Motivo da reprovação:</strong> Seus documentos não atenderam aos requisitos necessários.
                  </p>
                  <p className="text-sm text-red-700">
                    Por favor, verifique os documentos enviados e reenvie-os corrigidos. 
                    Certifique-se de que estão legíveis e completos.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Documentos necessários:
                  </h3>
                  <div className="space-y-2">
                    {checklist.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-700">
                            {item.label}
                            {item.required && <span className="text-red-500 ml-1">*</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isBlocked && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-800">
                  Sua conta foi bloqueada por violação dos termos de uso ou por solicitação administrativa.
                  Para mais informações ou para solicitar o desbloqueio, entre em contato com nosso suporte.
                </p>
              </div>
            )}

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para login
              </Button>
              {isPending && (
                <Button
                  variant="primary"
                  onClick={() => {
                    // Placeholder - em produção, navegaria para página de upload de documentos
                    alert('Funcionalidade de envio de documentos em breve');
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Enviar Documentos
                </Button>
              )}
              {isRejected && (
                <Button
                  variant="primary"
                  onClick={() => {
                    // Placeholder - em produção, navegaria para página de reenvio
                    alert('Funcionalidade de reenvio de documentos em breve');
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Reenviar Documentos
                </Button>
              )}
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
