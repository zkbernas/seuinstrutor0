import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star, MapPin, Phone, Mail, Car, Calendar, Clock, CheckCircle } from 'lucide-react';
import { instructorsApi } from '../../api/endpoints/instructors';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatPrice, formatPhone } from '../../utils/format';

export function InstructorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: instructor, isLoading } = useQuery({
    queryKey: ['instructor', id],
    queryFn: () => instructorsApi.getById(id!),
    enabled: !!id,
  });

  // Mock data
  const rating = instructor?.rating || 4.8;
  const reviewCount = instructor?.reviewCount || 132;
  const yearsExperience = instructor?.yearsExperience || 5;
  const availableShifts = instructor?.availableShifts || ['Manhã', 'Tarde', 'Noite'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Instrutor não encontrado
        </h3>
        <Button variant="outline" onClick={() => navigate('/app/home')}>
          Voltar para o feed
        </Button>
      </div>
    );
  }

  const avatarInitials = instructor.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Botão Voltar */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/app/home')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      {/* Header do Perfil */}
      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {instructor.avatarUrl ? (
              <img
                src={instructor.avatarUrl}
                alt={instructor.name}
                className="w-32 h-32 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary-700">
                  {avatarInitials}
                </span>
              </div>
            )}
          </div>

          {/* Informações Principais */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {instructor.name}
                </h1>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{rating}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{reviewCount} avaliações</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Instrutor há {yearsExperience} {yearsExperience === 1 ? 'ano' : 'anos'}
                </p>
              </div>
            </div>

            {/* Categorias */}
            <div className="flex flex-wrap gap-2 mb-4">
              {instructor.categories.map((cat) => (
                <Badge key={cat} variant="primary">
                  CAT {cat}
                </Badge>
              ))}
            </div>

            {/* Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {instructor.phone && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{formatPhone(instructor.phone)}</span>
                </div>
              )}
              {instructor.email && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{instructor.email}</span>
                </div>
              )}
              {instructor.address && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{instructor.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/app/lessons/new?instructorId=${instructor.id}`)}
              className="w-full md:w-auto"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Agendar Aula
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conteúdo Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          {instructor.bio && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Sobre o Instrutor
              </h2>
              <p className="text-gray-700 leading-relaxed">{instructor.bio}</p>
            </Card>
          )}

          {/* Veículos */}
          {instructor.vehicles && instructor.vehicles.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Veículos Disponíveis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {instructor.vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Car className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {vehicle.brand} {vehicle.model}
                        </p>
                        <p className="text-sm text-gray-600">
                          {vehicle.year} • {vehicle.transmission === 'MANUAL' ? 'Manual' : 'Automático'}
                        </p>
                      </div>
                    </div>
                    {vehicle.isAdapted && (
                      <Badge variant="outline" className="text-xs mt-2">
                        Adaptado
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Avaliações (Mock) */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Avaliações ({reviewCount})
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Aluno {i}
                    </span>
                    <span className="text-xs text-gray-500">há {i} semana{i > 1 ? 's' : ''}</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Excelente instrutor! Muito paciente e didático. Recomendo!
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              * Avaliações são mockadas. Implementar sistema de avaliações no futuro.
            </p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preço */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Preços
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Aula de 50 minutos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(instructor.pricePerHour)}
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Aula de 100 minutos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(instructor.pricePerHour * 2)}
                </p>
              </div>
            </div>
          </Card>

          {/* Disponibilidade */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Disponibilidade
            </h3>
            <div className="space-y-2">
              {availableShifts.map((shift) => (
                <div key={shift} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{shift}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              * Horários podem variar. Confirme com o instrutor ao agendar.
            </p>
          </Card>

          {/* Locais Atendidos */}
          {instructor.address && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Locais Atendidos
              </h3>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{instructor.address}</span>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                * Mapa interativo será implementado no futuro.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
