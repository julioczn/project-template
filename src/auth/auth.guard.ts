import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthUser, RequestWithAuthUser } from './auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest() as RequestWithAuthUser;
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException();
		}

		try {
			const user = this.jwtService.verify(token, {
				secret: this.configService.getOrThrow('JWT_SECRET'),
			}) as AuthUser;
			request.user = user;
		} catch {
			throw new UnauthorizedException();
		}

		return true;
	}

	private extractTokenFromHeader(request: RequestWithAuthUser) {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : null;
	}
}
