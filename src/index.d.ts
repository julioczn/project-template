import '@nestjs/common';

declare module '@nestjs/common' {
	type LoggerParams = {
		msg: string;
		err?: Error;
		data?: Record<string, any>;
	};

	interface Logger {
		log(params: LoggerParams): void;
		error(params: LoggerParams): void;
		warn(params: LoggerParams): void;
		debug(params: LoggerParams): void;
		verbose(params: LoggerParams): void;
		fatal(params: LoggerParams): void;
	}
}
