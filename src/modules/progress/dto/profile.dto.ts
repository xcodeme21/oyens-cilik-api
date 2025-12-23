import { IsString, IsOptional, IsNumber, IsEnum, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType } from '../entities/progress.entity';

export class ActivityHistoryDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  lessonsCompleted: number;

  @ApiProperty()
  starsEarned: number;

  @ApiProperty()
  minutesPlayed: number;

  @ApiProperty()
  lettersLearned: number;

  @ApiProperty()
  numbersLearned: number;

  @ApiProperty()
  animalsLearned: number;
}

export class ProfileSummaryDto {
  @ApiProperty()
  childId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  nickname: string | null;

  @ApiProperty()
  avatarUrl: string | null;

  @ApiProperty()
  level: number;

  @ApiProperty()
  levelTitle: string;

  @ApiProperty()
  totalStars: number;

  @ApiProperty()
  starsToNextLevel: number;

  @ApiProperty()
  totalLessonsCompleted: number;

  @ApiProperty()
  streak: number;

  @ApiProperty()
  daysActive: number;

  @ApiProperty()
  favoriteModule: string | null;

  @ApiProperty({ type: [ActivityHistoryDto] })
  recentActivity: ActivityHistoryDto[];

  @ApiProperty()
  lettersProgress: { completed: number; total: number };

  @ApiProperty()
  numbersProgress: { completed: number; total: number };

  @ApiProperty()
  animalsProgress: { completed: number; total: number };
}

export class CalendarQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endDate?: string;
}
