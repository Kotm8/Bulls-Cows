import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { User } from './user/user.entity';
import { Game } from './game/game.entity';
import { Attempt } from './attempt/attempt.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { AttemptModule } from './attempt/attempt.module';
import { AnonymousSessionGuard } from './auth/anonymous-session.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT!, 10),
			username: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
			autoLoadEntities: true,
			synchronize: true,
		}),
		TypeOrmModule.forFeature([User, Game, Attempt]),
		UserModule,
		GameModule,
		AttemptModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{ provide: APP_GUARD, useClass: AnonymousSessionGuard },
	],
})
export class AppModule { }
