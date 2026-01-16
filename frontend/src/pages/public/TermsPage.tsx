import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Termos de Uso</h1>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Aceitação dos Termos</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Ao acessar e usar o SeuInstrutor, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                  Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Uso do Serviço</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  O SeuInstrutor é uma plataforma de gestão para autoescolas e instrutores. Você concorda em:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                  <li>Fornecer informações precisas e atualizadas</li>
                  <li>Manter a segurança de sua conta</li>
                  <li>Não usar o serviço para fins ilegais</li>
                  <li>Respeitar os direitos de outros usuários</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Conta de Usuário</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Você é responsável por manter a confidencialidade de suas credenciais de login. 
                  Qualquer atividade que ocorra sob sua conta é de sua responsabilidade.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Propriedade Intelectual</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Todo o conteúdo do SeuInstrutor, incluindo textos, gráficos, logos e software, 
                  é propriedade do SeuInstrutor e está protegido por leis de direitos autorais.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Limitação de Responsabilidade</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  O SeuInstrutor não se responsabiliza por danos diretos, indiretos, incidentais ou consequenciais 
                  resultantes do uso ou incapacidade de usar nosso serviço.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Modificações</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Reservamos o direito de modificar estes termos a qualquer momento. 
                  Alterações significativas serão notificadas aos usuários.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Contato</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Para questões sobre estes termos, entre em contato conosco através dos canais de suporte.
                </p>
              </section>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
