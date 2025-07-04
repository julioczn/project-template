import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller('/healthcheck')
@ApiTags('healthcheck')
@ApiResponse({ status: 200 })
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello() {
		return this.appService.getHello();
	}
}
