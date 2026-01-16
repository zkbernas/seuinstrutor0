import { IsEmail, IsString, IsNotEmpty, IsNumber, IsArray, Length, IsOptional } from 'class-validator';

export class CreateInstructorDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @Length(6, 20, { message: 'A senha deve ter entre 6 e 20 caracteres' })
  password: string; 

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(11, 11)
  cpf: string;

  @IsString()
  credentialNumber: string;
  
  // Campo legado para compatibilidade (opcional)
  @IsString()
  @IsOptional()
  credenicalNumber?: string;

  @IsString()
  phone: string;

  @IsNumber()
  pricePerHour: number;

  @IsArray()
  @IsString({ each: true })
  categories: string[];
}