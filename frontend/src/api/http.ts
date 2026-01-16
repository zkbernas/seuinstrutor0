import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Adiciona o Token com o prefixo Bearer
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Garante que o cabeçalho Authorization seja preenchido corretamente
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Trata erros de autenticação e permissão
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // 1. ERRO 401: Token inválido ou expirado -> DESLOGAR
    if (response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // 2. ERRO 403: Usuário autenticado, mas sem permissão (Role errada)
    // Aqui NÃO deslogamos, apenas avisamos que ele não tem acesso.
    if (response?.status === 403) {
      console.error('Acesso negado: Você não tem permissão de Administrador.');
      // Opcional: alert('Você não tem permissão para realizar esta ação.');
    }

    // Formatação da mensagem de erro vinda do NestJS
    const errorMessage = 
      response?.data?.message || 
      response?.data?.error ||
      error.message ||
      'Erro ao processar requisição';

    return Promise.reject({
      message: errorMessage,
      statusCode: response?.status,
      data: response?.data,
    });
  }
);