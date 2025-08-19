import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Game } from './game.entity';
import { Attempt } from 'src/attempt/attempt.entity';
export declare class GameService {
    private gameRepo;
    private userRepo;
    private attemptRepo;
    constructor(gameRepo: Repository<Game>, userRepo: Repository<User>, attemptRepo: Repository<Attempt>);
    createGame(userId: string): Promise<{
        id: string;
    }>;
    submitGuess(userId: string, gameId: string, value: string): Promise<{
        bulls: number;
        cows: number;
    }>;
    getLatestGame(userId: string): Promise<{
        id: string;
    }>;
    getAllWonGames(userId: string): Promise<Game[]>;
    getAllGames(userId: string): Promise<Game[]>;
    resetGame(userId: string, gameId: string): Promise<{
        id: string;
    }>;
    getAttemptHistory(gameId: string): Promise<Attempt[]>;
}
