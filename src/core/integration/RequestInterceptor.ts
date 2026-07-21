import { RequestLog } from './types';

export type RequestInterceptorHandler = (
  providerId: string,
  url: string,
  options: RequestInit
) => Promise<{ url: string; options: RequestInit }> | { url: string; options: RequestInit };

export class RequestInterceptor {
  private handlers: RequestInterceptorHandler[] = [];
  private logs: RequestLog[] = [];

  public use(handler: RequestInterceptorHandler): void {
    this.handlers.push(handler);
  }

  public async execute(
    providerId: string,
    url: string,
    options: RequestInit
  ): Promise<{ url: string; options: RequestInit }> {
    let currentUrl = url;
    let currentOptions = { ...options };

    for (const handler of this.handlers) {
      const result = await handler(providerId, currentUrl, currentOptions);
      currentUrl = result.url;
      currentOptions = result.options;
    }

    // Default request logging
    this.logs.push({
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      providerId,
      endpoint: currentUrl,
      method: currentOptions.method || 'GET',
      timestamp: new Date().toISOString(),
      headers: (currentOptions.headers as Record<string, string>) || {}
    });

    if (this.logs.length > 100) {
      this.logs.shift(); // keep log buffer manageable
    }

    return { url: currentUrl, options: currentOptions };
  }

  public getLogs(): RequestLog[] {
    return [...this.logs];
  }
}
