import { SendEmailDto } from './dto/send-email.dto';
export declare class EmailService {
    private readonly logger;
    private resend;
    constructor();
    sendEmail(dto: SendEmailDto): Promise<import("resend").CreateEmailResponseSuccess>;
    sendWelcomeEmail(to: string, name: string): Promise<import("resend").CreateEmailResponseSuccess>;
    sendVerificationEmail(to: string, verificationToken: string): Promise<import("resend").CreateEmailResponseSuccess>;
    sendPasswordResetEmail(to: string, resetToken: string): Promise<import("resend").CreateEmailResponseSuccess>;
    sendLessonScheduledEmail(to: string, lessonDetails: {
        studentName: string;
        instructorName: string;
        date: string;
        time: string;
        duration: number;
    }): Promise<import("resend").CreateEmailResponseSuccess>;
}
