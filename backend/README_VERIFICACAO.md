# 🔐 Sistema de Verificação de Instrutores

Este documento explica o fluxo de cadastro e verificação de instrutores implementado no sistema.

## 📋 Visão Geral

- **Todo usuário começa como STUDENT** ao se registrar
- Para virar **INSTRUCTOR**, o usuário precisa **solicitar verificação**
- O **Admin** aprova ou reprova a solicitação
- O **role** do usuário só muda para `INSTRUCTOR` após aprovação

## 🗄️ Schema do Banco de Dados

### Alterações no Prisma Schema

1. **Enum `VerificationStatus`** adicionado:
   - `NOT_SUBMITTED` - Ainda não solicitou verificação
   - `PENDING` - Aguardando análise do admin
   - `APPROVED` - Aprovado pelo admin
   - `REJECTED` - Reprovado pelo admin

2. **Campos adicionados no model `Instructor`**:
   - `verificationStatus` (enum, default: `NOT_SUBMITTED`)
   - `rejectionReason` (string opcional)
   - `rejectionNotes` (string opcional)
   - `credentialNumber` (corrigido de `credenicalNumber`)

3. **Relacionamentos com `onDelete: Cascade`**:
   - `Instructor.user` → `User` (cascade)
   - `Student.user` → `User` (cascade)

## 🚀 Setup e Migração

### 1. Instalar dependências

```bash
cd backend
npm install
npm install -D ts-node
```

### 2. Criar e executar migration

```bash
# Gerar migration
npx prisma migrate dev --name add_instructor_verification_status

# Ou usar o script
npm run prisma:migrate
```

### 3. Popular banco com seed

```bash
# Executar seed
npx prisma db seed

# Ou usar o script
npm run prisma:seed
```

## 📡 Endpoints da API

### Autenticação

#### `POST /auth/register`
Registra um novo usuário como **STUDENT**.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "cpf": "12345678901",
  "phone": "(11) 98765-4321"
}
```

**Resposta:**
```json
{
  "access_token": "jwt_token...",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "STUDENT"
  }
}
```

**Regras:**
- Cria sempre `User` com `role=STUDENT`
- Cria automaticamente `StudentProfile`
- Retorna JWT token para login automático

---

#### `POST /auth/login`
Faz login no sistema.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "jwt_token...",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "STUDENT"
  }
}
```

**Regras de bloqueio:**
- Se `role=INSTRUCTOR` e `verificationStatus=PENDING` → **403 Forbidden**: "Conta em análise. Aguarde a aprovação dos administradores."
- Se `role=INSTRUCTOR` e `verificationStatus=REJECTED` → **403 Forbidden**: "Reprovado: {reason}. Reenvie os documentos para nova análise."
- Se `role=INSTRUCTOR` e `verificationStatus!=APPROVED` → **403 Forbidden**: "Conta não verificada. Complete a verificação para acessar."

---

#### `GET /auth/me`
Retorna dados do usuário logado (requer autenticação).

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Resposta:**
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@email.com",
  "role": "STUDENT",
  "studentProfile": { ... },
  "instructorProfile": null
}
```

---

### Solicitação de Verificação

#### `POST /instructors/request-verification`
Solicita verificação para virar instrutor (requer autenticação).

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Body:**
```json
{
  "cpf": "12345678901",
  "credentialNumber": "CRED-12345",
  "phone": "(11) 98765-4321",
  "pricePerHour": 80.00,
  "categories": ["A", "B"],
  "bio": "Instrutor experiente...",
  "address": "Rua das Flores, 123",
  "latitude": -23.5505,
  "longitude": -46.6333
}
```

**Resposta:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "cpf": "12345678901",
  "credentialNumber": "CRED-12345",
  "verificationStatus": "PENDING",
  "user": { ... }
}
```

**Regras:**
- Usuário deve ser `STUDENT` (ou não `ADMIN`)
- Se `instructorProfile` não existe → **cria** com `status=PENDING`
- Se `instructorProfile` já existe → **atualiza** e seta `status=PENDING`
- Limpa `rejectionReason` e `rejectionNotes` ao reenviar
- Valida se CPF não está em uso por outro instrutor

---

### Admin - Aprovação/Reprovação

#### `POST /admin/instructors/:userId/approve`
Aprova um instrutor (requer role `ADMIN`).

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Resposta:**
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@email.com",
  "role": "INSTRUCTOR",
  "instructorProfile": {
    "verificationStatus": "APPROVED",
    ...
  }
}
```

**Regras:**
- Atualiza `Instructor.verificationStatus = APPROVED`
- Atualiza `User.role = INSTRUCTOR`
- Limpa `rejectionReason` e `rejectionNotes`

---

#### `POST /admin/instructors/:userId/reject`
Reprova um instrutor (requer role `ADMIN`).

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Body:**
```json
{
  "reason": "Documentos ilegíveis",
  "notes": "A CNH enviada está ilegível. Por favor, reenvie uma cópia de melhor qualidade."
}
```

**Resposta:**
```json
{
  "id": "uuid",
  "verificationStatus": "REJECTED",
  "rejectionReason": "Documentos ilegíveis",
  "rejectionNotes": "A CNH enviada está ilegível...",
  "user": { ... }
}
```

**Regras:**
- Atualiza `Instructor.verificationStatus = REJECTED`
- Salva `rejectionReason` e `rejectionNotes`
- `User.role` continua `STUDENT`

---

#### `GET /admin/instructors/pending`
Lista instrutores pendentes (requer role `ADMIN`).

**Resposta:**
```json
[
  {
    "id": "uuid",
    "verificationStatus": "PENDING",
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@email.com",
      "role": "STUDENT"
    }
  }
]
```

---

#### `GET /admin/instructors/rejected`
Lista instrutores reprovados (requer role `ADMIN`).

---

## 🧪 Testando no Prisma Studio

### 1. Abrir Prisma Studio

```bash
npx prisma studio
```

### 2. Verificar relacionamentos

1. **Tabela `users`**:
   - Verifique que todos os usuários têm `role` correto
   - `STUDENT` → deve ter `studentProfile`
   - `INSTRUCTOR` → deve ter `instructorProfile` com `verificationStatus=APPROVED`

2. **Tabela `instructors`**:
   - Verifique `verificationStatus` (NOT_SUBMITTED, PENDING, APPROVED, REJECTED)
   - Verifique `userId` (deve existir e não ser null)
   - Verifique `rejectionReason` e `rejectionNotes` para REJECTED

3. **Tabela `students`**:
   - Verifique `userId` (deve existir e não ser null)

### 3. Testar cascade delete

1. Delete um `User` no Prisma Studio
2. Verifique que `Student` e `Instructor` relacionados foram deletados automaticamente

## 📊 Dados de Teste (Seed)

O seed cria:

- **1 ADMIN**: `admin@local.dev` / `Admin#12345`
- **2 STUDENTS**: sem solicitação de verificação
- **2 INSTRUCTORS APPROVED**: `role=INSTRUCTOR` + `verificationStatus=APPROVED`
- **2 PENDING**: `role=STUDENT` + `instructorProfile` com `verificationStatus=PENDING`
- **1 REJECTED**: `role=STUDENT` + `instructorProfile` com `verificationStatus=REJECTED`

### Credenciais de Teste

```
ADMIN: admin@local.dev / Admin#12345
STUDENT 1: student1@email.com / student123
STUDENT 2: student2@email.com / student123
INSTRUCTOR 1 (APPROVED): instructor1@email.com / instructor123
INSTRUCTOR 2 (APPROVED): instructor2@email.com / instructor123
PENDING 1: pending1@email.com / pending123
PENDING 2: pending2@email.com / pending123
REJECTED: rejected@email.com / rejected123
```

## ✅ Critérios de Aceite

- [x] `/auth/register` cria registro em `users` e `students`
- [x] `/instructors/request-verification` cria/atualiza `instructors` com `status=PENDING`
- [x] Admin approve muda `role` para `INSTRUCTOR` e `status` para `APPROVED`
- [x] Login bloqueia instrutor pendente/rejeitado e retorna mensagem correta
- [x] Prisma Studio mostra relacionamento correto sem registros órfãos
- [x] `onDelete: Cascade` funciona corretamente

## 🔧 Comandos Úteis

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar migration
npm run prisma:migrate

# Executar seed
npm run prisma:seed

# Abrir Prisma Studio
npx prisma studio

# Resetar banco (CUIDADO: apaga tudo)
npx prisma migrate reset
```

## 📝 Notas Importantes

1. **Nunca criar `Instructor` sem `User`**: Sempre criar `User` primeiro, depois `Instructor` com `userId`.

2. **Role só muda após aprovação**: O `role` do `User` só muda de `STUDENT` para `INSTRUCTOR` quando o admin aprova.

3. **Login bloqueia PENDING/REJECTED**: Instrutores com `verificationStatus` diferente de `APPROVED` não conseguem fazer login.

4. **Reenvio limpa rejeição**: Ao reenviar solicitação, os campos `rejectionReason` e `rejectionNotes` são limpos.

5. **Cascade Delete**: Ao deletar um `User`, os perfis `Student` e `Instructor` relacionados são deletados automaticamente.
