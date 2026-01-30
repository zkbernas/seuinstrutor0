# 📧 Módulo de Email - Resend

Este módulo integra o [Resend](https://resend.com) ao backend para envio de emails transacionais.

## 🚀 Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis ao arquivo `.env` do backend:

```env
# Resend Email Configuration
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="seu-dominio@resend.dev"

# Frontend URL (para links em emails)
FRONTEND_URL="http://localhost:5173"
```

### 2. Obter API Key do Resend

1. Acesse [resend.com](https://resend.com) e crie uma conta
2. Vá para **API Keys** no dashboard
3. Clique em **Create API Key**
4. Copie a chave e adicione ao `.env` como `RESEND_API_KEY`

### 3. Configurar Email de Envio

- Para **desenvolvimento/testes**, use: `onboarding@resend.dev`
- Para **produção**, configure seu próprio domínio:
  1. Adicione seu domínio no dashboard do Resend
  2. Configure os registros DNS (MX, TXT, DKIM)
  3. Use um email do seu domínio (ex: `noreply@seudominio.com`)

## 📝 Uso

### Injetar o Serviço

```typescript
import { EmailService } from './email/email.service';

@Injectable()
export class SeuService {
  constructor(private emailService: EmailService) {}
}
```

### Exemplos de Uso

#### 1. Email Genérico

```typescript
await this.emailService.sendEmail({
  to: 'usuario@example.com',
  subject: 'Assunto do Email',
  html: '<p>Conteúdo em <strong>HTML</strong></p>',
});
```

#### 2. Email de Boas-vindas

```typescript
await this.emailService.sendWelcomeEmail(
  'usuario@example.com',
  'Nome do Usuário'
);
```

#### 3. Email de Verificação

```typescript
await this.emailService.sendVerificationEmail(
  'usuario@example.com',
  'token-de-verificacao-123'
);
```

#### 4. Email de Redefinição de Senha

```typescript
await this.emailService.sendPasswordResetEmail(
  'usuario@example.com',
  'token-de-reset-123'
);
```

#### 5. Notificação de Aula Agendada

```typescript
await this.emailService.sendLessonScheduledEmail(
  'usuario@example.com',
  {
    studentName: 'João Silva',
    instructorName: 'Maria Santos',
    date: '15/02/2026',
    time: '14:00',
    duration: 60,
  }
);
```

## 🧪 Testando

### Via API

Você pode testar os emails usando os endpoints criados:

#### 1. Email de Boas-vindas

```bash
POST http://localhost:3000/email/test-welcome
Content-Type: application/json

{
  "email": "berproenccaa@gmail.com",
  "name": "Seu Nome"
}
```

#### 2. Email de Verificação

```bash
POST http://localhost:3000/email/test-verification
Content-Type: application/json

{
  "email": "berproenccaa@gmail.com",
  "token": "test-token-123"
}
```

#### 3. Email de Redefinição de Senha

```bash
POST http://localhost:3000/email/test-reset-password
Content-Type: application/json

{
  "email": "berproenccaa@gmail.com",
  "token": "reset-token-123"
}
```

#### 4. Notificação de Aula

```bash
POST http://localhost:3000/email/test-lesson
Content-Type: application/json

{
  "email": "berproenccaa@gmail.com",
  "lessonDetails": {
    "studentName": "João Silva",
    "instructorName": "Maria Santos",
    "date": "15/02/2026",
    "time": "14:00",
    "duration": 60
  }
}
```

### Com cURL

```bash
curl -X POST http://localhost:3000/email/test-welcome \
  -H "Content-Type: application/json" \
  -d '{"email":"berproenccaa@gmail.com","name":"Seu Nome"}'
```

## 🔧 Integração com Outros Módulos

### Exemplo: Enviar email ao criar usuário

```typescript
// src/auth/auth.service.ts
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService, // Injetar o serviço
  ) {}

  async register(dto: RegisterDto) {
    // Criar usuário
    const user = await this.prisma.user.create({
      data: { ...dto },
    });

    // Enviar email de boas-vindas
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    return user;
  }
}
```

### Exemplo: Email ao agendar aula

```typescript
// src/lessons/lessons.service.ts
import { EmailService } from '../email/email.service';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    // Criar aula
    const lesson = await this.prisma.lesson.create({
      data: createLessonDto,
      include: {
        student: true,
        instructor: true,
      },
    });

    // Enviar notificação para o aluno
    await this.emailService.sendLessonScheduledEmail(
      lesson.student.email,
      {
        studentName: lesson.student.name,
        instructorName: lesson.instructor.name,
        date: lesson.date.toLocaleDateString('pt-BR'),
        time: lesson.time,
        duration: lesson.duration,
      }
    );

    // Enviar notificação para o instrutor
    await this.emailService.sendLessonScheduledEmail(
      lesson.instructor.email,
      {
        studentName: lesson.student.name,
        instructorName: lesson.instructor.name,
        date: lesson.date.toLocaleDateString('pt-BR'),
        time: lesson.time,
        duration: lesson.duration,
      }
    );

    return lesson;
  }
}
```

## 📚 Recursos Adicionais

- [Documentação Resend](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference/emails/send-email)
- [Dashboard Resend](https://resend.com/overview)

## ⚠️ Notas Importantes

1. **Rate Limits**: A versão gratuita do Resend tem limite de 100 emails/dia
2. **Domínio Verificado**: Para uso em produção, configure um domínio verificado
3. **Template de Emails**: Considere usar um sistema de templates (como React Email) para emails mais complexos
4. **Logging**: Todos os emails enviados são logados no console para debug
5. **Tratamento de Erros**: O serviço lança exceções em caso de falha no envio

