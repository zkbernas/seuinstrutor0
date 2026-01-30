import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    getMe(userId: string): Promise<{
        instructorProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            cpf: string;
            phone: string;
            credentialNumber: string;
            bio: string | null;
            avatarUrl: string | null;
            latitude: number | null;
            longitude: number | null;
            address: string | null;
            pricePerHour: import("@prisma/client/runtime/library").Decimal;
            categories: string[];
            verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
            rejectionReason: string | null;
            rejectionNotes: string | null;
        } | null;
        studentProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            cpf: string;
            phone: string;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
}
