/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider } from '../aiProvider.interface';
import { AIProviderConfig, AIRequest, AIResponse, ProviderType } from '../../models/aiModels';

export class AzureOpenAiAdapter implements AIProvider {
  readonly id = 'provider-azure-openai';
  readonly providerType: ProviderType = 'azure_openai';

  constructor(public readonly config: AIProviderConfig) {}

  async isHealthy(): Promise<boolean> {
    return this.config.enabled;
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const isAr = request.lang === 'ar';
    const lastUserMsg = request.messages[request.messages.length - 1]?.content || '';

    const responseText = isAr
      ? `[Azure OpenAI Service] معالجة مؤمنة للشركات: ${lastUserMsg.substring(0, 80)}...`
      : `[Azure OpenAI Service] Enterprise secure processing: ${lastUserMsg.substring(0, 80)}...`;

    const latencyMs = Date.now() - startTime + Math.floor(Math.random() * 90 + 35);

    return {
      requestId: request.requestId,
      provider: 'azure_openai',
      model: this.config.modelName || 'azure-gpt-4o-deployment',
      content: responseText,
      latencyMs,
      tokenUsage: {
        promptTokens: Math.floor(lastUserMsg.length / 4) + 55,
        completionTokens: Math.floor(responseText.length / 4) + 20,
        totalTokens: Math.floor((lastUserMsg.length + responseText.length) / 4) + 75,
        estimatedCostUsd: 0.00040
      }
    };
  }
}
