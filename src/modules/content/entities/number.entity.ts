import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('numbers')
export class NumberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column({ length: 50 })
  word: string; // "Satu", "Dua", etc.

  @Column({ nullable: true })
  audioUrl: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  order: number;
}
