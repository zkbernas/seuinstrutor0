import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateLessonDto & {
        studentId: string;
    }): Promise<{
        id: string;
        scheduledAt: Date;
        duration: number;
        status: import("@prisma/client").$Enums.LessonStatus;
        notes: string | null;
        createdAt: Date;
        studentId: string;
        instructorId: string;
    }>;
    findAll(): Promise<({
        instructor: {
            user: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                email: string;
                password: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            cpf: string;
            credentialNumber: string;
            bio: string | null;
            phone: string;
            avatarUrl: string | null;
            latitude: number | null;
            longitude: number | null;
            address: string | null;
            pricePerHour: import("@prisma/client/runtime/library").Decimal;
            categories: string[];
            verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
            rejectionReason: string | null;
            rejectionNotes: string | null;
            updatedAt: Date;
        };
        student: {
            user: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                email: string;
                password: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            cpf: string;
            phone: string;
            updatedAt: Date;
        };
    } & {
        id: string;
        scheduledAt: Date;
        duration: number;
        status: import("@prisma/client").$Enums.LessonStatus;
        notes: string | null;
        createdAt: Date;
        studentId: string;
        instructorId: string;
    })[]>;
    findOne(id: string): Promise<({
        instructor: {
            user: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                email: string;
                password: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            cpf: string;
            credentialNumber: string;
            bio: string | null;
            phone: string;
            avatarUrl: string | null;
            latitude: number | null;
            longitude: number | null;
            address: string | null;
            pricePerHour: import("@prisma/client/runtime/library").Decimal;
            categories: string[];
            verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
            rejectionReason: string | null;
            rejectionNotes: string | null;
            updatedAt: Date;
        };
        student: {
            user: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                email: string;
                password: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            cpf: string;
            phone: string;
            updatedAt: Date;
        };
    } & {
        id: string;
        scheduledAt: Date;
        duration: number;
        status: import("@prisma/client").$Enums.LessonStatus;
        notes: string | null;
        createdAt: Date;
        studentId: string;
        instructorId: string;
    }) | null>;
    update(id: string, dto: UpdateLessonDto): Promise<{
        id: string;
        scheduledAt: Date;
        duration: number;
        status: import("@prisma/client").$Enums.LessonStatus;
        notes: string | null;
        createdAt: Date;
        studentId: string;
        instructorId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        scheduledAt: Date;
        duration: number;
        status: import("@prisma/client").$Enums.LessonStatus;
        notes: string | null;
        createdAt: Date;
        studentId: string;
        instructorId: string;
    }>;
    findStudentByUserId(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        cpf: string;
        phone: string;
        updatedAt: Date;
    } | null>;
}
