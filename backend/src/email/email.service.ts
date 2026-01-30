import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY não configurada. Serviço de email não estará disponível.');
    }
    
    this.resend = new Resend(apiKey);
  }

  /**
   * Envia um email usando o Resend
   */
  async sendEmail(dto: SendEmailDto) {
    try {
      const emailOptions: any = {
        from: dto.from || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: dto.to,
        subject: dto.subject,
      };

      if (dto.html) emailOptions.html = dto.html;
      if (dto.text) emailOptions.text = dto.text;
      if (dto.cc) emailOptions.cc = dto.cc;
      if (dto.bcc) emailOptions.bcc = dto.bcc;
      if (dto.replyTo) emailOptions.replyTo = dto.replyTo;

      const { data, error } = await this.resend.emails.send(emailOptions);

      if (error) {
        this.logger.error('Erro ao enviar email:', error);
        throw new Error(`Falha ao enviar email: ${error.message}`);
      }

      this.logger.log(`Email enviado com sucesso. ID: ${data?.id}`);
      return data;
    } catch (error) {
      this.logger.error('Erro ao enviar email:', error);
      throw error;
    }
  }

  /**
   * Envia email de boas-vindas para novos usuários
   */
  async sendWelcomeEmail(to: string, name: string) {
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

  /**
   * Envia email de verificação de conta
   */
  async sendVerificationEmail(to: string, verificationToken: string) {
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

  /**
   * Envia email de redefinição de senha
   */
  async sendPasswordResetEmail(to: string, resetToken: string) {
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

  /**
   * Envia notificação de nova aula agendada
   */
  async sendLessonScheduledEmail(to: string, lessonDetails: {
    studentName: string;
    instructorName: string;
    date: string;
    time: string;
    duration: number;
  }) {
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
}

