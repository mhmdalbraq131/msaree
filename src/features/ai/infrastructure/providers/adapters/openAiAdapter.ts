/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider } from '../aiProvider.interface';
import { AIProviderConfig, AIRequest, AIResponse, ProviderType } from '../../models/aiModels';

export class OpenAiAdapter implements AIProvider {
  readonly id = 'provider-openai';
  readonly providerType: ProviderType = 'openai';

  constructor(public readonly config: AIProviderConfig) {}

  async isHealthy(): Promise<boolean> {
    return this.config.enabled;
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const isAr = request.lang === 'ar';
    const lastUserMsg = request.messages[request.messages.length - 1]?.content || '';

    const responseText = isAr
      ? `[OpenAI GPT-4o] تم معالجة استفسارك المالي/السياحي: ${lastUserMsg.substring(0, 80)}...`
      : `[OpenAI GPT-4o] Successfully processed travel query: ${lastUserMsg.substring(0, 80)}...`;

    const latencyMs = Date.now() - startTime + Math.floor(Math.random() * 100 + 40);

    return {
      requestId: request.requestId,
      provider: 'openai',
      model: this.config.modelName || 'gpt-4o',
      content: responseText,
      latencyMs,
      tokenUsage: {
        promptTokens: Math.floor(lastUserMsg.length / 4) + 60,
        completionTokens: Math.floor(responseText.length / 4) + 25,
        totalTokens: Math.floor((lastUserMsg.length + responseText.length) / 4) + 85,
        estimatedCostUsd: 0.00045
      }
    };
  }
}
