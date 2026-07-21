import { RateLimitOptions, UnifiedPlatformException } from './types';

export class RateLimiter {
  private timestamps: Map<string, number[]> = new Map();

  public checkLimit(providerId: string, options: RateLimitOptions): void {
    const now = Date.now();
    const windowStart = now - options.windowMs;

    let providerTimestamps = this.timestamps.get(providerId) || [];
    // filter timestamps within current sliding window
    providerTimestamps = providerTimestamps.filter((ts) => ts > windowStart);

    if (providerTimestamps.length >= options.maxRequestsPerWindow) {
      throw new UnifiedPlatformException(
        'RATE_LIMIT_EXCEEDED',
        `Rate limit exceeded for provider [${providerId}]. Max ${options.maxRequestsPerWindow} requests per ${options.windowMs}ms window.`,
        providerId,
        429
      );
    }

    providerTimestamps.push(now);
    this.timestamps.set(providerId, providerTimestamps);
  }

  public getRemainingRequests(providerId: string, options: RateLimitOptions): number {
    const now = Date.now();
    const windowStart = now - options.windowMs;
    const providerTimestamps = (this.timestamps.get(providerId) || []).filter((ts) => ts > windowStart);
    return Math.max(0, options.maxRequestsPerWindow - providerTimestamps.length);
  }
}
