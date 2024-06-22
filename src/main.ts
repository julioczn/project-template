import './shared/trace/trace';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './pipes/http-exception.filter';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
	});
	app.useLogger(app.get(Logger));

	const configService = app.get(ConfigService);

	app.enableCors({
		origin: configService.getOrThrow<string>('CORS_ORIGIN'),
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	});
	app.use(helmet());
	app.use(compression());
	app.useBodyParser('json', { limit: '1mb' });
	app.useBodyParser('urlencoded', { limit: '1mb', exetended: true });
	app.useGlobalFilters(new AllExceptionsFilter());

	const config = new DocumentBuilder()
		.setTitle('Arena Community AI')
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
