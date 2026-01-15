// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// Instructor types
export interface Instructor {
  id: string;
  name: string;
  email: string;
  cpf: string;
  credenicalNumber: string;
  phone: string;
  pricePerHour: number;
  categories: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstructorRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
  credenicalNumber: string;
  phone: string;
  pricePerHour: number;
  categories: string[];
}

export interface UpdateInstructorRequest {
  name?: string;
  email?: string;
  cpf?: string;
  credenicalNumber?: string;
  phone?: string;
  pricePerHour?: number;
  categories?: string[];
}

// Billing types (prepared for future)
export type BillingStatus = 'trial' | 'active' | 'past_due' | 'canceled' | 'none';
export type BillingPlan = 'starter' | 'pro' | 'business' | null;

export interface Subscription {
  status: BillingStatus;
  plan: BillingPlan;
  currentPeriodEnd?: string;
}

// Student types
export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'DROPPED';

export interface Student {
  id: string;
  userId: string;
  cpf: string;
  phone: string;
  birthDate?: string;
  avatarUrl?: string;
  
  // Endereço
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  
  // CNH
  cnhType?: string;
  cnhNumber?: string;
  cnhIssueDate?: string;
  
  // Status do curso
  enrollmentDate: string;
  status: StudentStatus;
  completionDate?: string;
  
  // Informações adicionais
  notes?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  
  // Relações
  user?: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  lessons?: any[];
  _count?: {
    lessons: number;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  birthDate?: string;
  avatarUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  cnhType?: string;
  cnhNumber?: string;
  cnhIssueDate?: string;
  notes?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  status?: StudentStatus;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {}

// API Error
export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}
