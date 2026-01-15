import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: any) {
    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: createStudentDto.name,
          email: createStudentDto.email,
          password: hashedPassword,
          role: 'STUDENT',
        },
      });

      return await tx.student.create({
        data: {
          userId: user.id,
          cpf: createStudentDto.cpf,
          phone: createStudentDto.phone,
        },
      });
    });
  }

  async findAll() {
    return this.prisma.student.findMany({
      include: { user: true },
    });
  }
}