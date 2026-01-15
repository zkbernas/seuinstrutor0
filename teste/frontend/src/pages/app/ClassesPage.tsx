import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { FeatureGate } from '../../billing/components/FeatureGate';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function ClassesPage() {
  const upcomingFeatures = [
    {
      icon: Calendar,
      title: 'Agendamento de Aulas',
      description: 'Sistema completo para agendar e gerenciar aulas práticas e teóricas',
    },
    {
      icon: Clock,
      title: 'Controle de Horários',
      description: 'Visualização de horários disponíveis e ocupados por instrutor',
    },
    {
      icon: Users,
      title: 'Gestão de Alunos',
      description: 'Cadastro de alunos, histórico de aulas e progresso de aprendizado',
    },
    {
      icon: MapPin,
      title: 'Rotas e Locais',
      description: 'Definição de pontos de encontro e rotas de aula',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Aulas"
        description="Gestão completa de aulas práticas e teóricas"
      />

      {/* Exemplo de FeatureGate - módulo de aulas requer plano Pro */}
      <FeatureGate requiredPlan="pro" feature="o módulo de aulas avançado">

      <Card className="bg-gradient-to-br from-primary-50 to-white border-primary-200">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-primary-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Módulo de Aulas em Desenvolvimento
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Estamos trabalhando em um sistema completo de gestão de aulas que revolucionará
            a forma como você administra sua autoescola. A base arquitetural já está pronta!
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-primary-200 shadow-sm">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              Lançamento previsto: Em breve
            </span>
          </div>
        </div>
      </Card>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {upcomingFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:shadow-medium transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

        <Card className="mt-8 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">
                Arquitetura Preparada
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                Toda a estrutura de rotas, componentes e integração com API já está configurada.
                Novos endpoints podem ser facilmente adicionados seguindo o padrão estabelecido.
              </p>
              <Button variant="outline" size="sm" disabled>
                Notificar quando disponível
              </Button>
            </div>
          </div>
        </Card>
      </FeatureGate>
    </div>
  );
}
