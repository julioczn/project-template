import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (config) => {
				if ('NODE_CONFIG' in config) {
					return {
						...JSON.parse(config.NODE_CONFIG),
						...config,
					};
				}
				return config;
			},
		}),
		LoggerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const level = configService.get<string>('LOG_LEVEL') ?? 'info';
				const pretty = configService.get<string>('LOG_PRETTY') ?? 'false';
				return {
					pinoHttp: {
						level,
						transport:
							pretty === 'true' ? { target: 'pino-pretty' } : undefined,
					},
				};
			},
		}),
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				throttlers: [
					{
						ttl: configService.getOrThrow<number>('RATE_LIMIT_TTL', 60 * 1000),
						limit: configService.getOrThrow<number>(
							'RATE_LIMIT_MAX_REQUESTS',
							100,
						),
					},
				],
			}),
			inject: [ConfigService],
		}),
		JwtModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
