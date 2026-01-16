import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { RequestVerificationDto } from '../instructor/dto/request-verification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createInstructorDto: CreateInstructorDto) {
    return this.instructorsService.create(createInstructorDto);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('transmission') transmission?: string,
    @Query('adapted') adapted?: string,
  ) {
    return this.instructorsService.findAll({
      status,
      category,
      search,
      transmission,
      adapted: adapted === 'true' ? true : adapted === 'false' ? false : undefined,
    });
  }

  @Post('request-verification')
  @UseGuards(JwtAuthGuard)
  async requestVerification(
    @CurrentUser() user: { id: string },
    @Body() dto: RequestVerificationDto,
  ) {
    return this.instructorsService.requestVerification(user.id, dto);
  }

  @Get('verification-status')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findByStatus(@Query('status') status: string) {
    return this.instructorsService.findByVerificationStatus(status);
  }
}