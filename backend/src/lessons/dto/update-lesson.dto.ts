import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto } from './create-lesson.dto';
import { IsEnum, IsOptional, IsISO8601 } from 'class-validator';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
  @IsISO8601()
  @IsOptional()
  scheduledAt?: string;

  @IsEnum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'])
  @IsOptional()
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED';
}