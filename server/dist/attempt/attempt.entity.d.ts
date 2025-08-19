import { Game } from '../game/game.entity';
export declare class Attempt {
    id: string;
    game: Game;
    guess: string;
    bulls: number;
    cows: number;
    createdAt: Date;
}
