import { PrismaService } from '../prisma/prisma.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
export declare class InstructorsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateInstructorDto): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            role: import("@prisma/client").$Enums.UserRole;
        };
        instructor: {
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
    }>;
    findAll(filters?: {
        status?: string;
        category?: string;
        search?: string;
        transmission?: string;
        adapted?: boolean;
    }): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        vehicles: {
            id: string;
            year: number;
            transmission: import("@prisma/client").$Enums.TransmissionType;
            model: string;
            brand: string;
            plate: string;
            isAdapted: boolean;
            instructorId: string;
        }[];
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
    })[]>;
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, updateInstructorDto: any): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    requestVerification(userId: string, dto: any): Promise<{
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
    }>;
    findByVerificationStatus(status: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
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
    })[]>;
}
