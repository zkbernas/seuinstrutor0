# 🗄️ Configurar Banco de Dados

## ⚠️ Erro Atual

```
PrismaClientInitializationError: Authentication failed against database server
```

**Causa**: O PostgreSQL não está configurado ou não está rodando.

---

## ✅ Solução Rápida: Banco em Nuvem (Gratuito)

### 🌐 Opção 1: Supabase (Recomendado)

**Tempo: 5 minutos**

1. Acesse: **https://supabase.com**
2. Clique em **"Start your project"**
3. Crie conta (pode usar GitHub)
4. Clique em **"New Project"**
5. Preencha:
   - **Name**: seuinstrutor
   - **Database Password**: crie uma senha forte
   - **Region**: escolha o mais próximo
6. Aguarde ~2 minutos (criação do banco)
7. Vá em **Settings** → **Database**
8. Copie a **Connection String** (URI)
9. Cole no arquivo `.env`:

```env
DATABASE_URL="postgresql://postgres.xxxxx:sua-senha@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

10. Salve e reinicie o servidor:

```bash
npm run start:dev
```

---

### 🐘 Opção 2: Neon.tech (Alternativa)

**Tempo: 3 minutos**

1. Acesse: **https://neon.tech**
2. Clique em **"Sign up"**
3. Crie conta (pode usar GitHub)
4. Clique em **"Create a project"**
5. Dê um nome: **seuinstrutor**
6. Escolha a região
7. Copie a **Connection String**
8. Cole no `.env`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb"
```

9. Salve e reinicie:

```bash
npm run start:dev
```

---

### 🖥️ Opção 3: PostgreSQL Local

**Para quem já tem PostgreSQL instalado**

#### 3.1 - Verificar se PostgreSQL está rodando

**Windows:**
```powershell
# Verificar status
Get-Service postgresql*

# Iniciar se estiver parado
Start-Service postgresql-x64-XX
```

**Linux/Mac:**
```bash
# Verificar status
sudo systemctl status postgresql

# Iniciar
sudo systemctl start postgresql
```

#### 3.2 - Criar banco de dados

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco
CREATE DATABASE seuinstrutor;

# Sair
\q
```

#### 3.3 - Configurar .env

```env
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/seuinstrutor"
```

**Troque `sua_senha` pela senha do seu PostgreSQL**

#### 3.4 - Rodar migrations

```bash
npx prisma migrate dev
```

---

## 🧪 Testar APENAS o Email (sem banco)

Se você quer testar o módulo de email **SEM configurar o banco agora**:

**Modifiquei o código** para não quebrar se o banco não conectar. Agora você verá apenas um **aviso** (⚠️) mas o servidor vai iniciar.

**Reinicie o servidor:**

```bash
npm run start:dev
```

**Você verá:**
```
⚠️ Não foi possível conectar ao banco de dados. Alguns recursos podem não funcionar.
💡 Para testar apenas o email, ignore este aviso.
```

**Isso é normal!** O módulo de email vai funcionar mesmo assim.

**Teste o email:**

```powershell
.\testar-email.ps1
```

---

## 📋 Checklist

- [ ] Escolher uma opção de banco (Supabase, Neon ou Local)
- [ ] Obter a connection string
- [ ] Adicionar no arquivo `.env`
- [ ] Reiniciar o servidor
- [ ] (Se local) Rodar migrations: `npx prisma migrate dev`
- [ ] Testar conexão

---

## 🆘 Ainda com Problemas?

### Erro: "connection refused"

- ✅ PostgreSQL não está rodando
- ✅ Porta 5432 está bloqueada
- **Solução**: Use Supabase ou Neon (mais fácil)

### Erro: "authentication failed"

- ✅ Senha incorreta
- ✅ Usuário incorreto
- **Solução**: Verifique credenciais na connection string

### Erro: "database does not exist"

- ✅ Banco não foi criado
- **Solução**: 
  - Se local: `CREATE DATABASE seuinstrutor;`
  - Se Supabase/Neon: já vem criado

---

## 💡 Recomendação

**Para desenvolvimento**: Use **Supabase** (gratuito, rápido, sem instalação)

**Para produção**: Configure PostgreSQL dedicado ou continue com Supabase

---

## ✅ Após Configurar

Quando o banco estiver funcionando, você verá:

```
✅ Conectado ao banco de dados
[NestJS] Application is running on: http://localhost:3000
```

Aí pode testar tudo! 🚀

---

## 📧 Email Funciona Independente

**IMPORTANTE**: O módulo de email funciona **mesmo sem banco de dados**!

Se você só quer testar o email agora:
1. ✅ Ignore o aviso do banco
2. ✅ Execute `.\testar-email.ps1`
3. ✅ Verifique seu email!

Configure o banco depois quando precisar dos outros recursos.

