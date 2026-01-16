import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createLessonDto: CreateLessonDto,
    @CurrentUser() user: { id: string },
  ) {
    // Buscar studentId do usuário logado
    const student = await this.lessonsService.findStudentByUserId(user.id);
    if (!student) {
      throw new Error('Perfil de estudante não encontrado');
    }
    
    return this.lessonsService.create({
      ...createLessonDto,
      studentId: student.id,
    });
  }

  @Get()
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id); 
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto); 
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id); 
  }
}