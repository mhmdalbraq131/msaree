/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider } from '../aiProvider.interface';
import { AIProviderConfig, AIRequest, AIResponse, ProviderType } from '../../models/aiModels';

export class GeminiAdapter implements AIProvider {
  readonly id = 'provider-gemini';
  readonly providerType: ProviderType = 'gemini';

  constructor(public readonly config: AIProviderConfig) {}

  async isHealthy(): Promise<boolean> {
    return this.config.enabled;
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const isAr = request.lang === 'ar';
    const lastUserMsg = request.messages[request.messages.length - 1]?.content || '';

    // Simulate provider execution with structured token usage & low latency
    const responseText = isAr
      ? `[Gemini 3.5 Flash] تم معالجة الطلب لـ (${request.userId}): ${lastUserMsg.substring(0, 80)}...`
      : `[Gemini 3.5 Flash] Processed query for (${request.userId}): ${lastUserMsg.substring(0, 80)}...`;

    const latencyMs = Date.now() - startTime + Math.floor(Math.random() * 80 + 30);

    return {
      requestId: request.requestId,
      provider: 'gemini',
      model: this.config.modelName || 'gemini-3.5-flash',
      content: responseText,
      latencyMs,
      tokenUsage: {
        promptTokens: Math.floor(lastUserMsg.length / 4) + 50,
        completionTokens: Math.floor(responseText.length / 4) + 20,
        totalTokens: Math.floor((lastUserMsg.length + responseText.length) / 4) + 70,
        estimatedCostUsd: 0.00015
      }
    };
  }

  async generateStreamResponse(request: AIRequest, onChunk: (chunk: string) => void): Promise<AIResponse> {
    const fullResponse = await this.generateResponse(request);
    const chunks = fullResponse.content.match(/.{1,15}/g) || [fullResponse.content];
    
    for (const chunk of chunks) {
      onChunk(chunk);
      await new Promise(res => setTimeout(res, 20));
    }

    return fullResponse;
  }
}
