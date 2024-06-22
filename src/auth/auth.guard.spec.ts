import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthGuard } from './auth.guard';
import { AuthUser } from './auth.interface';
import { describe, vitest, beforeEach, it, expect } from 'vitest';

describe('AuthGuard', () => {
	let authGuard: AuthGuard;

	const mockJwtService = {
		verify: vitest.fn(),
	};

	const mockConfigService = {
		getOrThrow: vitest.fn(),
	};

	const mockExecutionContext = (
		authorizationHeader?: string,
	): ExecutionContext =>
		({
			switchToHttp: () => ({
				getRequest: () => ({
					headers: {
						authorization: authorizationHeader,
					},
					user: {},
				}),
			}),
		}) as ExecutionContext;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthGuard,
				{ provide: JwtService, useValue: mockJwtService },
				{ provide: ConfigService, useValue: mockConfigService },
			],
		}).compile();

		authGuard = module.get<AuthGuard>(AuthGuard);
	});

	it('should be defined', () => {
		expect(authGuard).toBeDefined();
	});

	it('should throw UnauthorizedException if no token is provided', async () => {
		const context = mockExecutionContext();
		await expect(authGuard.canActivate(context)).rejects.toBeInstanceOf(
			UnauthorizedException,
		);
	});

	it('should throw UnauthorizedException if token is invalid', async () => {
		const context = mockExecutionContext('Bearer invalidToken');
		mockJwtService.verify.mockImplementation(() => {
			throw new Error('some error');
		});

		await expect(authGuard.canActivate(context)).rejects.toBeInstanceOf(
			UnauthorizedException,
		);
	});

	it('should return true and set user in request if token is valid', async () => {
		const validUser = {
			_id: 'system',
			roles: ['ADMIN'],
			iat: 1234567890,
			exp: 1987654321,
		} as AuthUser;

		const request = {
			headers: {
				authorization: 'Bearer validToken',
			},
			user: null,
		};

		const context = {
			switchToHttp: () => ({
				getRequest: () => request,
			}),
		} as ExecutionContext;

		mockJwtService.verify.mockReturnValue(validUser);
		mockConfigService.getOrThrow.mockReturnValue('secret');

		const result = await authGuard.canActivate(context);

		expect(result).toBe(true);
		expect(request.user).toEqual(validUser);
	});

	it('should throw UnauthorizedException if authorization header is not Bearer', async () => {
		const context = mockExecutionContext('Basic invalidToken');

		await expect(authGuard.canActivate(context)).rejects.toBeInstanceOf(
			UnauthorizedException,
		);
	});
});
