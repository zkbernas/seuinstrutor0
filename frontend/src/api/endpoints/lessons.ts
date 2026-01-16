import { http } from '../http';
import type { Lesson, CreateLessonRequest } from '../types';

export const lessonsApi = {
  /**
   * Lista todas as aulas do estudante logado
   */
  list: async (): Promise<Lesson[]> => {
    const response = await http.get<Lesson[]>('/lessons');
    return response.data;
  },

  /**
   * Busca aula por ID
   */
  getById: async (id: string): Promise<Lesson> => {
    const response = await http.get<Lesson>(`/lessons/${id}`);
    return response.data;
  },

  /**
   * Cria nova aula
   */
  create: async (data: CreateLessonRequest): Promise<Lesson> => {
    const response = await http.post<Lesson>('/lessons', data);
    return response.data;
  },

  /**
   * Atualiza aula
   */
  update: async (id: string, data: Partial<CreateLessonRequest>): Promise<Lesson> => {
    const response = await http.patch<Lesson>(`/lessons/${id}`, data);
    return response.data;
  },

  /**
   * Remove aula
   */
  delete: async (id: string): Promise<void> => {
    await http.delete(`/lessons/${id}`);
  },
};
