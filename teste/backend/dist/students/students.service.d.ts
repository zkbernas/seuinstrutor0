import { PrismaService } from '../prisma/prisma.service';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createStudentDto: any): Promise<{
        id: string;
        userId: string;
        cpf: string;
        phone: string;
    }>;
    findAll(): Promise<({
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
    })[]>;
}
