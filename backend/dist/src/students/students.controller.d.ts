import { StudentsService } from './students.service';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(createStudentDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        cpf: string;
        phone: string;
    }>;
    findAll(): Promise<({
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
    })[]>;
}
