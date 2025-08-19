import { GameService } from './game.service';
import { AttemptSolveDto } from 'src/attempt/dto/attempt-solve.dto';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    create(req: Request): Promise<{
        id: string;
    }>;
    guess(gameId: string, dto: AttemptSolveDto, req: Request): Promise<{
        bulls: number;
        cows: number;
    }>;
    reset(gameId: string, req: Request): Promise<{
        id: string;
    }>;
    getWonGames(req: Request): Promise<import("./game.entity").Game[]>;
    getAttempts(gameId: string, req: Request): Promise<import("../attempt/attempt.entity").Attempt[]>;
}
