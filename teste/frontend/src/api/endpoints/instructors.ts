import { http } from '../http';
import type { 
  Instructor, 
  CreateInstructorRequest,
  UpdateInstructorRequest 
} from '../types';

export const instructorsApi = {
  /**
   * Lista todos os instrutores
   */
  list: async (): Promise<Instructor[]> => {
    const response = await http.get<Instructor[]>('/instructors');
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