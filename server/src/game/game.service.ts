import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Game, GameStatus } from './game.entity'
import { Attempt } from 'src/attempt/attempt.entity';

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game)
		private gameRepo: Repository<Game>,
		@InjectRepository(User)
		private userRepo: Repository<User>,
		@InjectRepository(Attempt)
		private attemptRepo: Repository<Attempt>,
	) { }

	async createGame(userId: string) {
		const user = await this.userRepo.findOne({ where: { id: userId } })
		if (!user) throw new BadRequestException('User not found');
		let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		const secretNumber = shuffle(digits).slice(0, 4).join('');
		const game = this.gameRepo.create({
			user,
			secretNumber,
			status: GameStatus.ACTIVE,
		});
		await this.gameRepo.save(game);
		return {
			id: game.id
		}
	}

	async submitGuess(userId: string, gameId: string, value: string) {
		const game = await this.gameRepo.findOne({
			where: { id: gameId, user: { id: userId }, status: GameStatus.ACTIVE },
			select: { id: true, secretNumber: true, status: true, attemptNumber: true },
		});
		if (!game) throw new BadRequestException('Game doesn\'t exist');
		let bulls = 0;
		const secretNumberArr = [...game.secretNumber];
		const attemptNumberArr = [...value];

		for (let i = 0; i < secretNumberArr.length; i++) {
			if (attemptNumberArr[i] === secretNumberArr[i]) bulls++;
		}
		const inSecret = new Set(secretNumberArr);
		const present = attemptNumberArr.filter(d => inSecret.has(d)).length;
		const cows = present - bulls;
		game.attemptNumber++;
		if (bulls === 4) {
			game.status = GameStatus.WON
		}
		await this.gameRepo.save(game);
		await this.attemptRepo.save(this.attemptRepo.create({
			game,
			guess: value,
			bulls,
			cows,
		}));
		return {
			bulls: bulls,
			cows: cows,
		}
	}

	async getLatestGame(userId: string) {
		const game = await this.gameRepo.findOne({
			where: { user: { id: userId }, status: GameStatus.ACTIVE },
			order: { createdAt: 'DESC' },
			select: { id: true, createdAt: true },
		});
		if (!game) {
			return this.createGame(userId);
		} else {
			return {
				id: game.id
			};
		}
	}

	async getAllWonGames(userId: string){
		const games = await this.getAllGames(userId)
		if (!games) throw new BadRequestException('Games don\'t exist');
		return games.filter(game => game.status === GameStatus.WON);
	}

	async getAllGames(userId: string) {
		const games = await this.gameRepo.find({
			where: { user: { id: userId }},
			order: { createdAt: 'ASC' },
			select: { id: true, secretNumber: true, status: true, createdAt: true, updatedAt: true, attemptNumber: true},
		});
		if (!games) throw new BadRequestException('Games don\'t exist');
		return games
	}

	async resetGame(userId: string, gameId: string) {
		const game = await this.gameRepo.findOne({
			where: { id: gameId, user: { id: userId } },
			select: { id: true, status: true },
		});
		if (!game) throw new BadRequestException('Game doesn\'t exist');
		game.status = GameStatus.ABANDONED;
		await this.gameRepo.save(game);
		return this.createGame(userId);
	}
	
	async getAttemptHistory(gameId: string) {
		const attempts = await this.attemptRepo.find({
			where: { game: { id: gameId } },
			select: { guess: true, bulls: true, cows: true, createdAt: true },
			order: { createdAt: 'ASC' },
		});
		return attempts
	}
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	
	if (array[0] === '0') {
		const j = Math.floor(Math.random() * (9) + 1);
		[array[0], array[j]] = [array[j], array[0]];
	}
	return array;
}