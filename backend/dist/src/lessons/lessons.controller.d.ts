import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsController {
    private readonly lessonsService;
    constructor(lessonsService: LessonsService);
    create(createLessonDto: CreateLessonDto, user: {
        id: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.LessonStatus;
        instructorId: string;
        scheduledAt: Date;
        duration: number;
        notes: string | null;
        studentId: string;
    }>;
    findAll(): Promise<({
        instructor: {
            user: {
                id: string;
                email: string;
                password: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
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
        };
        student: {
            user: {
                id: string;
                email: string;
                password: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            cpf: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.LessonStatus;
        instructorId: string;
        scheduledAt: Date;
        duration: number;
        notes: string | null;
        studentId: string;
    })[]>;
    findOne(id: string): Promise<({
        instructor: {
            user: {
                id: string;
                email: string;
                password: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
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
        };
        student: {
            user: {
                id: string;
                email: string;
                password: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            cpf: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.LessonStatus;
        instructorId: string;
        scheduledAt: Date;
        duration: number;
        notes: string | null;
        studentId: string;
    }) | null>;
    update(id: string, updateLessonDto: UpdateLessonDto): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.LessonStatus;
        instructorId: string;
        scheduledAt: Date;
        duration: number;
        notes: string | null;
        studentId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.LessonStatus;
        instructorId: string;
        scheduledAt: Date;
        duration: number;
        notes: string | null;
        studentId: string;
    }>;
}
