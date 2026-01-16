# 🎯 SeuInstrutor - Painel Admin

Sistema administrativo completo para gerenciar instrutores, documentos, planos e pagamentos.

## 🚀 Setup Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Configurar banco de dados
cp .env.example .env
# Edite .env com suas credenciais PostgreSQL

# 3. Rodar migrações
npx prisma migrate dev

# 4. Gerar Prisma Client
npx prisma generate

# 5. Popular banco com dados iniciais
npm run prisma:seed

# 6. Iniciar servidor
npm run dev
```

Acesse: **http://localhost:3001**

## 🔐 Credenciais Padrão (Seed)

- **Email:** admin@local.dev
- **Senha:** Admin#12345

## 📁 Estrutura do Projeto

```
admin/
├── prisma/
│   ├── schema.prisma      # Modelo de dados
│   └── seed.ts            # Dados iniciais
├── src/
│   ├── app/
│   │   ├── api/           # API Routes (Backend)
│   │   ├── admin/         # Páginas Admin (protegidas)
│   │   └── login/         # Página de login
│   ├── components/        # Componentes React
│   ├── lib/              # Utilit

ários (auth, prisma, etc)
│   └── middleware.ts      # Proteção de rotas
└── uploads/              # Arquivos enviados
```

## 🎯 Funcionalidades

### Autenticação
- ✅ Login com JWT
- ✅ Sessões seguras (cookies httpOnly)
- ✅ Proteção de rotas via middleware
- ✅ Controle de acesso por role (ADMIN/OPERATOR)

### Gestão de Instrutores
- ✅ Listar com filtros (status, plano, busca)
- ✅ Criar/editar instrutores
- ✅ Bloquear/desbloquear
- ✅ Aprovar/reprovar documentos
- ✅ Histórico de ações (audit log)

### Documentos
- ✅ Upload de arquivos (CNH, CPF, etc)
- ✅ Revisão e aprovação
- ✅ Rejeição com motivo
- ✅ Download protegido

### Planos
- ✅ CRUD completo
- ✅ Ativar/desativar
- ✅ Recursos configuráveis (JSON)
- ✅ Restrito a ADMIN

### Financeiro
- ✅ Registro de pagamentos
- ✅ Assinaturas por plano
- ✅ Dashboard com KPIs
- ✅ MRR e inadimplência
- ✅ Relatórios

### Auditoria
- ✅ Log de todas as ações
- ✅ Rastreabilidade completa
- ✅ Filtros por admin/entidade/ação
- ✅ Restrito a ADMIN

## 🔒 Controle de Acesso

### ADMIN (acesso total)
- Todas as funcionalidades
- Gerenciar planos
- Ver auditoria
- Criar outros admins

### OPERATOR (operacional)
- Revisar documentos
- Gerenciar instrutores
- Registrar pagamentos
- Ver relatórios
- ❌ Não acessa: planos, auditoria

## 📊 KPIs Dashboard

- Total de instrutores
- Aprovados / Pendentes / Reprovados
- MRR (Monthly Recurring Revenue)
- Taxa de inadimplência
- Crescimento mês a mês
- Receita por plano

## 🛠️ Stack Técnica

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL + Prisma
- **Auth:** JWT (jose) + bcrypt
- **Validação:** Zod
- **Charts:** Recharts
- **Upload:** Local storage (./uploads)

## 📝 Scripts Disponíveis

```bash
npm run dev              # Inicia servidor dev (porta 3001)
npm run build            # Build para produção
npm run start            # Inicia produção
npm run prisma:migrate   # Roda migrações
npm run prisma:seed      # Popula banco
npm run prisma:studio    # Interface visual do banco
```

## 🌐 Rotas da API

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dados do usuário logado

### Instructors
- `GET /api/instructors` - Listar (filtros: status, planId, q, page)
- `POST /api/instructors` - Criar
- `GET /api/instructors/:id` - Detalhes
- `PATCH /api/instructors/:id` - Editar
- `POST /api/instructors/:id/block` - Bloquear
- `POST /api/instructors/:id/unblock` - Desbloquear

### Documents
- `POST /api/instructors/:id/documents` - Upload
- `GET /api/instructors/:id/documents` - Listar
- `POST /api/documents/:id/approve` - Aprovar
- `POST /api/documents/:id/reject` - Reprovar

### Plans
- `GET /api/plans` - Listar
- `POST /api/plans` - Criar (ADMIN)
- `PATCH /api/plans/:id` - Editar (ADMIN)
- `POST /api/plans/:id/toggle` - Ativar/desativar (ADMIN)

### Payments
- `GET /api/payments` - Listar
- `POST /api/payments` - Registrar

### Reports
- `GET /api/reports/overview` - KPIs
- `GET /api/reports/revenue-by-plan` - Receita por plano
- `GET /api/reports/revenue-by-month` - Receita mensal

### Export
- `GET /api/export/instructors.csv` - Exportar instrutores
- `GET /api/export/payments.csv` - Exportar pagamentos

## 🔐 Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"

# JWT
JWT_SECRET="seu-secret-super-seguro"

# Upload
UPLOAD_DIR="./uploads"
```

## 📦 Deploy

### Vercel/Netlify
1. Configure variáveis de ambiente
2. Configure PostgreSQL (Neon, Supabase, etc)
3. Push para Git
4. Deploy automático

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Erro de conexão com banco
- Verifique `DATABASE_URL` no `.env`
- Certifique-se que PostgreSQL está rodando
- Rode `npx prisma migrate dev`

### Upload não funciona
- Crie pasta `./uploads` manualmente
- Verifique permissões de escrita
- Limite de upload: 10MB (configurável em `next.config.js`)

### JWT inválido
- Limpe cookies do navegador
- Verifique `JWT_SECRET` no `.env`
- Faça logout e login novamente

## 📄 Licença

Proprietário - SeuInstrutor © 2026
