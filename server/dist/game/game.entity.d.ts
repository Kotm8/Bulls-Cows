import { Attempt } from '../attempt/attempt.entity';
import { User } from '../user/user.entity';
export declare enum GameStatus {
    ACTIVE = "active",
    WON = "won",
    ABANDONED = "abandoned"
}
export declare class Game {
    id: string;
    user: User;
    secretNumber: string;
    status: GameStatus;
    attempts: Attempt[];
    createdAt: Date;
    updatedAt: Date;
    attemptNumber: number;
}
