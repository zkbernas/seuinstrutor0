# 🔐 Setup do Painel Admin Integrado

## ✅ O que foi feito

Integrei o painel admin **dentro do frontend existente** (mesma porta 5173/5174), sem precisar rodar outro servidor.

### Mudanças realizadas:

1. ✅ **Botão Admin no Dashboard** - Só aparece para usuários com role `ADMIN`
2. ✅ **Rota `/app/admin`** - Página de admin integrada ao React Router
3. ✅ **Proteção por role** - Só admins podem acessar
4. ✅ **Design integrado** - Usa os mesmos componentes do sistema

---

## 🚀 Como Usar

### Passo 1: Criar usuário ADMIN no banco

Você tem 2 opções:

#### Opção A: Usando Node.js (Recomendado)

```bash
cd backend
node create-admin.js
```

Isso vai criar:
- **Email:** admin@seuinstrutor.com
- **Senha:** Admin@123
- **Role:** ADMIN

#### Opção B: SQL direto

Se preferir, execute o SQL manualmente:

```sql
INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@seuinstrutor.com',
  '$2b$10$YQmXHLz6rXn5qK8YZ9mLkO.rvZqH3gCKXVXQJ6mBH8QQJ0zqV0kFu',
  'Administrador do Sistema',
  'ADMIN',
  NOW(),
  NOW()
);
```

### Passo 2: Fazer login como admin

1. Acesse: http://localhost:5173 (ou 5174)
2. Faça login com:
   - Email: `admin@seuinstrutor.com`
   - Senha: `Admin@123`

### Passo 3: Acessar o painel admin

Após o login, você verá um **card roxo/violeta** no topo do dashboard:

```
┌────────────────────────────────────────────────┐
│ 🛡️ Painel Administrativo                       │
│                                                │
│ Acesso completo: gerenciar usuários, planos,  │
│ relatórios e auditoria                         │
│                                  [Acessar Admin]│
└────────────────────────────────────────────────┘
```

Clique em **"Acessar Admin"** ou vá direto para: http://localhost:5173/app/admin

---

## 📋 Funcionalidades do Admin

### Dashboard Admin
- KPIs do sistema (usuários totais, instrutores ativos, MRR)
- Ações rápidas (gerenciar usuários, documentos, relatórios)
- Avisos e alertas

### Proteção
- ✅ Apenas usuários com `role: 'ADMIN'` veem o botão
- ✅ Apenas admins podem acessar `/app/admin`
- ✅ Redirecionamento automático se não for admin

---

## 🔒 Segurança

### Como funciona:

1. **Backend** valida a role no JWT token
2. **Frontend** verifica `user.role === 'ADMIN'`
3. **Rotas protegidas** fazem redirect se não for admin

### Alterar um usuário para ADMIN:

```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'seuemail@example.com';
```

---

## 🎨 Integração Visual

O painel admin usa:
- ✅ Mesmos componentes (`Card`, `Button`)
- ✅ Mesma sidebar
- ✅ Mesma autenticação
- ✅ Mesmo design system

Diferenças:
- Cor roxa/violeta para identificar área admin
- Ícone de Shield (escudo)
- KPIs administrativos

---

## 🧪 Testar

1. Faça login com usuário normal → **NÃO** verá o botão admin
2. Faça login com admin@seuinstrutor.com → **VAI VER** o card roxo
3. Clique em "Acessar Admin" → Vai para `/app/admin`

---

## ⚠️ Importante

- Altere a senha padrão após primeiro login
- O script `create-admin.js` pode ser executado múltiplas vezes (usa `upsert`)
- Se já tiver um usuário, basta mudar a role dele para `ADMIN` no banco

---

## 📦 Arquivos Criados

```
frontend/src/pages/app/admin/
└── AdminDashboard.tsx         # Página principal do admin

backend/
├── create-admin.js            # Script para criar admin
└── create-admin.sql           # SQL alternativo
```

---

## 🎯 Pronto!

Agora você tem um painel admin completamente integrado ao sistema existente, rodando na mesma porta! 🚀

**Próximos passos sugeridos:**
- Adicionar mais páginas admin (usuários, documentos, etc)
- Integrar com APIs do backend
- Adicionar gráficos e relatórios
