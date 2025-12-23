import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Progress } from '../../progress/entities/progress.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity('children')
export class Child {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  totalStars: number;

  @Column({ default: 0 })
  streak: number;

  @Column({ type: 'date', nullable: true })
  lastActiveDate: Date;

  @Column({ default: 0 })
  totalLessonsCompleted: number;

  @Column({ type: 'varchar', nullable: true, length: 20 })
  favoriteModule: string | null; // 'letter' | 'number' | 'animal'

  @ManyToOne(() => User, (user: User) => user.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent: User;

  @Column()
  parentId: string;

  @OneToMany(() => Progress, (progress: Progress) => progress.child)
  progress: Progress[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
