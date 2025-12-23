import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('letters')
export class Letter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 1 })
  letter: string;

  @Column({ type: 'char', length: 1 })
  lowercase: string;

  @Column({ nullable: true })
  audioUrl: string;

  @Column({ length: 100 })
  exampleWord: string;

  @Column({ nullable: true })
  exampleImageUrl: string;

  @Column()
  order: number;
}
