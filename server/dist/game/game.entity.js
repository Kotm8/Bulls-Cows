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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.GameStatus = void 0;
const typeorm_1 = require("typeorm");
const attempt_entity_1 = require("../attempt/attempt.entity");
const user_entity_1 = require("../user/user.entity");
var GameStatus;
(function (GameStatus) {
    GameStatus["ACTIVE"] = "active";
    GameStatus["WON"] = "won";
    GameStatus["ABANDONED"] = "abandoned";
})(GameStatus || (exports.GameStatus = GameStatus = {}));
let Game = class Game {
    id;
    user;
    secretNumber;
    status;
    attempts;
    createdAt;
    updatedAt;
    attemptNumber;
};
exports.Game = Game;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Game.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.games, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Game.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Game.prototype, "secretNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: GameStatus, default: GameStatus.ACTIVE }),
    __metadata("design:type", String)
], Game.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attempt_entity_1.Attempt, (attempt) => attempt.game, { cascade: true }),
    __metadata("design:type", Array)
], Game.prototype, "attempts", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Game.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Game.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Game.prototype, "attemptNumber", void 0);
exports.Game = Game = __decorate([
    (0, typeorm_1.Entity)('games')
], Game);
//# sourceMappingURL=game.entity.js.map