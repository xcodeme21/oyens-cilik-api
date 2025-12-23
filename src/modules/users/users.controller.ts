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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { CreateChildDto, UpdateChildDto } from './dto/child.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==================== USER ENDPOINTS ====================

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated' })
  async updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  // ==================== CHILDREN ENDPOINTS ====================

  @Post('children')
  @ApiOperation({ summary: 'Add a new child profile' })
  @ApiResponse({ status: 201, description: 'Child created successfully' })
  async createChild(@Request() req: any, @Body() createChildDto: CreateChildDto) {
    return this.usersService.createChild(req.user.id, createChildDto);
  }

  @Get('children')
  @ApiOperation({ summary: 'Get all children profiles' })
  @ApiResponse({ status: 200, description: 'Children list retrieved' })
  async getChildren(@Request() req: any) {
    return this.usersService.findChildrenByParent(req.user.id);
  }

  @Get('children/:id')
  @ApiOperation({ summary: 'Get a specific child profile' })
  @ApiResponse({ status: 200, description: 'Child retrieved' })
  async getChild(@Request() req: any, @Param('id') id: string) {
    return this.usersService.findChildById(id, req.user.id);
  }

  @Put('children/:id')
  @ApiOperation({ summary: 'Update a child profile' })
  @ApiResponse({ status: 200, description: 'Child updated' })
  async updateChild(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateChildDto: UpdateChildDto,
  ) {
    return this.usersService.updateChild(id, req.user.id, updateChildDto);
  }

  @Delete('children/:id')
  @ApiOperation({ summary: 'Delete a child profile' })
  @ApiResponse({ status: 200, description: 'Child deleted' })
  async deleteChild(@Request() req: any, @Param('id') id: string) {
    await this.usersService.deleteChild(id, req.user.id);
    return { message: 'Anak berhasil dihapus' };
  }
}
