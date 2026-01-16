// Tipos
export type UserRole = 'ADMIN' | 'OPERATOR' | 'INSTRUCTOR';
export type UserStatus = 'ACTIVE' | 'BLOCKED';
export type InstructorStatus = 'APPROVED' | 'PENDING_REVIEW' | 'REJECTED' | 'BLOCKED';
export type PlanType = 'Starter' | 'Pro' | 'Scale';
export type DocumentType = 'CNH' | 'CPF' | 'COMPROV_RESIDENCIA' | 'FOTO_PERFIL' | 'OUTRO';
export type DocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED';
export type PaymentMethod = 'PIX' | 'CARD' | 'TRANSFER' | 'OTHER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: InstructorStatus;
  plan: PlanType;
  createdAt: string;
  lastReviewReason?: string;
  lastReviewNotes?: string;
}

export type ReviewReason = 'ILEGIVEL' | 'DIVERGENCIA' | 'FALTANDO_DOC' | 'OUTRO';

export interface Document {
  id: string;
  instructorId: string;
  type: DocumentType;
  status: DocumentStatus;
  url?: string;
  fileUrl?: string;
  uploadedAt: string;
  reviewNotes?: string;
  reviewReason?: ReviewReason;
}

export interface Payment {
  id: string;
  instructorId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  paidAt?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  meta: Record<string, any>;
  createdAt: string;
}

interface AdminStore {
  users: User[];
  instructors: Instructor[];
  documents: Document[];
  payments: Payment[];
  auditLogs: AuditLog[];
}

const STORAGE_KEY = 'admin_db_v1';

// Função para gerar IDs únicos
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Função para gerar data aleatória nos últimos 6 meses
function randomDate(): string {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  return new Date(randomTime).toISOString();
}

// Seed inicial de dados
function seedData(): AdminStore {
  const users: User[] = [
    { id: generateId(), name: 'Admin Principal', email: 'admin@seualuno.com', role: 'ADMIN', status: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: generateId(), name: 'Operador 1', email: 'operador1@seualuno.com', role: 'OPERATOR', status: 'ACTIVE', createdAt: randomDate() },
    { id: generateId(), name: 'Operador 2', email: 'operador2@seualuno.com', role: 'OPERATOR', status: 'ACTIVE', createdAt: randomDate() },
  ];

  const instructors: Instructor[] = [];
  const documents: Document[] = [];
  const payments: Payment[] = [];
  const auditLogs: AuditLog[] = [];

  const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Salvador', 'Brasília'];
  const plans: PlanType[] = ['Starter', 'Pro', 'Scale'];
  const statuses: InstructorStatus[] = ['APPROVED', 'PENDING_REVIEW', 'REJECTED', 'BLOCKED'];
  const docTypes: DocumentType[] = ['CNH', 'CPF', 'COMPROV_RESIDENCIA', 'FOTO_PERFIL'];

  // Criar 30 instrutores
  for (let i = 0; i < 30; i++) {
    const instructorId = generateId();
    const status = i < 10 ? 'PENDING_REVIEW' : i < 15 ? 'REJECTED' : i < 17 ? 'BLOCKED' : 'APPROVED';
    
    instructors.push({
      id: instructorId,
      name: `Instrutor ${i + 1}`,
      email: `instrutor${i + 1}@email.com`,
      phone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      status,
      plan: plans[Math.floor(Math.random() * plans.length)],
      createdAt: randomDate(),
    });

    // Criar documentos para cada instrutor
    const numDocs = Math.floor(Math.random() * 3) + 2; // 2-4 documentos
    for (let j = 0; j < numDocs; j++) {
      const docStatus: DocumentStatus = 
        status === 'PENDING_REVIEW' && j === 0 ? 'PENDING' :
        status === 'REJECTED' && j === 0 ? 'REJECTED' :
        'APPROVED';
      
      documents.push({
        id: generateId(),
        instructorId,
        type: docTypes[j % docTypes.length],
        status: docStatus,
        uploadedAt: randomDate(),
        reviewNotes: docStatus === 'REJECTED' ? 'Documento ilegível ou incompleto' : undefined,
      });
    }

    // Criar pagamentos para instrutores aprovados
    if (status === 'APPROVED') {
      const numPayments = Math.floor(Math.random() * 3) + 1;
      for (let k = 0; k < numPayments; k++) {
        const paymentStatus: PaymentStatus = k === 0 && Math.random() > 0.7 ? 'PENDING' : 'PAID';
        payments.push({
          id: generateId(),
          instructorId,
          amount: Math.floor(Math.random() * 500) + 100,
          status: paymentStatus,
          method: ['PIX', 'CARD', 'TRANSFER'][Math.floor(Math.random() * 3)] as PaymentMethod,
          paidAt: paymentStatus === 'PAID' ? randomDate() : undefined,
          createdAt: randomDate(),
        });
      }
    }
  }

  // Criar logs iniciais
  auditLogs.push(
    { id: generateId(), actor: 'Admin Principal', action: 'SYSTEM_INIT', entityType: 'SYSTEM', entityId: 'system', meta: {}, createdAt: new Date().toISOString() },
    { id: generateId(), actor: 'Admin Principal', action: 'USER_CREATED', entityType: 'USER', entityId: users[1].id, meta: { email: users[1].email }, createdAt: randomDate() },
  );

  return { users, instructors, documents, payments, auditLogs };
}

// Carregar ou inicializar store
function loadStore(): AdminStore {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Erro ao carregar store:', error);
  }
  
  const seeded = seedData();
  saveStore(seeded);
  return seeded;
}

// Salvar store
function saveStore(store: AdminStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error('Erro ao salvar store:', error);
  }
}

// Store global
let store: AdminStore = loadStore();

// Funções públicas
export const adminStore = {
  // Dashboard Stats
  getDashboardStats() {
    const pendingDocs = store.documents.filter(d => d.status === 'PENDING').length;
    const approvedInstructors = store.instructors.filter(i => i.status === 'APPROVED').length;
    const pendingInstructors = store.instructors.filter(i => i.status === 'PENDING_REVIEW').length;
    const rejectedInstructors = store.instructors.filter(i => i.status === 'REJECTED').length;
    
    // MRR estimado (soma dos planos dos aprovados)
    const planPrices: Record<PlanType, number> = { Starter: 99, Pro: 199, Scale: 399 };
    const mrr = store.instructors
      .filter(i => i.status === 'APPROVED')
      .reduce((sum, i) => sum + planPrices[i.plan], 0);
    
    // Inadimplentes (pagamentos PENDING/FAILED)
    const delinquent = store.payments.filter(p => 
      p.status === 'PENDING' || p.status === 'FAILED'
    ).length;

    return {
      totalUsers: store.users.length + store.instructors.length,
      approvedInstructors,
      pendingInstructors,
      rejectedInstructors,
      pendingDocuments: pendingDocs,
      estimatedMRR: mrr,
      delinquent,
    };
  },

  // Users
  listUsers(query?: string, filters?: { status?: UserStatus; role?: UserRole }) {
    let result = [...store.users];
    
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q)
      );
    }
    
    if (filters?.status) {
      result = result.filter(u => u.status === filters.status);
    }
    
    if (filters?.role) {
      result = result.filter(u => u.role === filters.role);
    }
    
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  updateUserStatus(userId: string, status: UserStatus) {
    const user = store.users.find(u => u.id === userId);
    if (!user) throw new Error('Usuário não encontrado');
    
    user.status = status;
    saveStore(store);
    
    adminStore.logAction('USER_STATUS_UPDATED', 'USER', userId, { 
      previousStatus: user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE',
      newStatus: status 
    });
    
    return user;
  },

  updateUserRole(userId: string, role: UserRole) {
    const user = store.users.find(u => u.id === userId);
    if (!user) throw new Error('Usuário não encontrado');
    
    const oldRole = user.role;
    user.role = role;
    saveStore(store);
    
    adminStore.logAction('USER_ROLE_UPDATED', 'USER', userId, { 
      previousRole: oldRole,
      newRole: role 
    });
    
    return user;
  },

  // Documents
  listDocuments(filters?: { status?: DocumentStatus; type?: DocumentType; instructorId?: string }) {
    let result = [...store.documents];
    
    if (filters?.status) {
      result = result.filter(d => d.status === filters.status);
    }
    
    if (filters?.type) {
      result = result.filter(d => d.type === filters.type);
    }
    
    if (filters?.instructorId) {
      result = result.filter(d => d.instructorId === filters.instructorId);
    }
    
    return result.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  },

  approveDocument(docId: string) {
    const doc = store.documents.find(d => d.id === docId);
    if (!doc) throw new Error('Documento não encontrado');
    
    doc.status = 'APPROVED';
    saveStore(store);
    
    // Verificar se todos os docs do instrutor foram aprovados
    const instructorDocs = store.documents.filter(d => d.instructorId === doc.instructorId);
    const allApproved = instructorDocs.every(d => d.status === 'APPROVED');
    
    if (allApproved) {
      const instructor = store.instructors.find(i => i.id === doc.instructorId);
      if (instructor && instructor.status === 'PENDING_REVIEW') {
        instructor.status = 'APPROVED';
        saveStore(store);
        adminStore.logAction('INSTRUCTOR_APPROVED', 'INSTRUCTOR', doc.instructorId, { 
          reason: 'Todos os documentos aprovados' 
        });
      }
    }
    
    adminStore.logAction('DOCUMENT_APPROVED', 'DOCUMENT', docId, { 
      instructorId: doc.instructorId,
      type: doc.type 
    });
    
    return doc;
  },

  rejectDocument(docId: string, notes: string) {
    const doc = store.documents.find(d => d.id === docId);
    if (!doc) throw new Error('Documento não encontrado');
    
    doc.status = 'REJECTED';
    doc.reviewNotes = notes;
    saveStore(store);
    
    // Se algum doc foi rejeitado, mudar status do instrutor
    const instructor = store.instructors.find(i => i.id === doc.instructorId);
    if (instructor && instructor.status === 'PENDING_REVIEW') {
      instructor.status = 'REJECTED';
      saveStore(store);
      adminStore.logAction('INSTRUCTOR_REJECTED', 'INSTRUCTOR', doc.instructorId, { 
        reason: 'Documento rejeitado',
        documentId: docId 
      });
    }
    
    adminStore.logAction('DOCUMENT_REJECTED', 'DOCUMENT', docId, { 
      instructorId: doc.instructorId,
      type: doc.type,
      notes 
    });
    
    return doc;
  },

  // Payments
  listPayments(filters?: { status?: PaymentStatus; instructorId?: string; startDate?: string; endDate?: string }) {
    let result = [...store.payments];
    
    if (filters?.status) {
      result = result.filter(p => p.status === filters.status);
    }
    
    if (filters?.instructorId) {
      result = result.filter(p => p.instructorId === filters.instructorId);
    }
    
    if (filters?.startDate) {
      result = result.filter(p => p.createdAt >= filters.startDate!);
    }
    
    if (filters?.endDate) {
      result = result.filter(p => p.createdAt <= filters.endDate!);
    }
    
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createPayment(payload: { instructorId: string; amount: number; method: PaymentMethod; status?: PaymentStatus }) {
    const payment: Payment = {
      id: generateId(),
      instructorId: payload.instructorId,
      amount: payload.amount,
      status: payload.status || 'PAID',
      method: payload.method,
      paidAt: payload.status === 'PAID' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
    };
    
    store.payments.push(payment);
    saveStore(store);
    
    adminStore.logAction('PAYMENT_CREATED', 'PAYMENT', payment.id, { 
      instructorId: payload.instructorId,
      amount: payload.amount,
      method: payload.method 
    });
    
    return payment;
  },

  // Audit
  listAudit(filters?: { action?: string; entityType?: string; startDate?: string; endDate?: string }) {
    let result = [...store.auditLogs];
    
    if (filters?.action) {
      result = result.filter(log => log.action === filters.action);
    }
    
    if (filters?.entityType) {
      result = result.filter(log => log.entityType === filters.entityType);
    }
    
    if (filters?.startDate) {
      result = result.filter(log => log.createdAt >= filters.startDate!);
    }
    
    if (filters?.endDate) {
      result = result.filter(log => log.createdAt <= filters.endDate!);
    }
    
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  logAction(action: string, entityType: string, entityId: string, meta: Record<string, any>, actorName: string = 'Admin Principal') {
    const log: AuditLog = {
      id: generateId(),
      actor: actorName,
      action,
      entityType,
      entityId,
      meta,
      createdAt: new Date().toISOString(),
    };
    
    store.auditLogs.unshift(log); // Adicionar no início
    if (store.auditLogs.length > 1000) {
      store.auditLogs = store.auditLogs.slice(0, 1000); // Limitar a 1000 logs
    }
    saveStore(store);
    
    return log;
  },

  // Instructors
  listInstructors(filters?: { status?: InstructorStatus; plan?: PlanType }) {
    let result = [...store.instructors];
    
    if (filters?.status) {
      result = result.filter(i => i.status === filters.status);
    }
    
    if (filters?.plan) {
      result = result.filter(i => i.plan === filters.plan);
    }
    
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Instructor Details
  getInstructorById(id: string): Instructor | undefined {
    return store.instructors.find(i => i.id === id);
  },

  getInstructorDocuments(instructorId: string): Document[] {
    return store.documents
      .filter(d => d.instructorId === instructorId)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  },

  getInstructorPayments(instructorId: string): Payment[] {
    return store.payments
      .filter(p => p.instructorId === instructorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getInstructorAudit(instructorId: string): AuditLog[] {
    const instructorDocs = store.documents.filter(d => d.instructorId === instructorId).map(d => d.id);
    const instructorPayments = store.payments.filter(p => p.instructorId === instructorId).map(p => p.id);
    
    return store.auditLogs
      .filter(log => 
        log.entityId === instructorId ||
        log.entityId === instructorId ||
        instructorDocs.includes(log.entityId) ||
        instructorPayments.includes(log.entityId) ||
        (log.meta?.instructorId === instructorId)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Atualizar status do instrutor baseado nos documentos
  updateInstructorStatusFromDocuments(instructorId: string) {
    const instructor = store.instructors.find(i => i.id === instructorId);
    if (!instructor) return;

    // Não atualizar se estiver bloqueado (a menos que seja explicitamente desbloqueado)
    if (instructor.status === 'BLOCKED') {
      return;
    }

    const docs = store.documents.filter(d => d.instructorId === instructorId);
    
    if (docs.length === 0) {
      instructor.status = 'PENDING_REVIEW';
      saveStore(store);
      return;
    }

    const hasRejected = docs.some(d => d.status === 'REJECTED');
    const hasPending = docs.some(d => d.status === 'PENDING');
    const allApproved = docs.every(d => d.status === 'APPROVED');
    
    const hasCNH = docs.some(d => d.type === 'CNH' && d.status === 'APPROVED');
    const hasCPF = docs.some(d => d.type === 'CPF' && d.status === 'APPROVED');

    if (hasRejected) {
      instructor.status = 'REJECTED';
    } else if (allApproved && hasCNH && hasCPF) {
      instructor.status = 'APPROVED';
    } else if (hasPending) {
      instructor.status = 'PENDING_REVIEW';
    }

    saveStore(store);
  },

  // Aprovar documento
  approveDocumentWithActor(docId: string, actorName: string = 'Admin Principal') {
    const doc = store.documents.find(d => d.id === docId);
    if (!doc) throw new Error('Documento não encontrado');
    
    doc.status = 'APPROVED';
    doc.reviewNotes = undefined;
    doc.reviewReason = undefined;
    saveStore(store);
    
    // Atualizar status do instrutor
    adminStore.updateInstructorStatusFromDocuments(doc.instructorId);
    
    adminStore.logAction('DOC_APPROVED', 'DOCUMENT', docId, { 
      instructorId: doc.instructorId,
      type: doc.type,
      actor: actorName
    }, actorName);
    
    return doc;
  },

  // Reprovar documento
  rejectDocumentWithActor(docId: string, reason: ReviewReason, notes: string, actorName: string = 'Admin Principal') {
    const doc = store.documents.find(d => d.id === docId);
    if (!doc) throw new Error('Documento não encontrado');
    
    doc.status = 'REJECTED';
    doc.reviewNotes = notes;
    doc.reviewReason = reason;
    saveStore(store);
    
    // Atualizar status do instrutor
    const instructor = store.instructors.find(i => i.id === doc.instructorId);
    if (instructor) {
      instructor.lastReviewReason = reason;
      instructor.lastReviewNotes = notes;
      adminStore.updateInstructorStatusFromDocuments(doc.instructorId);
    }
    
    adminStore.logAction('DOC_REJECTED', 'DOCUMENT', docId, { 
      instructorId: doc.instructorId,
      type: doc.type,
      reason,
      notes,
      actor: actorName
    }, actorName);
    
    return doc;
  },

  // Bloquear instrutor
  blockInstructor(instructorId: string, actorName: string = 'Admin Principal') {
    const instructor = store.instructors.find(i => i.id === instructorId);
    if (!instructor) throw new Error('Instrutor não encontrado');
    
    instructor.status = 'BLOCKED';
    saveStore(store);
    
    adminStore.logAction('INSTRUCTOR_BLOCKED', 'INSTRUCTOR', instructorId, { 
      actor: actorName
    }, actorName);
    
    return instructor;
  },

  // Desbloquear instrutor
  unblockInstructor(instructorId: string, actorName: string = 'Admin Principal') {
    const instructor = store.instructors.find(i => i.id === instructorId);
    if (!instructor) throw new Error('Instrutor não encontrado');
    
    // Recalcular status baseado nos documentos
    adminStore.updateInstructorStatusFromDocuments(instructorId);
    
    adminStore.logAction('INSTRUCTOR_UNBLOCKED', 'INSTRUCTOR', instructorId, { 
      actor: actorName
    }, actorName);
    
    return instructor;
  },

  // Atualizar plano do instrutor
  updateInstructorPlan(instructorId: string, plan: PlanType, actorName: string = 'Admin Principal') {
    const instructor = store.instructors.find(i => i.id === instructorId);
    if (!instructor) throw new Error('Instrutor não encontrado');
    
    const oldPlan = instructor.plan;
    instructor.plan = plan;
    saveStore(store);
    
    adminStore.logAction('PLAN_CHANGED', 'INSTRUCTOR', instructorId, { 
      oldPlan,
      newPlan: plan,
      actor: actorName
    }, actorName);
    
    return instructor;
  },

  // Criar pagamento com actor
  createPaymentWithActor(payload: { instructorId: string; amount: number; method: PaymentMethod; status?: PaymentStatus; paidAt?: string }, actorName: string = 'Admin Principal') {
    const payment: Payment = {
      id: generateId(),
      instructorId: payload.instructorId,
      amount: payload.amount,
      status: payload.status || 'PAID',
      method: payload.method,
      paidAt: payload.paidAt || (payload.status === 'PAID' ? new Date().toISOString() : undefined),
      createdAt: new Date().toISOString(),
    };
    
    store.payments.push(payment);
    saveStore(store);
    
    adminStore.logAction('PAYMENT_CREATED', 'PAYMENT', payment.id, { 
      instructorId: payload.instructorId,
      amount: payload.amount,
      method: payload.method,
      status: payment.status,
      actor: actorName
    }, actorName);
    
    return payment;
  },

  // Helpers
  getInstructor(instructorId: string): Instructor | undefined {
    return store.instructors.find(i => i.id === instructorId);
  },

  getUser(userId: string): User | undefined {
    return store.users.find(u => u.id === userId);
  },

  // Reset (útil para desenvolvimento)
  reset() {
    localStorage.removeItem(STORAGE_KEY);
    store = seedData();
    saveStore(store);
  },
};
