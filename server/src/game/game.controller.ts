import { Controller, Post, Req, Param, Body, Get } from '@nestjs/common';
import { GameService } from './game.service';
import { AttemptSolveDto } from 'src/attempt/dto/attempt-solve.dto';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) { }

	@Post()
	async create(@Req() req: Request) {
		const userId = (req as any).anonUser.id;
		return this.gameService.getLatestGame(userId);
	}

	@Post(':id/guess')
	async guess(
		@Param('id') gameId: string,
		@Body() dto: AttemptSolveDto,
		@Req() req: Request,
	) {
		const userId = (req as any).anonUser.id;
		return this.gameService.submitGuess(userId, gameId, dto.value);
	}
	
	@Post(':id/reset')
	async reset(
		@Param('id') gameId: string,
		@Req() req: Request
	) {
		const userId = (req as any).anonUser.id;
		return this.gameService.resetGame(userId, gameId);
	}

	@Get()
	async getWonGames(@Req() req: Request){
		const userId = (req as any).anonUser.id;
		return this.gameService.getAllWonGames(userId);
	}

	@Get(':id/attempts')
	async getAttempts(
		@Param('id') gameId: string,
		@Req() req: Request
	) {
		return this.gameService.getAttemptHistory(gameId);
	}

}
