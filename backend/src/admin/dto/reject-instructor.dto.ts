import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class RejectInstructorDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
