import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToOne,
} from 'typeorm';
import { Attempt } from '../attempt/attempt.entity';
import { User } from '../user/user.entity';

export enum GameStatus {
	ACTIVE = 'active',
	WON = 'won',
	ABANDONED = 'abandoned',
}

@Entity('games')
export class Game {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.games, { onDelete: 'CASCADE' })
	user: User;

	@Column()
	secretNumber: string;

	@Column({ type: 'enum', enum: GameStatus, default: GameStatus.ACTIVE })
	status: GameStatus;

	@OneToMany(() => Attempt, (attempt) => attempt.game, { cascade: true })
	attempts: Attempt[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@Column({ type: 'int', default: 0 })
	attemptNumber: number;

}
