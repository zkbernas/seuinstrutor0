import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Endpoint para enviar email genérico (apenas para admin/testes)
   * POST /email/send
   */
  @Post('send')
  @UseGuards(JwtAuthGuard)
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.emailService.sendEmail(sendEmailDto);
  }

  /**
   * Endpoint de teste para enviar email de boas-vindas
   * POST /email/test-welcome
   */
  @Post('test-welcome')
  async testWelcomeEmail(@Body() body: { email: string; name: string }) {
    return this.emailService.sendWelcomeEmail(body.email, body.name);
  }

  /**
   * Endpoint de teste para enviar email de verificação
   * POST /email/test-verification
   */
  @Post('test-verification')
  async testVerificationEmail(@Body() body: { email: string; token: string }) {
    return this.emailService.sendVerificationEmail(body.email, body.token);
  }

  /**
   * Endpoint de teste para enviar email de redefinição de senha
   * POST /email/test-reset-password
   */
  @Post('test-reset-password')
  async testResetPasswordEmail(@Body() body: { email: string; token: string }) {
    return this.emailService.sendPasswordResetEmail(body.email, body.token);
  }

  /**
   * Endpoint de teste para enviar notificação de aula
   * POST /email/test-lesson
   */
  @Post('test-lesson')
  async testLessonEmail(
    @Body()
    body: {
      email: string;
      lessonDetails: {
        studentName: string;
        instructorName: string;
        date: string;
        time: string;
        duration: number;
      };
    },
  ) {
    return this.emailService.sendLessonScheduledEmail(body.email, body.lessonDetails);
  }
}

