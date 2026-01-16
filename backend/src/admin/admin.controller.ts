import { Controller, Post, Param, Get, UseGuards, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RejectInstructorDto } from './dto/reject-instructor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('instructors/:userId/approve')
  async approveInstructor(@Param('userId') userId: string) {
    return this.adminService.approveInstructor(userId);
  }

  @Post('instructors/:userId/reject')
  async rejectInstructor(
    @Param('userId') userId: string,
    @Body() dto: RejectInstructorDto,
  ) {
    return this.adminService.rejectInstructor(userId, dto);
  }

  @Get('instructors/pending')
  async listPendingInstructors() {
    return this.adminService.listPendingInstructors();
  }

  @Get('instructors/rejected')
  async listRejectedInstructors() {
    return this.adminService.listRejectedInstructors();
  }
}
