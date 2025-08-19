import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';

@Controller('user')
export class UserController {
	@Get('me')
	getCurrentUser(@Req() req: Request) {
		return (req as any).anonUser;
	}
}