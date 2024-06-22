import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import request from 'supertest';
import { describe, beforeEach, it } from 'vitest';

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/healthcheck (GET)', () => {
		return request(app.getHttpServer())
			.get('/healthcheck')
			.expect(200)
			.expect('Hello World!');
	});
});
