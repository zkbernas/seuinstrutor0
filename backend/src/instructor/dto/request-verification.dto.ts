import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class RequestVerificationDto {
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  credentialNumber: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNumber()
  @Type(() => Number)
  pricePerHour: number;

  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;
}
