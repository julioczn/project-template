import './shared/trace/trace';

import { patchNestjsSwagger, ZodValidationPipe } from '@anatine/zod-nestjs';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/http/http-exception.filter';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
	});
	app.useLogger(app.get(Logger));

	app.enableCors();

	app.use(helmet());
	app.use(compression());

	app.useBodyParser('json', { limit: '1mb' });
	app.useBodyParser('urlencoded', { limit: '1mb', exetended: true });

	app.useGlobalPipes(new ZodValidationPipe());
	app.useGlobalFilters(new AllExceptionsFilter());

	patchNestjsSwagger();

	const config = new DocumentBuilder()
		.setTitle('App Name')
		.setVersion('1.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				name: 'Authorization',
				description: 'Enter JWT token',
				in: 'header',
			},
			'AUTH_TOKEN',
		)
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	await app.listen(3000);
}

void bootstrap();
