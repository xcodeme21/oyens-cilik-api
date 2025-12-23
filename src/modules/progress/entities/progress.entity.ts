import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Child } from '../../users/entities/child.entity';

export enum ContentType {
  LETTER = 'letter',
  NUMBER = 'number',
  ANIMAL = 'animal',
}

export enum ActivityType {
  LEARN = 'learn',
  QUIZ = 'quiz',
  GAME = 'game',
}

@Entity('progress')
export class Progress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Child, (child) => child.progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'childId' })
  child: Child;

  @Column()
  childId: string;

  @Column({
    type: 'enum',
    enum: ContentType,
  })
  contentType: ContentType;

  @Column()
  contentId: number;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  activityType: ActivityType;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  starsEarned: number;

  @Column({ default: 0 })
  attempts: number;

  @Column({ type: 'int', default: 0 })
  timeSpentSeconds: number;

  @CreateDateColumn()
  createdAt: Date;
}
