import { IsString, IsNumber, IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsNumber()
  year: number;

  @IsString()
  @IsNotEmpty()
  plate: string;

  @IsEnum(['MANUAL', 'AUTOMATIC'])
  transmission: 'MANUAL' | 'AUTOMATIC';

  @IsBoolean()
  isAdapted: boolean;

  @IsString()
  @IsNotEmpty()
  instructorId: string;
}