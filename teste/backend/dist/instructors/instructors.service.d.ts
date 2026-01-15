import { PrismaService } from '../prisma/prisma.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
export declare class InstructorsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateInstructorDto): Promise<{
        user: {
            email: string;
            password: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        instructor: {
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
    }>;
    findAll(): Promise<({
        user: {
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
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
    })[]>;
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, updateInstructorDto: any): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
