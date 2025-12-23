import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto, AdminLoginDto } from './dto/admin.dto';
import { AdminJwtAuthGuard } from './guards/admin-jwt.guard';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== AUTH ====================

  @Post('auth/login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: AdminLoginDto) {
    return this.adminService.login(loginDto);
  }

  @Get('auth/me')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current admin info' })
  async getMe(@Request() req: any) {
    return this.adminService.getMe(req.user.sub);
  }

  @Post('auth/logout')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin logout' })
  async logout() {
    return { message: 'Logged out successfully' };
  }

  // ==================== ADMIN USERS CRUD ====================

  @Get('users')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all admin users' })
  async findAll() {
    return this.adminService.findAll();
  }

  @Get('users/:id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin user by ID' })
  async findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Post('users')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new admin user' })
  async create(@Body() createDto: CreateAdminDto) {
    return this.adminService.create(createDto);
  }

  @Put('users/:id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update admin user' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateAdminDto) {
    return this.adminService.update(id, updateDto);
  }

  @Delete('users/:id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete admin user' })
  async remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
