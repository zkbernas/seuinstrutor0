import { http } from '../http';
import type { 
  Instructor, 
  CreateInstructorRequest,
  UpdateInstructorRequest 
} from '../types';

export const instructorsApi = {
  /**
   * Lista todos os instrutores (aprovados para students)
   */
  list: async (filters?: {
    status?: 'APPROVED';
    category?: string;
    search?: string;
  }): Promise<Instructor[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const url = `/instructors${queryString ? `?${queryString}` : ''}`;
    const response = await http.get<Instructor[]>(url);
    return response.data;
  },

  /**
   * Lista instrutores aprovados (para feed de students)
   */
  listApproved: async (filters?: {
    category?: string;
    search?: string;
    transmission?: string;
    adapted?: boolean;
  }): Promise<Instructor[]> => {
    const params = new URLSearchParams();
    params.append('status', 'APPROVED');
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.transmission) params.append('transmission', filters.transmission);
    if (filters?.adapted !== undefined) params.append('adapted', String(filters.adapted));
    
    const response = await http.get<Instructor[]>(`/instructors?${params.toString()}`);
    return response.data;
  },

  /**
   * Busca instrutor por ID
   */
  getById: async (id: string): Promise<Instructor> => {
    const response = await http.get<Instructor>(`/instructors/${id}`);
    return response.data;
  },

  /**
   * Cria novo instrutor - Agora enviando Token via Interceptor
   */
  create: async (data: CreateInstructorRequest): Promise<Instructor> => {
    const response = await http.post<Instructor>('/instructors', data);
    return response.data;
  },

  /**
   * Atualiza instrutor
   */
  update: async (id: string, data: UpdateInstructorRequest): Promise<Instructor> => {
    const response = await http.patch<Instructor>(`/instructors/${id}`, data);
    return response.data;
  },

  /**
   * Remove instrutor
   */
  delete: async (id: string): Promise<void> => {
    await http.delete(`/instructors/${id}`);
  },
};