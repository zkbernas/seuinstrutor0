# 🚀 Guia de Instalação - Painel Admin

## ⚠️ IMPORTANTE
Este é um **sistema separado** do frontend principal. Ele roda em **outra porta (3001)** e tem seu **próprio banco de dados**.

## 📋 Pré-requisitos
- Node.js 20+
- PostgreSQL rodando
- npm ou yarn

## 🔧 Passo a Passo

### 1. Entre na pasta admin
```bash
cd admin
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados

Crie um arquivo `.env` na pasta `admin/`:

```env
DATABASE_URL="postgresql://postgres:Vi300704!@localhost:5432/seuinstrutor_admin?schema=public"
JWT_SECRET="super-secret-change-in-production-ADMIN-2026"
UPLOAD_DIR="./uploads"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

**⚠️ Atenção:** Use um banco diferente do frontend (ex: `seuinstrutor_admin` em vez de `SeuInstrutor_db`)

### 4. Rode as migrações do Prisma
```bash
npx prisma migrate dev --name init
```

### 5. Gere o Prisma Client
```bash
npx prisma generate
```

### 6. Popule o banco com dados iniciais
```bash
npm run prisma:seed
```

Isso vai criar:
- 1 admin (admin@local.dev / Admin#12345)
- 1 operator (operator@local.dev / Operator#123)
- 3 planos (Starter, Pro, Scale)
- 5 instrutores fake
- Documentos pendentes
- Pagamentos de exemplo

### 7. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

### 8. Acesse o painel
Abra seu navegador em: **http://localhost:3001**

## 🔐 Login

Use estas credenciais para entrar:

**Admin (acesso total):**
- Email: `admin@local.dev`
- Senha: `Admin#12345`

**Operator (acesso limitado):**
- Email: `operator@local.dev`
- Senha: `Operator#123`

## ✅ Checklist de Verificação

- [ ] Node.js instalado
- [ ] PostgreSQL rodando
- [ ] Arquivo `.env` criado com DATABASE_URL correto
- [ ] `npm install` executado sem erros
- [ ] Migrações rodadas (`npx prisma migrate dev`)
- [ ] Seed executado (`npm run prisma:seed`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Página abre em http://localhost:3001
- [ ] Login funciona

## 🐛 Problemas Comuns

### Erro: "Can't reach database server"
- Verifique se o PostgreSQL está rodando
- Confirme a `DATABASE_URL` no `.env`
- Teste a conexão: `npx prisma db push`

### Erro: "Prisma Client not generated"
```bash
npx prisma generate
```

### Porta 3001 já em uso
Mate o processo ou mude a porta em `package.json`:
```json
"dev": "next dev -p 3002"
```

### Erro de autenticação
- Limpe os cookies do navegador
- Verifique se o `JWT_SECRET` está no `.env`

## 📁 Estrutura do Projeto

```
admin/
├── prisma/
│   ├── schema.prisma    # Modelo de dados
│   └── seed.ts          # Dados iniciais
├── src/
│   ├── app/
│   │   ├── admin/       # Páginas protegidas
│   │   ├── api/         # Backend (Next API Routes)
│   │   └── login/       # Página de login
│   ├── lib/             # Utils (auth, prisma)
│   └── middleware.ts    # Proteção de rotas
├── .env                 # Configurações (criar)
└── package.json
```

## 🎯 Próximos Passos

Após rodar o sistema, você verá:

1. **Dashboard** com KPIs
2. **Menu lateral** com:
   - Dashboard
   - Verificação (review docs)
   - Instrutores
   - Planos (só ADMIN)
   - Pagamentos
   - Relatórios
   - Auditoria (só ADMIN)

## 🔄 Comandos Úteis

```bash
# Ver banco de dados visual
npm run prisma:studio

# Resetar banco
npx prisma migrate reset

# Build para produção
npm run build
npm start
```

## 💡 Dica

Para testar o controle de acesso:
1. Faça login como `operator@local.dev`
2. Tente acessar `/admin/plans` ou `/admin/audit`
3. Você será redirecionado (sem permissão)

---

**Pronto!** Seu painel admin está rodando em http://localhost:3001 🎉
