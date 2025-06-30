import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	constructor(configService: ConfigService) {
		super({
			log:
				configService.get<string>('DATABASE_LOG') === 'true'
					? ['query', 'info', 'warn', 'error']
					: ['warn', 'error'],
		});
	}

	async onModuleInit(): Promise<void> {
		await this.$connect();
	}
}
