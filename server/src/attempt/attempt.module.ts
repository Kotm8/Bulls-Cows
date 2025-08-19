import { Module } from '@nestjs/common';
import { AttemptController } from './attempt.controller';
import { AttemptService } from './attempt.service';

@Module({
  controllers: [AttemptController],
  providers: [AttemptService]
})
export class AttemptModule {}
