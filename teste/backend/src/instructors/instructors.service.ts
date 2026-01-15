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
            credenicalNumber: dto.credenicalNumber,
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

  async findAll() {
    return this.prisma.instructor.findMany({
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
}