import { RetryOptions } from './types';

export class RetryPolicy {
  private defaultOptions: RetryOptions = {
    maxRetries: 3,
    backoffFactorMs: 300,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504]
  };

  public async execute<T>(
    fn: () => Promise<T>,
    options?: Partial<RetryOptions>
  ): Promise<T> {
    const config = { ...this.defaultOptions, ...options };
    let attempt = 0;
    let lastError: unknown;

    while (attempt <= config.maxRetries) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        attempt++;

        if (attempt > config.maxRetries) {
          break;
        }

        const statusCode = typeof error === 'object' && error !== null && 'statusCode' in error
          ? (error as { statusCode?: number }).statusCode
          : undefined;

        if (statusCode && config.retryableStatusCodes && !config.retryableStatusCodes.includes(statusCode)) {
          // Do not retry non-retryable status code (e.g. 401, 403, 404)
          throw error;
        }

        const delay = config.backoffFactorMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}
