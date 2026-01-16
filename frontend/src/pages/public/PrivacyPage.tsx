import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
        </div>

        <Card>
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">SeuInstrutor</h2>
              <Link to="/login">
                <Button variant="ghost" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              </Link>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-gray-600 mb-4">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Informações que Coletamos</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  Coletamos informações que você nos fornece diretamente, incluindo:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                  <li>Nome e informações de contato</li>
                  <li>Informações de conta (e-mail, senha)</li>
                  <li>Documentos enviados para verificação</li>
                  <li>Dados de uso da plataforma</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Como Usamos suas Informações</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  Utilizamos suas informações para:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Processar transações e pagamentos</li>
                  <li>Verificar identidade e documentos</li>
                  <li>Enviar notificações importantes</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Compartilhamento de Informações</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Não vendemos suas informações pessoais. Podemos compartilhar informações apenas:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4 mt-2">
                  <li>Com prestadores de serviços que nos ajudam a operar</li>
                  <li>Quando exigido por lei ou processo legal</li>
                  <li>Para proteger nossos direitos e segurança</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Segurança</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Implementamos medidas de segurança para proteger suas informações pessoais. 
                  No entanto, nenhum método de transmissão pela internet é 100% seguro.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Seus Direitos</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  Você tem o direito de:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir informações incorretas</li>
                  <li>Solicitar exclusão de dados</li>
                  <li>Opor-se ao processamento de dados</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Cookies</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência. 
                  Você pode gerenciar preferências de cookies nas configurações do navegador.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Alterações nesta Política</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Contato</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Para questões sobre privacidade, entre em contato conosco através dos canais de suporte.
                </p>
              </section>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
