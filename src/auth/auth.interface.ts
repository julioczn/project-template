import type { Request } from 'express';

export type AuthUser = {
	_id: string;
	roles: string[];
	iat: number;
	exp: number;
};

export type RequestWithAuthUser = Request & {
	user: AuthUser;
};
