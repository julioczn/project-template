/* eslint-disable @typescript-eslint/ban-types */
import 'reflect-metadata';

import tracer from 'dd-trace';

tracer.init({
	logInjection: true,
	//
	// Debug traces locally
	//
	// experimental: { exporter: 'log' }
});
tracer.use('express');
tracer.use('pino');
tracer.use('http', { blocklist: ['/healthcheck'] });

export { tracer };

export function Trace(): MethodDecorator {
	return function (
		target: Object,
		propertyKey: string | symbol,
		descriptor: PropertyDescriptor,
	) {
		descriptor.value = tracer.wrap(
			`project-template.${target.constructor.name}.${propertyKey.toString()}`,
			descriptor.value,
		);
	};
}
