import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Car, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import type { Instructor } from '../../api/types';
import { formatPrice } from '../../utils/format';

interface InstructorCardProps {
  instructor: Instructor;
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  const navigate = useNavigate();

  // Mock data (até implementar no backend)
  const rating = instructor.rating || 4.8;
  const reviewCount = instructor.reviewCount || 132;
  const yearsExperience = instructor.yearsExperience || 5;
  const availableShifts = instructor.availableShifts || ['Manhã', 'Tarde'];

  // Primeiro veículo (ou mock)
  const firstVehicle = instructor.vehicles?.[0];
  const vehicleInfo = firstVehicle
    ? `${firstVehicle.brand} ${firstVehicle.model} ${firstVehicle.year}`
    : 'A confirmar';

  // Avatar fallback
  const avatarInitials = instructor.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleViewProfile = () => {
    navigate(`/app/instructors/${instructor.id}`);
  };

  const handleSchedule = () => {
    navigate(`/app/lessons/new?instructorId=${instructor.id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagem do Avatar */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200">
        {instructor.avatarUrl ? (
          <img
            src={instructor.avatarUrl}
            alt={instructor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-primary-700">
              {avatarInitials}
            </span>
          </div>
        )}
        
        {/* Badge de Rating */}
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1.5 flex items-center gap-1 shadow-md">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-gray-900">{rating}</span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-5">
        {/* Nome e Experiência */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {instructor.name}
          </h3>
          <p className="text-sm text-gray-600">
            Instrutor há {yearsExperience} {yearsExperience === 1 ? 'ano' : 'anos'}
          </p>
        </div>

        {/* Chips de Categorias */}
        <div className="flex flex-wrap gap-2 mb-3">
          {instructor.categories.map((cat) => (
            <Badge key={cat} variant="primary" className="text-xs">
              CAT {cat}
            </Badge>
          ))}
          <Badge variant="outline" className="text-xs">
            Reciclagem
          </Badge>
        </div>

        {/* Rating e Avaliações */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-700">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{rating}</span>
          <span className="text-gray-500">•</span>
          <span>{reviewCount} avaliações</span>
        </div>

        {/* Bio */}
        {instructor.bio && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {instructor.bio}
          </p>
        )}

        {/* Informações */}
        <div className="space-y-2 mb-4 text-sm text-gray-700">
          {instructor.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>Atende: {instructor.address}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>Disponível: {availableShifts.join(', ')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-gray-400" />
            <span>Veículo: {vehicleInfo}</span>
          </div>
        </div>

        {/* Preço */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            Aulas a partir de{' '}
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(instructor.pricePerHour)}
            </span>
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewProfile}
            className="flex-1"
          >
            Ver Perfil
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSchedule}
            className="flex-1"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Agendar
          </Button>
        </div>
      </div>
    </Card>
  );
}
