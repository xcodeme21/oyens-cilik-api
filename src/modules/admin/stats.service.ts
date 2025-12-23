import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Child } from '../users/entities/child.entity';
import { Progress } from '../progress/entities/progress.entity';
import { Letter } from '../content/entities/letter.entity';
import { NumberEntity } from '../content/entities/number.entity';
import { Animal } from '../content/entities/animal.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
    @InjectRepository(NumberEntity)
    private readonly numberRepository: Repository<NumberEntity>,
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalChildren,
      totalLetters,
      totalNumbers,
      totalAnimals,
      totalProgress,
      todayProgress,
    ] = await Promise.all([
      this.userRepository.count(),
      this.childRepository.count(),
      this.letterRepository.count(),
      this.numberRepository.count(),
      this.animalRepository.count(),
      this.progressRepository.count(),
      this.progressRepository.count({
        where: {
          createdAt: MoreThanOrEqual(today),
        },
      }),
    ]);

    // Calculate total stars earned
    const starsResult = await this.childRepository
      .createQueryBuilder('child')
      .select('SUM(child.totalStars)', 'totalStars')
      .getRawOne();

    // Calculate total lessons completed
    const lessonsResult = await this.progressRepository
      .createQueryBuilder('progress')
      .select('COUNT(*)', 'count')
      .where('progress.completed = true')
      .getRawOne();

    // Calculate average streak
    const streakResult = await this.childRepository
      .createQueryBuilder('child')
      .select('AVG(child.streak)', 'avgStreak')
      .getRawOne();

    // Active users today (children who have progress today)
    const activeToday = await this.progressRepository
      .createQueryBuilder('progress')
      .select('COUNT(DISTINCT progress.childId)', 'count')
      .where('progress.createdAt >= :today', { today })
      .getRawOne();

    return {
      userStats: {
        totalUsers,
        totalChildren,
        activeToday: parseInt(activeToday?.count || '0', 10),
        totalStarsEarned: parseInt(starsResult?.totalStars || '0', 10),
        totalLessonsCompleted: parseInt(lessonsResult?.count || '0', 10),
        averageStreak: parseFloat(streakResult?.avgStreak || '0').toFixed(1),
      },
      contentStats: {
        letters: totalLetters,
        numbers: totalNumbers,
        animals: totalAnimals,
        totalProgress,
        todayProgress,
      },
    };
  }

  async getUserStats() {
    const [totalUsers, totalChildren] = await Promise.all([
      this.userRepository.count(),
      this.childRepository.count(),
    ]);

    // Users by level
    const levelDistribution = await this.childRepository
      .createQueryBuilder('child')
      .select('child.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('child.level')
      .getRawMany();

    return {
      totalUsers,
      totalChildren,
      levelDistribution,
    };
  }

  async getRecentActivity() {
    const recentProgress = await this.progressRepository
      .createQueryBuilder('progress')
      .leftJoinAndSelect('progress.child', 'child')
      .orderBy('progress.createdAt', 'DESC')
      .limit(10)
      .getMany();

    return recentProgress.map((p) => ({
      childName: p.child?.name || 'Unknown',
      contentType: p.contentType,
      contentId: p.contentId,
      starsEarned: p.starsEarned,
      completed: p.completed,
      time: this.getRelativeTime(p.createdAt),
      createdAt: p.createdAt,
    }));
  }

  async getTopLearners() {
    const topChildren = await this.childRepository
      .createQueryBuilder('child')
      .orderBy('child.totalStars', 'DESC')
      .limit(10)
      .getMany();

    return topChildren.map((child) => ({
      name: child.name,
      stars: child.totalStars,
      level: child.level,
      streak: child.streak,
      levelTitle: this.getLevelTitle(child.level),
    }));
  }

  private getLevelTitle(level: number): string {
    const titles: Record<number, string> = {
      1: 'Pemula',
      2: 'Pelajar',
      3: 'Mahir',
      4: 'Ahli',
      5: 'Master',
    };
    return titles[level] || 'Pemula';
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
  }
}
