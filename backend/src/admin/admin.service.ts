import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RejectInstructorDto } from './dto/reject-instructor.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async approveInstructor(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { instructorProfile: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!user.instructorProfile) {
      throw new NotFoundException('Perfil de instrutor não encontrado');
    }

    // Atualizar status de verificação e role do usuário
    return await this.prisma.$transaction(async (tx) => {
      // Atualizar perfil do instrutor
      const instructor = await tx.instructor.update({
        where: { userId },
        data: {
          verificationStatus: 'APPROVED',
          rejectionReason: null,
          rejectionNotes: null,
        },
      });

      // Atualizar role do usuário para INSTRUCTOR
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

  async rejectInstructor(userId: string, dto: RejectInstructorDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { instructorProfile: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!user.instructorProfile) {
      throw new NotFoundException('Perfil de instrutor não encontrado');
    }

    // Atualizar status de verificação com motivo
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
}
