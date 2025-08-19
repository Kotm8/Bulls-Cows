import { Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Game } from '../game/game.entity';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string; 

  @OneToMany(() => Game, (game) => game.user)
  games: Game[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
