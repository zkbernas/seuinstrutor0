import { InstructorsService } from './instructors.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { RequestVerificationDto } from '../instructor/dto/request-verification.dto';
export declare class InstructorsController {
    private readonly instructorsService;
    constructor(instructorsService: InstructorsService);
    create(createInstructorDto: CreateInstructorDto): Promise<{
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
    findAll(status?: string, category?: string, search?: string, transmission?: string, adapted?: string): Promise<({
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
    requestVerification(user: {
        id: string;
    }, dto: RequestVerificationDto): Promise<{
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
    findByStatus(status: string): Promise<({
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
