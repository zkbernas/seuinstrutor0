import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsController {
    private readonly lessonsService;
    constructor(lessonsService: LessonsService);
    create(createLessonDto: CreateLessonDto): Promise<{
        id: string;
        createdAt: Date;
        instructorId: string;
        scheduledAt: Date;
        duration: number;
        studentId: string;
        notes: string | null;
        status: import("@prisma/client").$Enums.LessonStatus;
    }>;
    findAll(): Promise<({
        instructor: {
            user: {
                email: string;
                password: string;
                name: string;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            userId: string;
            cpf: string;
            phone: string;
            credenicalNumber: string;
            pricePerHour: import("@prisma/client/runtime/library").Decimal;
            categories: string[];
            bio: string | null;
            avatarUrl: string | null;
            latitude: number | null;
            longitude: number | null;
            address: string | null;
        };
        student: {
            user: {
                email: string;
                password: string;
                name: string;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            userId: string;
            cpf: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        instructorId: string;
        scheduledAt: Date;
        duration: number;
        studentId: string;
        notes: string | null;
        status: import("@prisma/client").$Enums.LessonStatus;
    })[]>;
    findOne(id: string): Promise<({
        instructor: {
            user: {
                email: string;
                password: string;
                name: string;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            userId: string;
            cpf: string;
            phone: string;
            credenicalNumber: string;
            pricePerHour: import("@prisma/client/runtime/library").Decimal;
            categories: string[];
            bio: string | null;
            avatarUrl: string | null;
            latitude: number | null;
            longitude: number | null;
            address: string | null;
        };
        student: {
            user: {
                email: string;
                password: string;
                name: string;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            userId: string;
            cpf: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        instructorId: string;
        scheduledAt: Date;
        duration: number;
        studentId: string;
        notes: string | null;
        status: import("@prisma/client").$Enums.LessonStatus;
    }) | null>;
    update(id: string, updateLessonDto: UpdateLessonDto): Promise<{
        id: string;
        createdAt: Date;
        instructorId: string;
        scheduledAt: Date;
        duration: number;
        studentId: string;
        notes: string | null;
        status: import("@prisma/client").$Enums.LessonStatus;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        instructorId: string;
        scheduledAt: Date;
        duration: number;
        studentId: string;
        notes: string | null;
        status: import("@prisma/client").$Enums.LessonStatus;
    }>;
}
