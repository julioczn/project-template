import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const responseJson = this.buildResponseJson(exception);
		if (responseJson.status >= 400 && responseJson.status < 500) {
			Logger.warn({
				msg: 'AllExceptionsFilter.warn',
				err: exception,
				data: responseJson,
			});
		}
		if (responseJson.status >= 500) {
			Logger.error({
				msg: 'AllExceptionsFilter.error',
				err: exception,
				data: responseJson,
			});
		}
		response.status(responseJson.status).json(responseJson);
	}

	private buildResponseJson(exception: unknown) {
		if (exception instanceof HttpException) {
			const status = exception.getStatus();
			const response = exception.getResponse();
			if (response instanceof Object) {
				return { status, ...response };
			}
			return { status, message: response };
		}
		return {
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'Internal server error',
		};
	}
}
