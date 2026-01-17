import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

const COOKIE_NAME = process.env.COOKIE_NAME || 'anonymous_session_id';

@Injectable()
export class AnonymousSessionGuard implements CanActivate {
	constructor(@InjectRepository(User) private readonly users: Repository<User>) { }

	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const req = ctx.switchToHttp().getRequest<Request>();
		const res = ctx.switchToHttp().getResponse<Response>();

		let aid = (req as any).signedCookies?.[COOKIE_NAME] || (req as any).cookies?.[COOKIE_NAME];
		if (!aid) {
			aid = uuidv4();
			res.cookie(COOKIE_NAME, aid, {
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				signed: Boolean(process.env.COOKIE_SECRET),
				maxAge: 1000 * 60 * 60 * 24 * 365,
			});
		}

		let user = await this.users.findOne({ where: { id: aid } });
		if (!user) {
			user = this.users.create({ id: aid });
			await this.users.save(user);
		}

		(req as any).anonUser = user;
		return true;
	}
}