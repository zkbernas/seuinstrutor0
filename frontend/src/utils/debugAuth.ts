// Utilitário para debug de autenticação
export function debugAuth() {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  const sessionStr = localStorage.getItem('si_session_v1') || sessionStorage.getItem('si_session_v1');
  const usersStr = localStorage.getItem('si_users_v1');

  console.log('=== DEBUG AUTH ===');
  console.log('User (localStorage/sessionStorage):', userStr ? JSON.parse(userStr) : null);
  console.log('Session (mock store):', sessionStr ? JSON.parse(sessionStr) : null);
  console.log('Users (mock store):', usersStr ? JSON.parse(usersStr) : null);
  console.log('Access Token:', localStorage.getItem('access_token') || sessionStorage.getItem('access_token'));
  console.log('==================');
}

// Função para limpar dados de auth
export function clearAuth() {
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  localStorage.removeItem('si_session_v1');
  localStorage.removeItem('si_users_v1');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('si_session_v1');
  console.log('Auth data cleared!');
}
