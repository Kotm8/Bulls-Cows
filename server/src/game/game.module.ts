import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Attempt } from '../attempt/attempt.entity';
import { User } from '../user/user.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Attempt, User])],
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}
