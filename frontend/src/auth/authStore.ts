// Tipos
export type UserRole = 'ADMIN' | 'OPERATOR' | 'INSTRUCTOR' | 'STUDENT';
export type UserStatus = 'ACTIVE' | 'PENDING_REVIEW' | 'REJECTED' | 'BLOCKED';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // MVP: plain text (em produção usar hash)
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  role: UserRole;
  status: UserStatus;
  expiresAt: string;
}

const USERS_KEY = 'si_users_v1';
const SESSION_KEY = 'si_session_v1';

// Função para gerar IDs únicos
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Função para gerar token simples
function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Hash simples para MVP (NÃO usar em produção!)
function simpleHash(password: string): string {
  // MVP: apenas base64 encode (NÃO é seguro!)
  return btoa(password);
}

function simpleHashVerify(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

// Carregar usuários do localStorage
function loadUsers(): User[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
  }
  
  // Seed inicial
  const seedUsers: User[] = [
    {
      id: generateId(),
      name: 'Admin Principal',
      email: 'admin@local.dev',
      password: simpleHash('Admin#12345'), // Hash simples
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: 'Operador',
      email: 'operador@local.dev',
      password: simpleHash('Operador#12345'),
      role: 'OPERATOR',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: 'Instrutor Aprovado',
      email: 'instrutor@email.com',
      password: simpleHash('Instrutor#12345'),
      role: 'INSTRUCTOR',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: 'Instrutor Pendente',
      email: 'pendente@email.com',
      password: simpleHash('Pendente#12345'),
      role: 'INSTRUCTOR',
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: 'Estudante Teste',
      email: 'student@email.com',
      password: simpleHash('Student#12345'),
      role: 'STUDENT',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    },
  ];
  
  saveUsers(seedUsers);
  return seedUsers;
}

// Salvar usuários
function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
  }
}

// Store global
let users: User[] = loadUsers();

export const authStore = {
  // Registrar novo usuário
  register(payload: { name: string; email: string; password: string; cpf?: string; phone?: string }): User {
    // Verificar se email já existe
    const existing = users.find(u => u.email.toLowerCase() === payload.email.toLowerCase());
    if (existing) {
      throw new Error('Este e-mail já está cadastrado');
    }

    const newUser: User = {
      id: generateId(),
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: simpleHash(payload.password), // Hash simples
      role: 'STUDENT', // Todos os novos registros começam como STUDENT
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Se houver CPF e phone, criar StudentProfile no mock store (se existir)
    if (payload.cpf && payload.phone) {
      try {
        const studentsKey = 'si_students_v1';
        const existingStudents = JSON.parse(localStorage.getItem(studentsKey) || '[]');
        
        // Verificar se já existe student com esse CPF
        const existingStudent = existingStudents.find((s: any) => s.cpf === payload.cpf);
        if (!existingStudent) {
          const newStudent = {
            id: generateId(),
            userId: newUser.id,
            cpf: payload.cpf,
            phone: payload.phone,
            createdAt: new Date().toISOString(),
          };
          existingStudents.push(newStudent);
          localStorage.setItem(studentsKey, JSON.stringify(existingStudents));
        }
      } catch (error) {
        console.warn('Erro ao criar StudentProfile no mock store:', error);
      }
    }

    return newUser;
  },

  // Login
  login(payload: { email: string; password: string; remember?: boolean }): Session {
    const user = users.find(u => u.email.toLowerCase() === payload.email.toLowerCase());
    
    if (!user) {
      throw new Error('E-mail ou senha incorretos.');
    }

    // Verificar senha (MVP: comparação simples)
    if (!simpleHashVerify(payload.password, user.password)) {
      throw new Error('E-mail ou senha incorretos.');
    }

    // Verificar status
    if (user.status === 'BLOCKED') {
      throw new Error('Conta bloqueada. Contate o suporte.');
    }

    // Criar sessão
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (payload.remember ? 30 : 1)); // 30 dias ou 1 dia

    const session: Session = {
      token: generateToken(),
      userId: user.id,
      role: user.role,
      status: user.status,
      expiresAt: expiresAt.toISOString(),
    };

    // Salvar sessão
    if (payload.remember) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    return session;
  },

  // Logout
  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  },

  // Deletar conta
  deleteAccount(userId: string): void {
    // Remover usuário do array
    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
    
    // Fazer logout
    authStore.logout();
  },

  // Obter sessão atual
  getSession(): Session | null {
    // Tentar localStorage primeiro
    let stored = localStorage.getItem(SESSION_KEY);
    if (!stored) {
      stored = sessionStorage.getItem(SESSION_KEY);
    }

    if (!stored) return null;

    try {
      const session: Session = JSON.parse(stored);
      
      // Verificar expiração
      if (new Date(session.expiresAt) < new Date()) {
        authStore.logout();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  },

  // Obter usuário atual
  getCurrentUser(): User | null {
    const session = authStore.getSession();
    if (!session) return null;

    const user = users.find(u => u.id === session.userId);
    return user || null;
  },

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return authStore.getSession() !== null;
  },

  // Verificar se pode acessar admin
  canAccessAdmin(): boolean {
    const session = authStore.getSession();
    if (!session) return false;
    return session.role === 'ADMIN' || session.role === 'OPERATOR';
  },

  // Atualizar status do usuário
  updateUserStatus(userId: string, status: UserStatus): User {
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('Usuário não encontrado');

    user.status = status;
    saveUsers(users);

    // Se status mudou, invalidar sessão se necessário
    const session = authStore.getSession();
    if (session && session.userId === userId) {
      session.status = status;
      const storage = localStorage.getItem(SESSION_KEY) ? localStorage : sessionStorage;
      storage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    return user;
  },

  // Helpers
  getUserById(userId: string): User | undefined {
    return users.find(u => u.id === userId);
  },

  getUserByEmail(email: string): User | undefined {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  // Reset (útil para desenvolvimento)
  reset() {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    users = loadUsers();
  },
};
