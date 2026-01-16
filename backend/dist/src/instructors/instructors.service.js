"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let InstructorsService = class InstructorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        try {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(dto.password || '123456', salt);
            return await this.prisma.$transaction(async (tx) => {
                const user = await tx.user.create({
                    data: {
                        email: dto.email,
                        name: dto.name,
                        password: hashedPassword,
                        role: 'INSTRUCTOR',
                    },
                });
                const instructor = await tx.instructor.create({
                    data: {
                        cpf: dto.cpf,
                        credentialNumber: dto.credentialNumber || dto.credenicalNumber || '',
                        phone: dto.phone,
                        pricePerHour: dto.pricePerHour,
                        categories: dto.categories,
                        userId: user.id,
                    },
                });
                return { user, instructor };
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('E-mail ou CPF já cadastrado no sistema.');
            }
            console.error(error);
            throw new common_1.InternalServerErrorException('Erro ao criar instrutor. Tente novamente mais tarde.');
        }
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status === 'APPROVED') {
            where.verificationStatus = 'APPROVED';
        }
        if (filters?.category) {
            where.categories = {
                has: filters.category,
            };
        }
        if (filters?.search) {
            where.OR = [
                {
                    user: {
                        name: {
                            contains: filters.search,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    address: {
                        contains: filters.search,
                        mode: 'insensitive',
                    },
                },
            ];
        }
        if (filters?.transmission) {
            where.vehicles = {
                some: {
                    transmission: filters.transmission,
                },
            };
        }
        if (filters?.adapted !== undefined) {
            where.vehicles = {
                ...where.vehicles,
                some: {
                    ...where.vehicles?.some,
                    isAdapted: filters.adapted,
                },
            };
        }
        return this.prisma.instructor.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                vehicles: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const instructor = await this.prisma.instructor.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!instructor) {
            throw new common_1.NotFoundException(`Instrutor com ID ${id} não encontrado.`);
        }
        return instructor;
    }
    async update(id, updateInstructorDto) {
        try {
            return await this.prisma.instructor.update({
                where: { id },
                data: updateInstructorDto,
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Erro ao atualizar: Instrutor não encontrado.`);
        }
    }
    async remove(id) {
        try {
            return await this.prisma.instructor.delete({
                where: { id },
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Erro ao remover: Instrutor não encontrado.`);
        }
    }
    async requestVerification(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { instructorProfile: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        if (user.role === 'ADMIN') {
            throw new common_1.ConflictException('Administradores não podem solicitar verificação de instrutor');
        }
        const existingInstructor = await this.prisma.instructor.findUnique({
            where: { cpf: dto.cpf },
        });
        if (existingInstructor && existingInstructor.userId !== userId) {
            throw new common_1.ConflictException('Este CPF já está cadastrado por outro instrutor');
        }
        if (user.instructorProfile) {
            return await this.prisma.instructor.update({
                where: { userId },
                data: {
                    cpf: dto.cpf,
                    credentialNumber: dto.credentialNumber,
                    phone: dto.phone,
                    pricePerHour: dto.pricePerHour,
                    categories: dto.categories,
                    bio: dto.bio,
                    address: dto.address,
                    latitude: dto.latitude,
                    longitude: dto.longitude,
                    verificationStatus: 'PENDING',
                    rejectionReason: null,
                    rejectionNotes: null,
                },
                include: { user: true },
            });
        }
        else {
            return await this.prisma.instructor.create({
                data: {
                    userId,
                    cpf: dto.cpf,
                    credentialNumber: dto.credentialNumber,
                    phone: dto.phone,
                    pricePerHour: dto.pricePerHour,
                    categories: dto.categories,
                    bio: dto.bio,
                    address: dto.address,
                    latitude: dto.latitude,
                    longitude: dto.longitude,
                    verificationStatus: 'PENDING',
                },
                include: { user: true },
            });
        }
    }
    async findByVerificationStatus(status) {
        return this.prisma.instructor.findMany({
            where: {
                verificationStatus: status,
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
                createdAt: 'desc',
            },
        });
    }
};
exports.InstructorsService = InstructorsService;
exports.InstructorsService = InstructorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InstructorsService);
//# sourceMappingURL=instructors.service.js.map