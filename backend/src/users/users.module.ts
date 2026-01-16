import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],          // importante se UsersService usa PrismaService
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],          // <<< ISSO resolve a injeção no AuthService
})
export class UsersModule {}
