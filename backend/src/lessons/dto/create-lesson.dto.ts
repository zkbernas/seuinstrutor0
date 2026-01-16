import { IsString, IsNumber, IsISO8601, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLessonDto {
  @IsISO8601()
  @IsNotEmpty()
  scheduledAt: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsOptional()
  studentId?: string; // Opcional, será preenchido pelo controller

  @IsString()
  @IsNotEmpty()
  instructorId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}