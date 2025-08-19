"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const game_entity_1 = require("./game.entity");
const attempt_entity_1 = require("../attempt/attempt.entity");
let GameService = class GameService {
    gameRepo;
    userRepo;
    attemptRepo;
    constructor(gameRepo, userRepo, attemptRepo) {
        this.gameRepo = gameRepo;
        this.userRepo = userRepo;
        this.attemptRepo = attemptRepo;
    }
    async createGame(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const secretNumber = shuffle(digits).slice(0, 4).join('');
        const game = this.gameRepo.create({
            user,
            secretNumber,
            status: game_entity_1.GameStatus.ACTIVE,
        });
        await this.gameRepo.save(game);
        return {
            id: game.id
        };
    }
    async submitGuess(userId, gameId, value) {
        const game = await this.gameRepo.findOne({
            where: { id: gameId, user: { id: userId }, status: game_entity_1.GameStatus.ACTIVE },
            select: { id: true, secretNumber: true, status: true, attemptNumber: true },
        });
        if (!game)
            throw new common_1.BadRequestException('Game doesn\'t exist');
        let bulls = 0;
        const secretNumberArr = [...game.secretNumber];
        const attemptNumberArr = [...value];
        for (let i = 0; i < secretNumberArr.length; i++) {
            if (attemptNumberArr[i] === secretNumberArr[i])
                bulls++;
        }
        const inSecret = new Set(secretNumberArr);
        const present = attemptNumberArr.filter(d => inSecret.has(d)).length;
        const cows = present - bulls;
        game.attemptNumber++;
        if (bulls === 4) {
            game.status = game_entity_1.GameStatus.WON;
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
        };
    }
    async getLatestGame(userId) {
        const game = await this.gameRepo.findOne({
            where: { user: { id: userId }, status: game_entity_1.GameStatus.ACTIVE },
            order: { createdAt: 'DESC' },
            select: { id: true, createdAt: true },
        });
        if (!game) {
            return this.createGame(userId);
        }
        else {
            return {
                id: game.id
            };
        }
    }
    async getAllWonGames(userId) {
        const games = await this.getAllGames(userId);
        if (!games)
            throw new common_1.BadRequestException('Games don\'t exist');
        return games.filter(game => game.status === game_entity_1.GameStatus.WON);
    }
    async getAllGames(userId) {
        const games = await this.gameRepo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'ASC' },
            select: { id: true, secretNumber: true, status: true, createdAt: true, updatedAt: true, attemptNumber: true },
        });
        if (!games)
            throw new common_1.BadRequestException('Games don\'t exist');
        return games;
    }
    async resetGame(userId, gameId) {
        const game = await this.gameRepo.findOne({
            where: { id: gameId, user: { id: userId } },
            select: { id: true, status: true },
        });
        if (!game)
            throw new common_1.BadRequestException('Game doesn\'t exist');
        game.status = game_entity_1.GameStatus.ABANDONED;
        await this.gameRepo.save(game);
        return this.createGame(userId);
    }
    async getAttemptHistory(gameId) {
        const attempts = await this.attemptRepo.find({
            where: { game: { id: gameId } },
            select: { guess: true, bulls: true, cows: true, createdAt: true },
            order: { createdAt: 'ASC' },
        });
        return attempts;
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(game_entity_1.Game)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(attempt_entity_1.Attempt)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GameService);
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
//# sourceMappingURL=game.service.js.map