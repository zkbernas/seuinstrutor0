import { AdminService } from './admin.service';
import { RejectInstructorDto } from './dto/reject-instructor.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    approveInstructor(userId: string): Promise<{
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
    rejectInstructor(userId: string, dto: RejectInstructorDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
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
    listPendingInstructors(): Promise<({
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
    listRejectedInstructors(): Promise<({
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
