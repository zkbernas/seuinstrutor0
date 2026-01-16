"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async approveInstructor(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { instructorProfile: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        if (!user.instructorProfile) {
            throw new common_1.NotFoundException('Perfil de instrutor não encontrado');
        }
        return await this.prisma.$transaction(async (tx) => {
            const instructor = await tx.instructor.update({
                where: { userId },
                data: {
                    verificationStatus: 'APPROVED',
                    rejectionReason: null,
                    rejectionNotes: null,
                },
            });
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    role: 'INSTRUCTOR',
                },
                include: {
                    instructorProfile: true,
                    studentProfile: true,
                },
            });
            return updatedUser;
        });
    }
    async rejectInstructor(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { instructorProfile: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        if (!user.instructorProfile) {
            throw new common_1.NotFoundException('Perfil de instrutor não encontrado');
        }
        return await this.prisma.instructor.update({
            where: { userId },
            data: {
                verificationStatus: 'REJECTED',
                rejectionReason: dto.reason,
                rejectionNotes: dto.notes,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async listPendingInstructors() {
        return this.prisma.instructor.findMany({
            where: {
                verificationStatus: 'PENDING',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
    async listRejectedInstructors() {
        return this.prisma.instructor.findMany({
            where: {
                verificationStatus: 'REJECTED',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map