import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { InstructorsModule } from './instructors/instructors.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { LessonsModule } from './lessons/lessons.module';
import { AdminModule } from './admin/admin.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule, 
    StudentsModule, 
    InstructorsModule, 
    VehiclesModule, 
    LessonsModule,
    AdminModule,
    EmailModule,
  ],
})
export class AppModule {}