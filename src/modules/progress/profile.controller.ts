import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { ProfileSummaryDto, CalendarQueryDto, ActivityHistoryDto } from './dto/profile.dto';
import { MonthlyStreakDto, StreakCalendarDto } from './dto/streak.dto';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':childId')
  @ApiOperation({ summary: 'Get child profile summary with stats' })
  async getProfile(
    @Param('childId', ParseUUIDPipe) childId: string,
  ): Promise<ProfileSummaryDto> {
    return this.profileService.getProfileSummary(childId);
  }

  @Get(':childId/calendar')
  @ApiOperation({ summary: 'Get activity calendar for date range' })
  @ApiQuery({ name: 'startDate', required: false, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2024-01-31' })
  async getCalendar(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Query() query: CalendarQueryDto,
  ): Promise<ActivityHistoryDto[]> {
    const today = new Date();
    const defaultStart = new Date();
    defaultStart.setDate(today.getDate() - 30);

    const startDate = query.startDate
      ? new Date(query.startDate)
      : defaultStart;
    const endDate = query.endDate ? new Date(query.endDate) : today;

    return this.profileService.getActivityCalendar(childId, startDate, endDate);
  }

  @Get(':childId/level')
  @ApiOperation({ summary: 'Get level info for child' })
  async getLevelInfo(@Param('childId', ParseUUIDPipe) childId: string) {
    const profile = await this.profileService.getProfileSummary(childId);
    return {
      level: profile.level,
      title: profile.levelTitle,
      totalStars: profile.totalStars,
      starsToNextLevel: profile.starsToNextLevel,
    };
  }

  @Get(':childId/streak/monthly')
  @ApiOperation({ summary: 'Get monthly streak data with achievements'  })
  @ApiQuery({ name: 'month', required: false, example: '2024-12', description: 'Month in YYYY-MM format (default: current month)' })
  async getMonthlyStreak(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Query('month') month?: string,
  ): Promise<MonthlyStreakDto> {
    return this.profileService.getMonthlyStreak(childId, month);
  }

  @Get(':childId/streak/calendar')
  @ApiOperation({ summary: 'Get detailed streak calendar for month' })
  @ApiQuery({ name: 'month', required: false, example: '2024-12', description: 'Month in YYYY-MM format (default: current month)' })
  async getStreakCalendar(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Query('month') month?: string,
  ): Promise<StreakCalendarDto> {
    return this.profileService.getStreakCalendar(childId, month);
  }
}
