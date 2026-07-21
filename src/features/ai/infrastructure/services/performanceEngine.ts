/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIResponse } from '../models/aiModels';

export class PerformanceEngine {
  private static responseCache: Map<string, { response: AIResponse; expiresAt: number }> = new Map();
  private static promptCache: Map<string, string> = new Map();
  private static metrics = {
    totalRequestsProcessed: 0,
    cacheHits: 0,
    totalLatencyMs: 0,
    avgLatencyMs: 0
  };

  /**
   * Caching Manager: Retrieve cached AI Response if valid (5 minute TTL)
   */
  static getCachedResponse(cacheKey: string): AIResponse | null {
    const entry = this.responseCache.get(cacheKey);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.responseCache.delete(cacheKey);
      return null;
    }

    this.metrics.cacheHits++;
    return {
      ...entry.response,
      cached: true
    };
  }

  static cacheResponse(cacheKey: string, response: AIResponse, ttlMs: number = 300000) {
    this.responseCache.set(cacheKey, {
      response,
      expiresAt: Date.now() + ttlMs
    });
  }

  static recordMetrics(latencyMs: number) {
    this.metrics.totalRequestsProcessed++;
    this.metrics.totalLatencyMs += latencyMs;
    this.metrics.avgLatencyMs = Math.round(this.metrics.totalLatencyMs / this.metrics.totalRequestsProcessed);
  }

  static getPerformanceMetrics() {
    return {
      ...this.metrics,
      cacheHitRate: this.metrics.totalRequestsProcessed > 0
        ? `${((this.metrics.cacheHits / this.metrics.totalRequestsProcessed) * 100).toFixed(1)}%`
        : '0%'
    };
  }

  /**
   * Provider Timeout wrapper
   */
  static async executeWithTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> {
    let timeoutId: any;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`AI Provider execution timed out after ${timeoutMs}ms.`));
      }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
  }
}
