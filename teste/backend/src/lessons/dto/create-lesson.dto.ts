import { IsString, IsNumber, IsISO8601, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLessonDto {
  @IsISO8601()
  @IsNotEmpty()
  scheduledAt: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  instructorId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}