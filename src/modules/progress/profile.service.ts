import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { ActivityHistory } from './entities/activity-history.entity';
import { Progress, ContentType } from './entities/progress.entity';
import { Child } from '../users/entities/child.entity';
import { ProfileSummaryDto, ActivityHistoryDto } from './dto/profile.dto';
import { MonthlyStreakDto, StreakCalendarDto } from './dto/streak.dto';

/**
 * Level configuration
 * Stars required to reach each level
 */
const LEVEL_CONFIG = [
  { level: 1, minStars: 0, maxStars: 49, title: 'Pemula' },
  { level: 2, minStars: 50, maxStars: 149, title: 'Pelajar' },
  { level: 3,  minStars: 150, maxStars: 299, title: 'Mahir' },
  { level: 4, minStars: 300, maxStars: 499, title: 'Ahli' },
  { level: 5, minStars: 500, maxStars: 999999, title: 'Master' },
];

// Content totals
const TOTAL_LETTERS = 26;
const TOTAL_NUMBERS = 21; // 0-20
const TOTAL_ANIMALS = 15;

// Monthly streak target
const MONTHLY_TARGET_DAYS = 20;

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ActivityHistory)
    private readonly activityHistoryRepository: Repository<ActivityHistory>,
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
  ) {}

  /**
   * Calculate level from total stars
   */
  calculateLevel(totalStars: number): { level: number; title: string; starsToNextLevel: number } {
    for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
      const config = LEVEL_CONFIG[i];
      if (totalStars >= config.minStars) {
        const nextConfig = LEVEL_CONFIG[i + 1];
        const starsToNextLevel = nextConfig
          ? nextConfig.minStars - totalStars
          : 0;
        return {
          level: config.level,
          title: config.title,
          starsToNextLevel: Math.max(0, starsToNextLevel),
        };
      }
    }
    return { level: 1, title: 'Pemula', starsToNextLevel: 50 - totalStars };
  }

  /**
   * Update streak based on activity
   * Called when recording progress
   */
  async updateStreak(childId: string): Promise<void> {
    const child = await this.childRepository.findOne({ where: { id: childId } });
    if (!child) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = child.lastActiveDate
      ? new Date(child.lastActiveDate)
      : null;

    if (lastActive) {
      lastActive.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 0) {
        // Same day, no update needed
        return;
      } else if (diffDays === 1) {
        // Consecutive day, increment streak
        child.streak += 1;
      } else {
        // Streak broken, reset to 1
        child.streak = 1;
      }
    } else {
      // First activity ever
      child.streak = 1;
    }

    child.lastActiveDate = today;
    await this.childRepository.save(child);
  }

  /**
   * Update level based on total stars
   */
  async updateLevel(childId: string): Promise<void> {
    const child = await this.childRepository.findOne({ where: { id: childId } });
    if (!child) return;

    const levelInfo = this.calculateLevel(child.totalStars);
    if (child.level !== levelInfo.level) {
      child.level = levelInfo.level;
      await this.childRepository.save(child);
    }
  }

  /**
   * Record daily activity for calendar view
   */
  async recordDailyActivity(
    childId: string,
    contentType: ContentType,
    starsEarned: number = 0,
    minutesPlayed: number = 0,
  ): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = today.toISOString().split('T')[0];

    let activity = await this.activityHistoryRepository.findOne({
      where: { childId, date: new Date(dateStr) },
    });

    if (!activity) {
      activity = this.activityHistoryRepository.create({
        childId,
        date: new Date(dateStr),
        lessonsCompleted: 0,
        starsEarned: 0,
        minutesPlayed: 0,
        lettersLearned: 0,
        numbersLearned: 0,
        animalsLearned: 0,
      });
    }

    activity.lessonsCompleted += 1;
    activity.starsEarned += starsEarned;
    activity.minutesPlayed += minutesPlayed;

    // Update content-specific counters
    if (contentType === ContentType.LETTER) {
      activity.lettersLearned += 1;
    } else if (contentType === ContentType.NUMBER) {
      activity.numbersLearned += 1;
    } else if (contentType === ContentType.ANIMAL) {
      activity.animalsLearned += 1;
    }

    await this.activityHistoryRepository.save(activity);

    // Update child's totalLessonsCompleted
    await this.childRepository.increment(
      { id: childId },
      'totalLessonsCompleted',
      1,
    );

    // Update favorite module
    await this.updateFavoriteModule(childId);
  }

  /**
   * Update the child's favorite module based on activity
   */
  async updateFavoriteModule(childId: string): Promise<void> {
    const counts = await Promise.all([
      this.progressRepository.count({
        where: { childId, contentType: ContentType.LETTER },
      }),
      this.progressRepository.count({
        where: { childId, contentType: ContentType.NUMBER },
      }),
      this.progressRepository.count({
        where: { childId, contentType: ContentType.ANIMAL },
      }),
    ]);

    const modules = ['letter', 'number', 'animal'];
    const maxIndex = counts.indexOf(Math.max(...counts));
    const favoriteModule = counts[maxIndex] > 0 ? modules[maxIndex] : null;

    await this.childRepository.update(childId, { favoriteModule });
  }

  /**
   * Get activity calendar for date range
   */
  async getActivityCalendar(
    childId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ActivityHistoryDto[]> {
    const activities = await this.activityHistoryRepository.find({
      where: {
        childId,
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    });

    return activities.map((a) => ({
      date: a.date.toISOString().split('T')[0],
      lessonsCompleted: a.lessonsCompleted,
      starsEarned: a.starsEarned,
      minutesPlayed: a.minutesPlayed,
      lettersLearned: a.lettersLearned,
      numbersLearned: a.numbersLearned,
      animalsLearned: a.animalsLearned,
    }));
  }

  /**
   * Get monthly streak data
   */
  async getMonthlyStreak(childId: string, month?: string): Promise<MonthlyStreakDto> {
    const child = await this.childRepository.findOne({ where: { id: childId } });
    if (!child) {
      throw new NotFoundException('Child not found');
    }

    // Parse month or use current
    const targetDate = month ? new Date(month + '-01') : new Date();
    const year = targetDate.getFullYear();
    const monthNum = targetDate.getMonth();
    const monthStr = `${year}-${String(monthNum + 1).padStart(2, '0')}`;

    // Get first and last day of month
    const firstDay = new Date(year, monthNum, 1);
    const lastDay = new Date(year, monthNum + 1, 0);

    // Get all activities for this month
    const activities = await this.activityHistoryRepository.find({
      where: {
        childId,
        date: Between(firstDay, lastDay),
      },
      order: { date: 'ASC' },
    });

    // Build completed dates array
    const completedDates = activities.map(a => a.date.toISOString().split('T')[0]);
    const totalActiveDays = completedDates.length;

    // Calculate current streak (consecutive days including today/latest)
    let currentStreak = 0;
    let longestStreakThisMonth = 0;
    let tempStreak = 0;
    
    const sortedDates = [...completedDates].sort();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(sortedDates[i - 1]);
        const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreakThisMonth = Math.max(longestStreakThisMonth, tempStreak);
          tempStreak = 1;
        }
      }
      
      // Check if this streak extends to today/yesterday
      const diffFromToday = Math.floor((today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffFromToday <= 1 && i === sortedDates.length - 1) {
        currentStreak = tempStreak;
      }
    }
    
    longestStreakThisMonth = Math.max(longestStreakThisMonth, tempStreak);

    // Calculate achievement
    const achievementPercentage = Math.min(100, Math.round((totalActiveDays / MONTHLY_TARGET_DAYS) * 100));
    const isTargetMet = totalActiveDays >= MONTHLY_TARGET_DAYS;

    // Determine status
    let status: 'active' | 'broken' | 'new' = 'new';
    if (currentStreak > 0) {
      status = 'active';
    } else if (totalActiveDays > 0) {
      status = 'broken';
    }

    // Determine reward
    let reward: string | undefined;
    if (isTargetMet) {
      reward = '🏆 Monthly Champion';
    } else if (achievementPercentage >= 75) {
      reward = '⭐ Great Progress';
    } else if (achievementPercentage >= 50) {
      reward = '💪 Keep Going';
    }

    return {
      childId,
      month: monthStr,
      currentStreak,
      longestStreakThisMonth,
      totalActiveDays,
      targetDays: MONTHLY_TARGET_DAYS,
      completedDates,
      status,
      achievementPercentage,
      isTargetMet,
      reward,
    };
  }

  /**
   * Get streak calendar with detailed day data
   */
  async getStreakCalendar(childId: string, month?: string): Promise<StreakCalendarDto> {
    const targetDate = month ? new Date(month + '-01') : new Date();
    const year = targetDate.getFullYear();
    const monthNum = targetDate.getMonth();
    const monthStr = `${year}-${String(monthNum + 1).padStart(2, '0')}`;

    const firstDay = new Date(year, monthNum, 1);
    const lastDay = new Date(year, monthNum + 1, 0);

    const activities = await this.activityHistoryRepository.find({
      where: {
        childId,
        date: Between(firstDay, lastDay),
      },
    });

    // Build calendar object
    const calendar: StreakCalendarDto['calendar'] = {};
    let totalLessons = 0;
    let totalStars = 0;

    activities.forEach(activity => {
      const dateStr = activity.date.toISOString().split('T')[0];
      calendar[dateStr] = {
        isActive: true,
        lessonCount: activity.lessonsCompleted,
        stars: activity.starsEarned,
      };
      totalLessons += activity.lessonsCompleted;
      totalStars += activity.starsEarned;
    });

    return {
      month: monthStr,
      calendar,
      stats: {
        totalDays: lastDay.getDate(),
        activeDays: activities.length,
        totalLessons,
        totalStars,
      },
    };
  }

  /**
   * Get full profile summary
   */
  async getProfileSummary(childId: string): Promise<ProfileSummaryDto> {
    const child = await this.childRepository.findOne({ where: { id: childId } });
    if (!child) {
      throw new NotFoundException('Child not found');
    }

    const levelInfo = this.calculateLevel(child.totalStars);

    // Get content progress
    const [lettersCompleted, numbersCompleted, animalsCompleted] =
      await Promise.all([
        this.progressRepository.count({
          where: { childId, contentType: ContentType.LETTER, completed: true },
        }),
        this.progressRepository.count({
          where: { childId, contentType: ContentType.NUMBER, completed: true },
        }),
        this.progressRepository.count({
          where: { childId, contentType: ContentType.ANIMAL, completed: true },
        }),
      ]);

    // Get total days active
    const daysActive = await this.activityHistoryRepository.count({
      where: { childId },
    });

    // Get recent 7 days activity
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    const recentActivity = await this.getActivityCalendar(
      childId,
      sevenDaysAgo,
      today,
    );

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
      favoriteModule: child.favoriteModule,
      recentActivity,
      lettersProgress: { completed: lettersCompleted, total: TOTAL_LETTERS },
      numbersProgress: { completed: numbersCompleted, total: TOTAL_NUMBERS },
      animalsProgress: { completed: animalsCompleted, total: TOTAL_ANIMALS },
    };
  }
}
