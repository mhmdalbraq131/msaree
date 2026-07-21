/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider } from '../aiProvider.interface';
import { AIProviderConfig, AIRequest, AIResponse, ProviderType } from '../../models/aiModels';

export class LocalLlmAdapter implements AIProvider {
  readonly id = 'provider-local-llm';
  readonly providerType: ProviderType = 'local_llm';

  constructor(public readonly config: AIProviderConfig) {}

  async isHealthy(): Promise<boolean> {
    return this.config.enabled;
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const isAr = request.lang === 'ar';
    const lastUserMsg = request.messages[request.messages.length - 1]?.content || '';

    const responseText = isAr
      ? `[Local Llama-3-70B On-Premise] معالجة داخلية محمية بالكامل: ${lastUserMsg.substring(0, 80)}...`
      : `[Local Llama-3-70B On-Premise] On-premise air-gapped processing: ${lastUserMsg.substring(0, 80)}...`;

    const latencyMs = Date.now() - startTime + Math.floor(Math.random() * 50 + 20);

    return {
      requestId: request.requestId,
      provider: 'local_llm',
      model: this.config.modelName || 'llama-3-70b-instruct-local',
      content: responseText,
      latencyMs,
      tokenUsage: {
        promptTokens: Math.floor(lastUserMsg.length / 4) + 40,
        completionTokens: Math.floor(responseText.length / 4) + 15,
        totalTokens: Math.floor((lastUserMsg.length + responseText.length) / 4) + 55,
        estimatedCostUsd: 0.00000 // Zero API cost for local on-premise execution
      }
    };
  }
}
