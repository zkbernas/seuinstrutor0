import { IsEmail, IsString, IsOptional, IsArray } from 'class-validator';

export class SendEmailDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsEmail({}, { each: true })
  to: string | string[];

  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsEmail({}, { each: true })
  cc?: string | string[];

  @IsOptional()
  @IsEmail({}, { each: true })
  bcc?: string | string[];

  @IsOptional()
  @IsEmail({}, { each: true })
  replyTo?: string | string[];
}

