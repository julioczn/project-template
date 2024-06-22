import { Test } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('AppController', () => {
	let appController: AppController;

	beforeEach(async () => {
		const app = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
		}).compile();

		appController = app.get<AppController>(AppController);
	});

	it('should return "Hello World!"', () => {
		expect(appController.getHello()).toBe('Hello World!');
	});
});
