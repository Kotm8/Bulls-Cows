import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
export declare class AnonymousSessionGuard implements CanActivate {
    private readonly users;
    constructor(users: Repository<User>);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
