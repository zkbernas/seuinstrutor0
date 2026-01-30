"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let EmailService = EmailService_1 = class EmailService {
    logger = new common_1.Logger(EmailService_1.name);
    resend;
    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            this.logger.warn('RESEND_API_KEY não configurada. Serviço de email não estará disponível.');
        }
        this.resend = new resend_1.Resend(apiKey);
    }
    async sendEmail(dto) {
        try {
            const emailOptions = {
                from: dto.from || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
                to: dto.to,
                subject: dto.subject,
            };
            if (dto.html)
                emailOptions.html = dto.html;
            if (dto.text)
                emailOptions.text = dto.text;
            if (dto.cc)
                emailOptions.cc = dto.cc;
            if (dto.bcc)
                emailOptions.bcc = dto.bcc;
            if (dto.replyTo)
                emailOptions.replyTo = dto.replyTo;
            const { data, error } = await this.resend.emails.send(emailOptions);
            if (error) {
                this.logger.error('Erro ao enviar email:', error);
                throw new Error(`Falha ao enviar email: ${error.message}`);
            }
            this.logger.log(`Email enviado com sucesso. ID: ${data?.id}`);
            return data;
        }
        catch (error) {
            this.logger.error('Erro ao enviar email:', error);
            throw error;
        }
    }
    async sendWelcomeEmail(to, name) {
        return this.sendEmail({
            to,
            subject: 'Bem-vindo ao SeuInstrutor!',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Olá, ${name}! 👋</h1>
          <p>Bem-vindo ao <strong>SeuInstrutor</strong>!</p>
          <p>Estamos muito felizes em tê-lo conosco. Nossa plataforma foi desenvolvida para facilitar o gerenciamento de aulas de direção.</p>
          <p>Se você tiver alguma dúvida, não hesite em nos contatar.</p>
          <br/>
          <p>Atenciosamente,<br/>Equipe SeuInstrutor</p>
        </div>
      `,
        });
    }
    async sendVerificationEmail(to, verificationToken) {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;
        return this.sendEmail({
            to,
            subject: 'Verificação de Email - SeuInstrutor',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Verificação de Email</h1>
          <p>Por favor, clique no link abaixo para verificar seu email:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Verificar Email
          </a>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
          <br/>
          <p style="color: #999; font-size: 12px;">Se você não solicitou esta verificação, ignore este email.</p>
        </div>
      `,
        });
    }
    async sendPasswordResetEmail(to, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        return this.sendEmail({
            to,
            subject: 'Redefinição de Senha - SeuInstrutor',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Redefinição de Senha</h1>
          <p>Você solicitou a redefinição de senha. Clique no link abaixo para criar uma nova senha:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Redefinir Senha
          </a>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <br/>
          <p style="color: #999; font-size: 12px;">Este link expira em 1 hora. Se você não solicitou esta redefinição, ignore este email.</p>
        </div>
      `,
        });
    }
    async sendLessonScheduledEmail(to, lessonDetails) {
        return this.sendEmail({
            to,
            subject: 'Nova Aula Agendada - SeuInstrutor',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Aula Agendada ✅</h1>
          <p>Uma nova aula foi agendada com os seguintes detalhes:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Aluno:</strong> ${lessonDetails.studentName}</p>
            <p><strong>Instrutor:</strong> ${lessonDetails.instructorName}</p>
            <p><strong>Data:</strong> ${lessonDetails.date}</p>
            <p><strong>Horário:</strong> ${lessonDetails.time}</p>
            <p><strong>Duração:</strong> ${lessonDetails.duration} minutos</p>
          </div>
          <p>Certifique-se de estar disponível no horário marcado.</p>
          <br/>
          <p>Atenciosamente,<br/>Equipe SeuInstrutor</p>
        </div>
      `,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map