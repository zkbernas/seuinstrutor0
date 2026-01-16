import { Injectable, UnauthorizedException, ForbiddenException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Verificar se email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Este e-mail já está cadastrado');
    }

    // Verificar se CPF já existe
    const existingStudent = await this.prisma.student.findUnique({
      where: { cpf: dto.cpf },
    });

    if (existingStudent) {
      throw new ConflictException('Este CPF já está cadastrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Criar User + StudentProfile em transação
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          role: 'STUDENT',
          studentProfile: {
            create: {
              cpf: dto.cpf,
              phone: dto.phone,
            },
          },
        },
        include: {
          studentProfile: true,
        },
      });

      return user;
    });

    const payload = { sub: result.id, email: result.email, role: result.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        instructorProfile: true,
        studentProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // Verificar se é instrutor e status de verificação
    if (user.role === 'INSTRUCTOR' && user.instructorProfile) {
      const status = user.instructorProfile.verificationStatus;
      
      if (status === 'PENDING') {
        throw new ForbiddenException('Conta em análise. Aguarde a aprovação dos administradores.');
      }

      if (status === 'REJECTED') {
        const reason = user.instructorProfile.rejectionReason || 'Documentos reprovados';
        throw new ForbiddenException(`Reprovado: ${reason}. Reenvie os documentos para nova análise.`);
      }

      if (status !== 'APPROVED') {
        throw new ForbiddenException('Conta não verificada. Complete a verificação para acessar.');
      }
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        instructorProfile: true,
        studentProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }
}