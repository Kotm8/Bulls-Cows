import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AnonymousSessionGuard } from 'src/auth/anonymous-session.guard';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, AnonymousSessionGuard],
  exports: [TypeOrmModule, UserService, AnonymousSessionGuard],
})
export class UserModule {}
