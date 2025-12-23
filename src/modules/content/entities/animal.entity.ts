import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('animals')
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  nameEn: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  funFact: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  audioUrl: string;

  @Column({ length: 20, default: 'easy' })
  difficulty: string;

  @Column()
  order: number;
}
