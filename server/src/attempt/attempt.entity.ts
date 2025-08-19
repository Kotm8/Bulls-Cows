import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Game } from '../game/game.entity';

@Entity('attempts')
export class Attempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Game, (game) => game.attempts, { onDelete: 'CASCADE' })
  game: Game;

  @Column()
  guess: string; 

  @Column()
  bulls: number;

  @Column()
  cows: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
