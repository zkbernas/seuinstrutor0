import { 
  Injectable, 
  ConflictException, 
  InternalServerErrorException, 
  NotFoundException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InstructorsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInstructorDto) {
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
            credentialNumber: dto.credentialNumber || dto.credenicalNumber || '', // Suporte ao nome antigo por compatibilidade
            phone: dto.phone,
            pricePerHour: dto.pricePerHour,
            categories: dto.categories,
            userId: user.id,
          },
        });

        return { user, instructor };
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('E-mail ou CPF já cadastrado no sistema.');
      }
      
      console.error(error);
      throw new InternalServerErrorException('Erro ao criar instrutor. Tente novamente mais tarde.');
    }
  }

  async findAll(filters?: {
    status?: string;
    category?: string;
    search?: string;
    transmission?: string;
    adapted?: boolean;
  }) {
    const where: any = {};

    // Filtrar por status de verificação
    if (filters?.status === 'APPROVED') {
      where.verificationStatus = 'APPROVED';
    }

    // Filtrar por categoria
    if (filters?.category) {
      where.categories = {
        has: filters.category,
      };
    }

    // Busca por nome/endereço
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

    // Filtrar por transmissão (via vehicles)
    if (filters?.transmission) {
      where.vehicles = {
        some: {
          transmission: filters.transmission,
        },
      };
    }

    // Filtrar por adaptado (via vehicles)
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

  async findOne(id: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!instructor) {
      throw new NotFoundException(`Instrutor com ID ${id} não encontrado.`);
    }

    return instructor;
  }

  async update(id: string, updateInstructorDto: any) {
    try {
      return await this.prisma.instructor.update({
        where: { id },
        data: updateInstructorDto,
      });
    } catch (error) {
      throw new NotFoundException(`Erro ao atualizar: Instrutor não encontrado.`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.instructor.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Erro ao remover: Instrutor não encontrado.`);
    }
  }

  async requestVerification(userId: string, dto: any) {
    // Verificar se usuário existe e é STUDENT
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { instructorProfile: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.role === 'ADMIN') {
      throw new ConflictException('Administradores não podem solicitar verificação de instrutor');
    }

    // Verificar se CPF já está em uso por outro instrutor
    const existingInstructor = await this.prisma.instructor.findUnique({
      where: { cpf: dto.cpf },
    });

    if (existingInstructor && existingInstructor.userId !== userId) {
      throw new ConflictException('Este CPF já está cadastrado por outro instrutor');
    }

    // Se já existe perfil de instrutor, atualizar; senão, criar
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
          // Limpar dados de rejeição ao reenviar
          rejectionReason: null,
          rejectionNotes: null,
        },
        include: { user: true },
      });
    } else {
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

  async findByVerificationStatus(status: string) {
    return this.prisma.instructor.findMany({
      where: {
        verificationStatus: status as any,
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
}