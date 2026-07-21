import { ResponseLog } from './types';

export type ResponseInterceptorHandler = (
  providerId: string,
  response: Response,
  durationMs: number
) => Promise<Response> | Response;

export class ResponseInterceptor {
  private handlers: ResponseInterceptorHandler[] = [];
  private logs: ResponseLog[] = [];

  public use(handler: ResponseInterceptorHandler): void {
    this.handlers.push(handler);
  }

  public async execute(
    providerId: string,
    response: Response,
    durationMs: number
  ): Promise<Response> {
    let currentResponse = response;

    for (const handler of this.handlers) {
      currentResponse = await handler(providerId, currentResponse, durationMs);
    }

    this.logs.push({
      requestId: `res-${Date.now()}`,
      providerId,
      statusCode: currentResponse.status,
      durationMs,
      timestamp: new Date().toISOString(),
      success: currentResponse.ok
    });

    if (this.logs.length > 100) {
      this.logs.shift();
    }

    return currentResponse;
  }

  public getLogs(): ResponseLog[] {
    return [...this.logs];
  }
}
