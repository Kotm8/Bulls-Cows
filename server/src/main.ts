import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser(process.env.COOKIE_SECRET || 'dev-secret'));
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.enableCors({
		origin: process.env.FRONTEND_URL?.split(',') || [],
		credentials: true,
	});

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
