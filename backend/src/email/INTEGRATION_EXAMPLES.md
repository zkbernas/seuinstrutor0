# 📝 Exemplos de Integração do EmailService

Este arquivo contém exemplos práticos de como integrar o `EmailService` em diferentes módulos do sistema.

## 1️⃣ Integração com AuthModule (Registro de Usuário)

### Passo 1: Adicionar EmailModule nas importações

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailModule } from '../email/email.module'; // ✅ Adicionar

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    EmailModule, // ✅ Adicionar
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'SEU_INSTRUTOR_JWT_SECRET_KEY_2024_SUPER_SECURE',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

### Passo 2: Injetar EmailService no AuthService

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service'; // ✅ Adicionar
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService, // ✅ Adicionar
  ) {}

  async register(dto: RegisterDto) {
    // Verificar se email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Este e-mail já está cadastrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Criar User
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          role: 'STUDENT',
          studentProfile: {
            create: {
              cpf: dto.cpf,
              phone: dto.phone,
            },
          },
        },
        include: {
          studentProfile: true,
        },
      });

      // ✅ NOVO: Enviar email de boas-vindas
      try {
        await this.emailService.sendWelcomeEmail(user.email, user.name);
      } catch (error) {
        console.error('Erro ao enviar email de boas-vindas:', error);
        // Não lançar erro - o cadastro já foi feito com sucesso
      }

      const access_token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      return { user, access_token };
    });

    const { password, ...userWithoutPassword } = result.user;
    return {
      user: userWithoutPassword,
      access_token: result.access_token,
    };
  }
}
```

---

## 2️⃣ Integração com LessonsModule (Agendamento de Aula)

### Passo 1: Adicionar EmailModule

```typescript
// src/lessons/lessons.module.ts
import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module'; // ✅ Adicionar

@Module({
  imports: [PrismaModule, EmailModule], // ✅ Adicionar EmailModule
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
```

### Passo 2: Usar no LessonsService

```typescript
// src/lessons/lessons.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service'; // ✅ Adicionar
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService, // ✅ Adicionar
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    // Criar aula
    const lesson = await this.prisma.lesson.create({
      data: createLessonDto,
      include: {
        student: {
          include: {
            user: true,
          },
        },
        instructor: {
          include: {
            user: true,
          },
        },
      },
    });

    // ✅ NOVO: Preparar dados para o email
    const lessonDetails = {
      studentName: lesson.student.user.name,
      instructorName: lesson.instructor.user.name,
      date: new Date(lesson.scheduledAt).toLocaleDateString('pt-BR'),
      time: new Date(lesson.scheduledAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      duration: lesson.duration,
    };

    // ✅ NOVO: Enviar email para o aluno
    try {
      await this.emailService.sendLessonScheduledEmail(
        lesson.student.user.email,
        lessonDetails,
      );
    } catch (error) {
      console.error('Erro ao enviar email para o aluno:', error);
    }

    // ✅ NOVO: Enviar email para o instrutor
    try {
      await this.emailService.sendLessonScheduledEmail(
        lesson.instructor.user.email,
        lessonDetails,
      );
    } catch (error) {
      console.error('Erro ao enviar email para o instrutor:', error);
    }

    return lesson;
  }
}
```

---

## 3️⃣ Criar Funcionalidade de Reset de Senha

### Adicionar endpoint no AuthController

```typescript
// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ✅ NOVO: Endpoint para solicitar reset de senha
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.requestPasswordReset(body.email);
  }

  // ✅ NOVO: Endpoint para confirmar reset de senha
  @Post('reset-password')
  async resetPassword(
    @Body() body: { token: string; newPassword: string },
  ) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
```

### Implementar no AuthService

```typescript
// src/auth/auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  // ... outros métodos

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Por segurança, não revelar se o email existe ou não
      return { message: 'Se o email existir, você receberá um link de reset' };
    }

    // Gerar token de reset
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no banco (você precisará adicionar estes campos no schema)
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // ✅ Enviar email com o token
    try {
      await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      console.error('Erro ao enviar email de reset:', error);
      throw new BadRequestException('Erro ao enviar email de recuperação');
    }

    return { message: 'Email de recuperação enviado com sucesso' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token ainda não expirou
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Atualizar senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Senha alterada com sucesso' };
  }
}
```

### Schema Prisma (adicionar campos)

```prisma
// prisma/schema.prisma
model User {
  id               String    @id @default(uuid())
  email            String    @unique
  password         String
  name             String
  role             UserRole  @default(STUDENT)
  
  // ✅ NOVO: Campos para reset de senha
  resetToken       String?
  resetTokenExpiry DateTime?
  
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  
  // ... outros campos
}
```

---

## 4️⃣ Notificação de Verificação de Instrutor

### Implementar no AdminService

```typescript
// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async verifyInstructor(instructorId: string, approved: boolean) {
    const instructor = await this.prisma.instructor.update({
      where: { id: instructorId },
      data: {
        verificationStatus: approved ? 'APPROVED' : 'REJECTED',
      },
      include: {
        user: true,
      },
    });

    // ✅ Enviar email de notificação
    const subject = approved
      ? 'Conta de Instrutor Aprovada! 🎉'
      : 'Atualização sobre sua Conta de Instrutor';

    const html = approved
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #28a745;">Conta Aprovada! 🎉</h1>
          <p>Olá, ${instructor.user.name}!</p>
          <p>Sua conta de instrutor foi <strong>aprovada</strong> e você já pode começar a oferecer aulas.</p>
          <p>Acesse a plataforma e comece agora mesmo!</p>
          <a href="${process.env.FRONTEND_URL}/login" 
             style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Acessar Plataforma
          </a>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc3545;">Atualização sobre sua Conta</h1>
          <p>Olá, ${instructor.user.name},</p>
          <p>Infelizmente, sua solicitação de conta de instrutor não foi aprovada neste momento.</p>
          <p>Para mais informações, entre em contato conosco.</p>
        </div>
      `;

    try {
      await this.emailService.sendEmail({
        to: instructor.user.email,
        subject,
        html,
      });
    } catch (error) {
      console.error('Erro ao enviar email de verificação:', error);
    }

    return instructor;
  }
}
```

---

## 5️⃣ Email Personalizado

### Criar template personalizado

```typescript
// Em qualquer serviço
async sendCustomEmail() {
  await this.emailService.sendEmail({
    from: 'noreply@seudominio.com', // Opcional - usa default do .env
    to: 'destinatario@example.com',
    subject: 'Assunto Personalizado',
    html: `
      <html>
        <head>
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial; }
            .header { background-color: #007bff; color: white; padding: 20px; }
            .content { padding: 20px; }
            .footer { background-color: #f5f5f5; padding: 10px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Meu Email Personalizado</h1>
            </div>
            <div class="content">
              <p>Conteúdo do email aqui...</p>
            </div>
            <div class="footer">
              <p>© 2026 SeuInstrutor</p>
            </div>
          </div>
        </body>
      </html>
    `,
    // Opcional: versão em texto puro
    text: 'Versão em texto puro do email',
    // Opcional: CC e BCC
    cc: ['copia@example.com'],
    bcc: ['copia-oculta@example.com'],
    // Opcional: Reply-To
    replyTo: 'suporte@seudominio.com',
  });
}
```

---

## 🎯 Boas Práticas

1. **Sempre use try-catch** ao enviar emails para não quebrar o fluxo principal
2. **Não espere pelo envio** se não for crítico (considere usar filas)
3. **Log todos os erros** para debug
4. **Use templates reutilizáveis** para emails similares
5. **Teste em desenvolvimento** antes de usar em produção
6. **Configure domínio personalizado** para produção
7. **Monitore o dashboard do Resend** para ver taxas de entrega

---

## 📊 Monitoramento

Todos os emails podem ser monitorados no dashboard do Resend:
- Status de entrega
- Taxa de abertura
- Bounces
- Logs de erro

Acesse: https://resend.com/emails

