import { observe, updateActiveTrace } from '@langfuse/tracing';
import { langfuseSpanProcessor } from './instrumentation';
import type { RequestHandler, RequestEvent } from '@sveltejs/kit';

/**
 * Wraps a streaming response to automatically flush Langfuse traces after completion
 */
export function streamWithFlush(stream: ReadableStream): ReadableStream {
	return new ReadableStream({
		async start(controller) {
			const reader = stream.getReader();

			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					controller.enqueue(value);
				}
				controller.close();
			} catch (error) {
				controller.error(error);
			} finally {
				reader.releaseLock();
				await langfuseSpanProcessor.forceFlush();
			}
		}
	});
}

/**
 * Wraps a RequestHandler with Langfuse tracing
 */
export function withTracing(
	handler: RequestHandler,
	options?: {
		traceName?: string;
		updateTrace?: (event: RequestEvent) => {
			userId?: string;
			sessionId?: string;
			metadata?: Record<string, string | undefined>;
		};
		endOnExit?: boolean;
	}
): RequestHandler {
	return observe(
		async (event) => {
			if (options?.updateTrace) {
				const traceData = options.updateTrace(event);
				// Filter out undefined values from metadata
				const metadata = traceData.metadata
					? Object.fromEntries(
							Object.entries(traceData.metadata).filter(([, v]) => v !== undefined)
						)
					: undefined;

				updateActiveTrace({
					name: options.traceName,
					userId: traceData.userId,
					sessionId: traceData.sessionId,
					...(metadata && { metadata: metadata as Record<string, string> })
				});
			} else if (options?.traceName) {
				updateActiveTrace({ name: options.traceName });
			}

			return handler(event);
		},
		{
			endOnExit: options?.endOnExit ?? false
		}
	);
}
