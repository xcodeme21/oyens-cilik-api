import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Child } from '../users/entities/child.entity';
import { Progress, ContentType } from '../progress/entities/progress.entity';
import {
  ProfileSummaryDto,
  LevelInfoDto,
  MonthlyStreakDto,
  StreakCalendarDto,
  ActivityHistoryDto,
  StreakDayDto,
} from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
  ) {}

  // Level definitions
  private readonly levels = [
    { level: 1, title: 'Pemula', minStars: 0 },
    { level: 2, title: 'Penjelajah', minStars: 50 },
    { level: 3, title: 'Mahir', minStars: 100 },
    { level: 4, title: 'Ahli', minStars: 200 },
    { level: 5, title: 'Master', minStars: 500 },
  ];

  async getProfileSummary(childId: string): Promise<ProfileSummaryDto> {
    const child = await this.childRepository.findOne({
      where: { id: childId },
    });

    if (!child) {
      throw new Error('Child not found');
    }

    // Get progress counts
    const lettersCount = await this.progressRepository.count({
      where: { child: { id: childId }, contentType: ContentType.LETTER, completed: true },
    });
    const numbersCount = await this.progressRepository.count({
      where: { child: { id: childId }, contentType: ContentType.NUMBER, completed: true },
    });
    const animalsCount = await this.progressRepository.count({
      where: { child: { id: childId }, contentType: ContentType.ANIMAL, completed: true },
    });

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentProgress = await this.progressRepository.find({
      where: {
        child: { id: childId },
        createdAt: MoreThanOrEqual(sevenDaysAgo),
      },
      order: { createdAt: 'DESC' },
      take: 20,
    });

    // Group by date
    const activityByDate = new Map<string, ActivityHistoryDto>();
    for (const p of recentProgress) {
      const date = p.createdAt.toISOString().split('T')[0];
      if (!activityByDate.has(date)) {
        activityByDate.set(date, {
          date,
          lessonsCompleted: 0,
          starsEarned: 0,
          minutesPlayed: 0,
          lettersLearned: 0,
          numbersLearned: 0,
          animalsLearned: 0,
        });
      }
      const activity = activityByDate.get(date)!;
      activity.lessonsCompleted++;
      activity.starsEarned += p.score ? Math.floor(p.score / 10) : 3;
      activity.minutesPlayed += p.timeSpentSeconds ? Math.floor(p.timeSpentSeconds / 60) : 5;
      
      if (p.contentType === ContentType.LETTER) activity.lettersLearned++;
      if (p.contentType === ContentType.NUMBER) activity.numbersLearned++;
      if (p.contentType === ContentType.ANIMAL) activity.animalsLearned++;
    }

    const levelInfo = this.calculateLevel(child.totalStars);
    const daysActive = await this.countActiveDays(childId);

    return {
      childId: child.id,
      name: child.name,
      nickname: child.nickname,
      avatarUrl: child.avatarUrl,
      level: levelInfo.level,
      levelTitle: levelInfo.title,
      totalStars: child.totalStars,
      starsToNextLevel: levelInfo.starsToNextLevel,
      totalLessonsCompleted: child.totalLessonsCompleted,
      streak: child.streak,
      daysActive,
      favoriteModule: child.favoriteModule || undefined,
      recentActivity: Array.from(activityByDate.values()),
      lettersProgress: { completed: lettersCount, total: 26 },
      numbersProgress: { completed: numbersCount, total: 21 },
      animalsProgress: { completed: animalsCount, total: 20 },
    };
  }

  async getLevelInfo(childId: string): Promise<LevelInfoDto> {
    const child = await this.childRepository.findOne({
      where: { id: childId },
    });

    if (!child) {
      throw new Error('Child not found');
    }

    return this.calculateLevel(child.totalStars);
  }

  async getMonthlyStreak(childId: string, month?: string): Promise<MonthlyStreakDto> {
    const child = await this.childRepository.findOne({
      where: { id: childId },
    });

    if (!child) {
      throw new Error('Child not found');
    }

    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const [year, monthNum] = targetMonth.split('-').map(Number);
    
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59); // Last day of month

    const progress = await this.progressRepository.find({
      where: {
        child: { id: childId },
        createdAt: Between(startDate, endDate),
      },
    });

    // Count unique active days
    const activeDays = new Set<string>();
    for (const p of progress) {
      activeDays.add(p.createdAt.toISOString().split('T')[0]);
    }

    const daysActiveThisMonth = activeDays.size;
    const targetDays = 20;
    
    let achievementBadge = 'Keep Going 💪';
    if (daysActiveThisMonth >= targetDays) {
      achievementBadge = 'Champion 🏆';
    } else if (daysActiveThisMonth >= targetDays * 0.75) {
      achievementBadge = 'Great Progress ⭐';
    }

    return {
      currentStreak: child.streak,
      longestStreak: Math.max(child.streak, 14), // TODO: Track longest streak in DB
      daysActiveThisMonth,
      targetDays,
      totalLessons: progress.length,
      achievementBadge,
    };
  }

  async getStreakCalendar(childId: string, month?: string): Promise<StreakCalendarDto> {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const [year, monthNum] = targetMonth.split('-').map(Number);
    
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);
    const daysInMonth = endDate.getDate();

    const progress = await this.progressRepository.find({
      where: {
        child: { id: childId },
        createdAt: Between(startDate, endDate),
      },
    });

    // Count lessons per day
    const lessonsByDay = new Map<string, number>();
    for (const p of progress) {
      const date = p.createdAt.toISOString().split('T')[0];
      lessonsByDay.set(date, (lessonsByDay.get(date) || 0) + 1);
    }

    // Build calendar
    const days: StreakDayDto[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const lessonsCompleted = lessonsByDay.get(date) || 0;
      days.push({
        date,
        isActive: lessonsCompleted > 0,
        lessonsCompleted,
      });
    }

    const child = await this.childRepository.findOne({
      where: { id: childId },
    });

    return {
      month: targetMonth,
      days,
      activeDaysCount: lessonsByDay.size,
      currentStreak: child?.streak || 0,
    };
  }

  async getActivityCalendar(
    childId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<ActivityHistoryDto[]> {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const progress = await this.progressRepository.find({
      where: {
        child: { id: childId },
        createdAt: Between(start, end),
      },
      order: { createdAt: 'DESC' },
    });

    // Group by date
    const activityByDate = new Map<string, ActivityHistoryDto>();
    for (const p of progress) {
      const date = p.createdAt.toISOString().split('T')[0];
      if (!activityByDate.has(date)) {
        activityByDate.set(date, {
          date,
          lessonsCompleted: 0,
          starsEarned: 0,
          minutesPlayed: 0,
          lettersLearned: 0,
          numbersLearned: 0,
          animalsLearned: 0,
        });
      }
      const activity = activityByDate.get(date)!;
      activity.lessonsCompleted++;
      activity.starsEarned += p.score ? Math.floor(p.score / 10) : 3;
      activity.minutesPlayed += p.timeSpentSeconds ? Math.floor(p.timeSpentSeconds / 60) : 5;
      
      if (p.contentType === ContentType.LETTER) activity.lettersLearned++;
      if (p.contentType === ContentType.NUMBER) activity.numbersLearned++;
      if (p.contentType === ContentType.ANIMAL) activity.animalsLearned++;
    }

    return Array.from(activityByDate.values());
  }

  private calculateLevel(totalStars: number): LevelInfoDto {
    let currentLevel = this.levels[0];
    let nextLevel = this.levels[1];

    for (let i = 0; i < this.levels.length; i++) {
      if (totalStars >= this.levels[i].minStars) {
        currentLevel = this.levels[i];
        nextLevel = this.levels[i + 1] || this.levels[i];
      }
    }

    const starsToNextLevel = nextLevel.minStars - totalStars;

    return {
      level: currentLevel.level,
      title: currentLevel.title,
      totalStars,
      starsToNextLevel: Math.max(0, starsToNextLevel),
    };
  }

  private async countActiveDays(childId: string): Promise<number> {
    const progress = await this.progressRepository.find({
      where: { child: { id: childId } },
      select: ['createdAt'],
    });

    const uniqueDays = new Set<string>();
    for (const p of progress) {
      uniqueDays.add(p.createdAt.toISOString().split('T')[0]);
    }

    return uniqueDays.size;
  }
}
