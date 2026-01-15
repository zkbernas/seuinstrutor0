import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLessonDto) {
    return this.prisma.lesson.create({
      data: {
        scheduledAt: new Date(dto.scheduledAt),
        duration: dto.duration,
        notes: dto.notes,
        studentId: dto.studentId,
        instructorId: dto.instructorId,
      },
    });
  }

  async findAll() {
    return this.prisma.lesson.findMany({
      include: {
        student: {
          include: { user: true },
        },
        instructor: {
          include: { user: true },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: {
        student: { include: { user: true } },
        instructor: { include: { user: true } },
      },
    });
  }

  async update(id: string, dto: UpdateLessonDto) {
    return this.prisma.lesson.update({
      where: { id },
      data: {
        ...dto,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}