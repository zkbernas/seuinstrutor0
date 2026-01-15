import { http } from '../http';
import type { Student, CreateStudentRequest, UpdateStudentRequest } from '../types';

export const studentsApi = {
  list: async (): Promise<Student[]> => {
    const { data } = await http.get('/students');
    return data;
  },

  create: async (payload: CreateStudentRequest): Promise<Student> => {
    const { data } = await http.post('/students', payload);
    return data;
  },

  getById: async (id: string): Promise<Student> => {
    const { data } = await http.get(`/students/${id}`);
    return data;
  },

  update: async (id: string, payload: UpdateStudentRequest): Promise<Student> => {
    const { data } = await http.patch(`/students/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await http.delete(`/students/${id}`);
  },

  getStats: async (): Promise<{
    total: number;
    active: number;
    completed: number;
    inactive: number;
  }> => {
    const { data } = await http.get('/students/stats');
    return data;
  },
};
