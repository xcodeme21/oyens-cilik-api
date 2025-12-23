import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress, ContentType, ActivityType } from './entities/progress.entity';
import { RecordProgressDto, ProgressSummaryDto } from './dto/progress.dto';
import { UsersService } from '../users/users.service';
import { ProfileService } from './profile.service';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ProfileService))
    private readonly profileService: ProfileService,
  ) {}

  async recordProgress(
    childId: string,
    recordProgressDto: RecordProgressDto,
  ): Promise<Progress> {
    // Check if progress already exists
    let progress = await this.progressRepository.findOne({
      where: {
        childId,
        contentType: recordProgressDto.contentType,
        contentId: recordProgressDto.contentId,
        activityType: recordProgressDto.activityType,
      },
    });

    const isNewCompletion = !progress?.completed && recordProgressDto.completed;

    if (progress) {
      // Update existing progress
      progress.attempts += 1;
      if (recordProgressDto.completed !== undefined) {
        progress.completed = recordProgressDto.completed;
      }
      if (recordProgressDto.score !== undefined && recordProgressDto.score > progress.score) {
        progress.score = recordProgressDto.score;
      }
      if (recordProgressDto.timeSpentSeconds !== undefined) {
        progress.timeSpentSeconds += recordProgressDto.timeSpentSeconds;
      }
    } else {
      // Create new progress
      progress = this.progressRepository.create({
        childId,
        ...recordProgressDto,
        attempts: 1,
      });
    }

    // Calculate stars earned
    let starsEarned = 0;
    if (recordProgressDto.completed) {
      const score = recordProgressDto.score || 100;
      let stars = 1; // Base star for completion
      if (score >= 80) stars = 2;
      if (score >= 95) stars = 3;

      if (isNewCompletion || stars > progress.starsEarned) {
        const additionalStars = stars - progress.starsEarned;
        if (additionalStars > 0) {
          progress.starsEarned = stars;
          starsEarned = additionalStars;
          await this.usersService.addStarsToChild(childId, additionalStars);
        }
      }
    }

    const savedProgress = await this.progressRepository.save(progress);

    // Update streak and daily activity
    await this.profileService.updateStreak(childId);
    await this.profileService.recordDailyActivity(
      childId,
      recordProgressDto.contentType,
      starsEarned,
      Math.floor((recordProgressDto.timeSpentSeconds || 0) / 60),
    );

    // Update level based on new stars
    await this.profileService.updateLevel(childId);

    return savedProgress;
  }

  async getProgressByChild(childId: string): Promise<Progress[]> {
    return this.progressRepository.find({
      where: { childId },
      order: { createdAt: 'DESC' },
    });
  }

  async getProgressSummary(childId: string): Promise<ProgressSummaryDto> {
    const child = await this.usersService.findChildById(childId, '');

    const [lettersCount, numbersCount, animalsCount] = await Promise.all([
      this.progressRepository.count({
        where: {
          childId,
          contentType: ContentType.LETTER,
          completed: true,
        },
      }),
      this.progressRepository.count({
        where: {
          childId,
          contentType: ContentType.NUMBER,
          completed: true,
        },
      }),
      this.progressRepository.count({
        where: {
          childId,
          contentType: ContentType.ANIMAL,
          completed: true,
        },
      }),
    ]);

    return {
      totalLettersLearned: lettersCount,
      totalNumbersLearned: numbersCount,
      totalAnimalsLearned: animalsCount,
      totalStars: child.totalStars,
      currentStreak: child.streak,
      level: child.level,
    };
  }

  async getContentProgress(
    childId: string,
    contentType: ContentType,
  ): Promise<Progress[]> {
    return this.progressRepository.find({
      where: { childId, contentType },
      order: { contentId: 'ASC' },
    });
  }

  async getLeaderboard(limit: number = 10) {
    const result = await this.progressRepository
      .createQueryBuilder('progress')
      .select('progress.childId', 'childId')
      .addSelect('SUM(progress.starsEarned)', 'totalStars')
      .groupBy('progress.childId')
      .orderBy('totalStars', 'DESC')
      .limit(limit)
      .getRawMany();

    return result;
  }
}
