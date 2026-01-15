import { http } from '../http';
import type { LoginRequest, LoginResponse } from '../types';

export const authApi = {
  /**
   * Login do usuário
   * POST /auth/login
   * 
   * IMPORTANTE: O backend retorna { access_token, user }
   * Se seu backend usar outro nome (token, accessToken), ajuste abaixo.
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await http.post<LoginResponse>('/auth/login', data);
    
    // Tenta diferentes formatos de resposta
    const responseData = response.data as any;
    
    // Formato esperado: { access_token, user }
    if (responseData.access_token) {
      return responseData as LoginResponse;
    }
    
    // Fallback: { token, user }
    if (responseData.token) {
      console.warn('Token recebido como "token" em vez de "access_token". Ajuste em api/endpoints/auth.ts se necessário.');
      return {
        access_token: responseData.token,
        user: responseData.user,
      };
    }
    
    // Fallback: { accessToken, user }
    if (responseData.accessToken) {
      console.warn('Token recebido como "accessToken" em vez de "access_token". Ajuste em api/endpoints/auth.ts se necessário.');
      return {
        access_token: responseData.accessToken,
        user: responseData.user,
      };
    }
    
    // Se nenhum formato funcionou
    console.error('Resposta inesperada do login:', responseData);
    throw new Error('Token não encontrado na resposta do servidor. Verifique api/endpoints/auth.ts');
  },
};
