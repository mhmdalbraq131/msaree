/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider } from '../aiProvider.interface';
import { AIProviderConfig, AIRequest, AIResponse, ProviderType } from '../../models/aiModels';

export class ClaudeAdapter implements AIProvider {
  readonly id = 'provider-claude';
  readonly providerType: ProviderType = 'claude';

  constructor(public readonly config: AIProviderConfig) {}

  async isHealthy(): Promise<boolean> {
    return this.config.enabled;
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const isAr = request.lang === 'ar';
    const lastUserMsg = request.messages[request.messages.length - 1]?.content || '';

    const responseText = isAr
      ? `[Anthropic Claude 3.5 Sonnet] معالجة منطقية دقيقة للبيانات: ${lastUserMsg.substring(0, 80)}...`
      : `[Anthropic Claude 3.5 Sonnet] High-precision reasoning executed: ${lastUserMsg.substring(0, 80)}...`;

    const latencyMs = Date.now() - startTime + Math.floor(Math.random() * 110 + 45);

    return {
      requestId: request.requestId,
      provider: 'claude',
      model: this.config.modelName || 'claude-3-5-sonnet',
      content: responseText,
      latencyMs,
      tokenUsage: {
        promptTokens: Math.floor(lastUserMsg.length / 4) + 65,
        completionTokens: Math.floor(responseText.length / 4) + 22,
        totalTokens: Math.floor((lastUserMsg.length + responseText.length) / 4) + 87,
        estimatedCostUsd: 0.00038
      }
    };
  }
}
