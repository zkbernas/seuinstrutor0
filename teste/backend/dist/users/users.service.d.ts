import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        instructorProfile: {
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
        } | null;
        studentProfile: {
            id: string;
            userId: string;
            cpf: string;
            phone: string;
        } | null;
    } & {
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<({
        instructorProfile: {
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
        } | null;
        studentProfile: {
            id: string;
            userId: string;
            cpf: string;
            phone: string;
        } | null;
    } & {
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findByEmail(email: string): Promise<{
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
