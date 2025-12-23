import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Child } from '../../users/entities/child.entity';

/**
 * Tracks daily activity summary for each child
 * Used for calendar view and streak calculation
 */
@Entity('activity_history')
@Unique(['childId', 'date'])
export class ActivityHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Child, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'childId' })
  child: Child;

  @Column()
  childId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: 0 })
  lessonsCompleted: number;

  @Column({ default: 0 })
  starsEarned: number;

  @Column({ default: 0 })
  minutesPlayed: number;

  @Column({ default: 0 })
  lettersLearned: number;

  @Column({ default: 0 })
  numbersLearned: number;

  @Column({ default: 0 })
  animalsLearned: number;

  @CreateDateColumn()
  createdAt: Date;
}
