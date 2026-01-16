import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Calendar, MapPin } from 'lucide-react';
import { instructorsApi } from '../../api/endpoints/instructors';
import { lessonsApi } from '../../api/endpoints/lessons';
import { useAuth } from '../../auth/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { InstructorCard } from '../../components/instructors/InstructorCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/format';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function StudentHomeFeed() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [transmissionFilter, setTransmissionFilter] = useState<string>('');
  const [adaptedFilter, setAdaptedFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('rating');

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Buscar próxima aula
  const { data: nextLesson } = useQuery({
    queryKey: ['lessons', 'upcoming'],
    queryFn: async () => {
      try {
        const allLessons = await lessonsApi.list();
        const upcoming = allLessons
          .filter(l => l.status === 'PENDING' || l.status === 'CONFIRMED')
          .filter(l => new Date(l.scheduledAt) > new Date())
          .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
        return upcoming[0] || null;
      } catch (error) {
        // Se falhar, retornar null (pode ser que não tenha endpoint ainda)
        return null;
      }
    },
  });

  // Buscar instrutores aprovados
  const { data: instructors, isLoading } = useQuery({
    queryKey: ['instructors', 'approved', debouncedSearch, categoryFilter, transmissionFilter, adaptedFilter],
    queryFn: async () => {
      try {
        const data = await instructorsApi.listApproved({
          search: debouncedSearch || undefined,
          category: categoryFilter || undefined,
          transmission: transmissionFilter || undefined,
          adapted: adaptedFilter === 'true' ? true : adaptedFilter === 'false' ? false : undefined,
        });
        
        // Adicionar dados mockados até implementar no backend
        return data.map(instructor => ({
          ...instructor,
          name: instructor.user?.name || instructor.name,
          rating: instructor.rating || 4.5 + Math.random() * 0.5, // 4.5-5.0
          reviewCount: instructor.reviewCount || Math.floor(Math.random() * 200) + 50, // 50-250
          yearsExperience: instructor.yearsExperience || Math.floor(Math.random() * 10) + 3, // 3-13
          availableShifts: instructor.availableShifts || ['Manhã', 'Tarde'],
        }));
      } catch (error) {
        console.warn('Erro ao buscar instrutores, usando fallback:', error);
        return [];
      }
    },
  });

  // Filtrar e ordenar
  const filteredInstructors = useMemo(() => {
    if (!instructors) return [];

    let filtered = [...instructors];

    // Ordenação
    if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [instructors, sortBy]);

  const categoryOptions = [
    { value: '', label: 'Todas as categorias' },
    { value: 'A', label: 'Categoria A' },
    { value: 'B', label: 'Categoria B' },
    { value: 'AB', label: 'Categoria A+B' },
  ];

  const transmissionOptions = [
    { value: '', label: 'Todas' },
    { value: 'MANUAL', label: 'Manual' },
    { value: 'AUTOMATIC', label: 'Automático' },
  ];

  const adaptedOptions = [
    { value: '', label: 'Todos' },
    { value: 'true', label: 'Adaptado' },
    { value: 'false', label: 'Não adaptado' },
  ];

  const sortOptions = [
    { value: 'rating', label: 'Melhor avaliados' },
    { value: 'price', label: 'Menor preço' },
    { value: 'name', label: 'Nome A-Z' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Instrutores disponíveis"
        description="Escolha um instrutor e agende sua próxima aula"
      />

      {/* Card: Próxima Aula */}
      {nextLesson ? (
        <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Sua próxima aula
                </h3>
                <p className="text-sm text-gray-700">
                  {formatDateTime(nextLesson.scheduledAt)} com {nextLesson.instructor?.name || 'Instrutor'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/app/classes')}
            >
              Ver detalhes
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Agende sua primeira aula
                </h3>
                <p className="text-sm text-gray-700">
                  Escolha um instrutor abaixo e comece sua jornada
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (filteredInstructors && filteredInstructors.length > 0) {
                  navigate(`/app/instructor/${filteredInstructors[0].id}`);
                }
              }}
            >
              Ver instrutores
            </Button>
          </div>
        </Card>
      )}

      {/* Filtros e Busca */}
      <Card>
        <div className="space-y-4">
          {/* Busca */}
          <div>
            <Input
              placeholder="Buscar por nome ou bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Filtros em Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Categoria"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categoryOptions}
            />
            <Select
              label="Transmissão"
              value={transmissionFilter}
              onChange={(e) => setTransmissionFilter(e.target.value)}
              options={transmissionOptions}
            />
            <Select
              label="Adaptado"
              value={adaptedFilter}
              onChange={(e) => setAdaptedFilter(e.target.value)}
              options={adaptedOptions}
            />
            <Select
              label="Ordenar por"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
            />
          </div>
        </div>
      </Card>

      {/* Grid de Instrutores */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredInstructors.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhum instrutor encontrado"
          description="Tente ajustar os filtros ou buscar por outros termos"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInstructors.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      )}
    </div>
  );
}
