import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from './guards/admin-jwt.guard';
import { StatsService } from './stats.service';

@ApiTags('admin')
@Controller('admin/stats')
@UseGuards(AdminJwtAuthGuard)
@ApiBearerAuth()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboardStats() {
    return this.statsService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get user statistics' })
  async getUserStats() {
    return this.statsService.getUserStats();
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get recent activity' })
  async getRecentActivity() {
    return this.statsService.getRecentActivity();
  }

  @Get('top-learners')
  @ApiOperation({ summary: 'Get top learners' })
  async getTopLearners() {
    return this.statsService.getTopLearners();
  }
}
