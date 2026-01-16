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
    findAll(status?: string, category?: string, search?: string, transmission?: string, adapted?: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        vehicles: {
            id: string;
            transmission: import("@prisma/client").$Enums.TransmissionType;
            instructorId: string;
            model: string;
            brand: string;
            year: number;
            plate: string;
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
