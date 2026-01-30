import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    sendEmail(sendEmailDto: SendEmailDto): Promise<import("resend").CreateEmailResponseSuccess>;
    testWelcomeEmail(body: {
        email: string;
        name: string;
    }): Promise<import("resend").CreateEmailResponseSuccess>;
    testVerificationEmail(body: {
        email: string;
        token: string;
    }): Promise<import("resend").CreateEmailResponseSuccess>;
    testResetPasswordEmail(body: {
        email: string;
        token: string;
    }): Promise<import("resend").CreateEmailResponseSuccess>;
    testLessonEmail(body: {
        email: string;
        lessonDetails: {
            studentName: string;
            instructorName: string;
            date: string;
            time: string;
            duration: number;
        };
    }): Promise<import("resend").CreateEmailResponseSuccess>;
}
