import { InstructorsService } from './instructors.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
export declare class InstructorsController {
    private readonly instructorsService;
    constructor(instructorsService: InstructorsService);
    create(createInstructorDto: CreateInstructorDto): Promise<{
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
}
