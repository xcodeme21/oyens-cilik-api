import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Profile Summary Response
export class ModuleProgressDto {
  @ApiProperty({ example: 18 })
  completed: number;

  @ApiProperty({ example: 26 })
  total: number;
}

export class ActivityHistoryDto {
  @ApiProperty({ example: '2024-12-24' })
  date: string;

  @ApiProperty({ example: 3 })
  lessonsCompleted: number;

  @ApiProperty({ example: 9 })
  starsEarned: number;

  @ApiProperty({ example: 15 })
  minutesPlayed: number;

  @ApiProperty({ example: 2 })
  lettersLearned: number;

  @ApiProperty({ example: 1 })
  numbersLearned: number;

  @ApiProperty({ example: 0 })
  animalsLearned: number;
}

export class ProfileSummaryDto {
  @ApiProperty({ example: 'child-uuid' })
  childId: string;

  @ApiProperty({ example: 'Andi' })
  name: string;

  @ApiPropertyOptional({ example: 'Andi' })
  nickname?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png' })
  avatarUrl?: string;

  @ApiProperty({ example: 3 })
  level: number;

  @ApiProperty({ example: 'Mahir' })
  levelTitle: string;

  @ApiProperty({ example: 156 })
  totalStars: number;

  @ApiProperty({ example: 44 })
  starsToNextLevel: number;

  @ApiProperty({ example: 43 })
  totalLessonsCompleted: number;

  @ApiProperty({ example: 7 })
  streak: number;

  @ApiProperty({ example: 14 })
  daysActive: number;

  @ApiPropertyOptional({ example: 'letters' })
  favoriteModule?: string;

  @ApiProperty({ type: [ActivityHistoryDto] })
  recentActivity: ActivityHistoryDto[];

  @ApiProperty({ type: ModuleProgressDto })
  lettersProgress: ModuleProgressDto;

  @ApiProperty({ type: ModuleProgressDto })
  numbersProgress: ModuleProgressDto;

  @ApiProperty({ type: ModuleProgressDto })
  animalsProgress: ModuleProgressDto;
}

// Level Info Response
export class LevelInfoDto {
  @ApiProperty({ example: 3 })
  level: number;

  @ApiProperty({ example: 'Mahir' })
  title: string;

  @ApiProperty({ example: 156 })
  totalStars: number;

  @ApiProperty({ example: 44 })
  starsToNextLevel: number;
}

// Monthly Streak Response
export class StreakDayDto {
  @ApiProperty({ example: '2024-12-24' })
  date: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 3 })
  lessonsCompleted: number;
}

export class MonthlyStreakDto {
  @ApiProperty({ example: 7 })
  currentStreak: number;

  @ApiProperty({ example: 14 })
  longestStreak: number;

  @ApiProperty({ example: 15 })
  daysActiveThisMonth: number;

  @ApiProperty({ example: 20 })
  targetDays: number;

  @ApiProperty({ example: 43 })
  totalLessons: number;

  @ApiProperty({ example: 'Keep Going' })
  achievementBadge: string;
}

export class StreakCalendarDto {
  @ApiProperty({ example: '2024-12' })
  month: string;

  @ApiProperty({ type: [StreakDayDto] })
  days: StreakDayDto[];

  @ApiProperty({ example: 15 })
  activeDaysCount: number;

  @ApiProperty({ example: 7 })
  currentStreak: number;
}

// Query DTOs
export class CalendarQueryDto {
  @ApiPropertyOptional({ example: '2024-12-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class MonthQueryDto {
  @ApiPropertyOptional({ example: '2024-12' })
  @IsOptional()
  @IsString()
  month?: string;
}
