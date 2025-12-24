import { ApiProperty } from '@nestjs/swagger';

export class MonthlyStreakDto {
  @ApiProperty({ description: 'Child ID' })
  childId: string;

  @ApiProperty({ description: 'Current month (YYYY-MM format)' })
  month: string;

  @ApiProperty({ description: 'Current streak (consecutive days)' })
  currentStreak: number;

  @ApiProperty({ description: 'Longest streak this month' })
  longestStreakThisMonth: number;

  @ApiProperty({ description: 'Total active days this month' })
  totalActiveDays: number;

  @ApiProperty({ description: 'Target days for the month (e.g., 20 days)' })
  targetDays: number;

  @ApiProperty({ description: 'Days completed in current month', type: [String] })
  completedDates: string[]; // Array of dates like ['2024-12-01', '2024-12-02']

  @ApiProperty({ description: 'Streak status', enum: ['active', 'broken', 'new'] })
  status: 'active' | 'broken' | 'new';

  @ApiProperty({ description: 'Achievement percentage (0-100)' })
  achievementPercentage: number;

  @ApiProperty({ description: 'Is target met for this month' })
  isTargetMet: boolean;

  @ApiProperty({ description: 'Reward/badge earned', required: false })
  reward?: string;
}

export class StreakCalendarDto {
  @ApiProperty({ description: 'Month (YYYY-MM)' })
  month: string;

  @ApiProperty({ description: 'Calendar data with day markings', type: 'object' })
  calendar: {
    [date: string]: {
      isActive: boolean;
      lessonCount: number;
      stars: number;
    };
  };

  @ApiProperty({ description: 'Month statistics' })
  stats: {
    totalDays: number;
    activeDays: number;
    totalLessons: number;
    totalStars: number;
  };
}
