import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType, ActivityType } from '../entities/progress.entity';

export class RecordProgressDto {
  @ApiProperty({ enum: ContentType, description: 'Jenis konten' })
  @IsEnum(ContentType)
  contentType: ContentType;

  @ApiProperty({ example: 1, description: 'ID konten' })
  @IsNumber()
  contentId: number;

  @ApiProperty({ enum: ActivityType, description: 'Jenis aktivitas' })
  @IsEnum(ActivityType)
  activityType: ActivityType;

  @ApiPropertyOptional({ example: true, description: 'Apakah selesai' })
  @IsOptional()
  completed?: boolean;

  @ApiPropertyOptional({ example: 80, description: 'Skor 0-100' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  score?: number;

  @ApiPropertyOptional({ example: 60, description: 'Waktu dalam detik' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  timeSpentSeconds?: number;
}

export class ProgressSummaryDto {
  @ApiProperty({ example: 10 })
  totalLettersLearned: number;

  @ApiProperty({ example: 5 })
  totalNumbersLearned: number;

  @ApiProperty({ example: 8 })
  totalAnimalsLearned: number;

  @ApiProperty({ example: 150 })
  totalStars: number;

  @ApiProperty({ example: 3 })
  currentStreak: number;

  @ApiProperty({ example: 2 })
  level: number;
}
