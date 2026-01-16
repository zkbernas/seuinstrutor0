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
            userId: string;
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
            instructorId: string;
            model: string;
            brand: string;
            year: number;
            plate: string;
            transmission: import("@prisma/client").$Enums.TransmissionType;
            isAdapted: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
        userId: string;
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
        userId: string;
    }>;
    update(id: string, updateInstructorDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
        userId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
        userId: string;
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
        userId: string;
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
        userId: string;
    })[]>;
}
