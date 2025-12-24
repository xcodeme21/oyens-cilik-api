import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import {
  ProfileSummaryDto,
  LevelInfoDto,
  MonthlyStreakDto,
  StreakCalendarDto,
  ActivityHistoryDto,
  CalendarQueryDto,
  MonthQueryDto,
} from './dto/profile.dto';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':childId')
  @ApiOperation({ summary: 'Get profile summary for a child' })
  @ApiResponse({ status: 200, description: 'Profile summary', type: ProfileSummaryDto })
  async getProfileSummary(
    @Param('childId') childId: string,
  ): Promise<ProfileSummaryDto> {
    return this.profileService.getProfileSummary(childId);
  }

  @Get(':childId/calendar')
  @ApiOperation({ summary: 'Get activity calendar for a child' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Activity calendar', type: [ActivityHistoryDto] })
  async getActivityCalendar(
    @Param('childId') childId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ActivityHistoryDto[]> {
    return this.profileService.getActivityCalendar(childId, startDate, endDate);
  }

  @Get(':childId/level')
  @ApiOperation({ summary: 'Get level info for a child' })
  @ApiResponse({ status: 200, description: 'Level info', type: LevelInfoDto })
  async getLevelInfo(
    @Param('childId') childId: string,
  ): Promise<LevelInfoDto> {
    return this.profileService.getLevelInfo(childId);
  }

  @Get(':childId/streak/monthly')
  @ApiOperation({ summary: 'Get monthly streak for a child' })
  @ApiQuery({ name: 'month', required: false, description: 'Month in YYYY-MM format' })
  @ApiResponse({ status: 200, description: 'Monthly streak', type: MonthlyStreakDto })
  async getMonthlyStreak(
    @Param('childId') childId: string,
    @Query('month') month?: string,
  ): Promise<MonthlyStreakDto> {
    return this.profileService.getMonthlyStreak(childId, month);
  }

  @Get(':childId/streak/calendar')
  @ApiOperation({ summary: 'Get streak calendar for a child' })
  @ApiQuery({ name: 'month', required: false, description: 'Month in YYYY-MM format' })
  @ApiResponse({ status: 200, description: 'Streak calendar', type: StreakCalendarDto })
  async getStreakCalendar(
    @Param('childId') childId: string,
    @Query('month') month?: string,
  ): Promise<StreakCalendarDto> {
    return this.profileService.getStreakCalendar(childId, month);
  }
}
