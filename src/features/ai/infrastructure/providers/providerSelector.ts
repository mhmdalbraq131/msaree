/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider, AIService } from './aiProvider.interface';
import { AIProviderConfig, AIRequest, AIResponse, ProviderType } from '../models/aiModels';
import { GeminiAdapter } from './adapters/geminiAdapter';
import { OpenAiAdapter } from './adapters/openAiAdapter';
import { AzureOpenAiAdapter } from './adapters/azureOpenAiAdapter';
import { ClaudeAdapter } from './adapters/claudeAdapter';
import { LocalLlmAdapter } from './adapters/localLlmAdapter';

export class ProviderSelector implements AIService {
  private providers: Map<ProviderType, AIProvider> = new Map();
  private providerConfigs: AIProviderConfig[] = [
    {
      id: 'cfg-gemini',
      name: 'Google Gemini 3.5 Flash (Primary Default)',
      providerType: 'gemini',
      modelName: 'gemini-3.5-flash',
      enabled: true,
      priority: 1
    },
    {
      id: 'cfg-openai',
      name: 'OpenAI GPT-4o (Secondary High Capacity)',
      providerType: 'openai',
      modelName: 'gpt-4o',
      enabled: true,
      priority: 2
    },
    {
      id: 'cfg-azure',
      name: 'Azure OpenAI Enterprise Portal',
      providerType: 'azure_openai',
      modelName: 'azure-gpt-4o',
      enabled: true,
      priority: 3
    },
    {
      id: 'cfg-claude',
      name: 'Anthropic Claude 3.5 Sonnet',
      providerType: 'claude',
      modelName: 'claude-3-5-sonnet',
      enabled: true,
      priority: 4
    },
    {
      id: 'cfg-local',
      name: 'Open-Source Local Llama-3-70B Air-Gapped',
      providerType: 'local_llm',
      modelName: 'llama-3-70b-instruct',
      enabled: true,
      isFallback: true,
      priority: 5
    }
  ];

  constructor() {
    this.initAdapters();
  }

  private initAdapters() {
    this.providerConfigs.forEach(cfg => {
      switch (cfg.providerType) {
        case 'gemini':
          this.providers.set('gemini', new GeminiAdapter(cfg));
          break;
        case 'openai':
          this.providers.set('openai', new OpenAiAdapter(cfg));
          break;
        case 'azure_openai':
          this.providers.set('azure_openai', new AzureOpenAiAdapter(cfg));
          break;
        case 'claude':
          this.providers.set('claude', new ClaudeAdapter(cfg));
          break;
        case 'local_llm':
          this.providers.set('local_llm', new LocalLlmAdapter(cfg));
          break;
      }
    });
  }

  getActiveProviders(): AIProviderConfig[] {
    return this.providerConfigs.filter(c => c.enabled);
  }

  getProvider(type?: ProviderType): AIProvider {
    const selectedType = type || 'gemini';
    const provider = this.providers.get(selectedType);
    if (provider) return provider;
    // Default back to gemini
    return this.providers.get('gemini')!;
  }

  /**
   * Process request with Automatic Retry & Fallback Engine
   */
  async processRequest(request: AIRequest): Promise<AIResponse> {
    const primaryType = request.preferredProvider || 'gemini';
    const primaryProvider = this.getProvider(primaryType);

    try {
      if (await primaryProvider.isHealthy()) {
        return await primaryProvider.generateResponse(request);
      }
      throw new Error(`Primary provider ${primaryType} is currently unavailable.`);
    } catch (primaryErr) {
      console.warn(`[AI Fallback Engine] Provider ${primaryType} failed. Triggering fallback chain...`, primaryErr);
      
      // Fallback Strategy: Loop through active fallback providers sorted by priority
      const fallbackConfigs = this.providerConfigs
        .filter(c => c.enabled && c.providerType !== primaryType)
        .sort((a, b) => a.priority - b.priority);

      for (const fallbackCfg of fallbackConfigs) {
        try {
          const fallbackProvider = this.getProvider(fallbackCfg.providerType);
          if (await fallbackProvider.isHealthy()) {
            const response = await fallbackProvider.generateResponse(request);
            return {
              ...response,
              fallbackTriggered: true
            };
          }
        } catch (fbErr) {
          console.warn(`[AI Fallback Engine] Secondary provider ${fallbackCfg.providerType} failed.`, fbErr);
        }
      }

      // If all fail, return graceful AI error response
      return {
        requestId: request.requestId,
        provider: primaryType,
        model: 'emergency-safe-mode',
        content: request.lang === 'ar'
          ? 'تم تفعيل نمط الأمان المحلي للحفاظ على استقرار الخدمة في مساري.'
          : 'Local emergency safe mode engaged to preserve platform stability.',
        latencyMs: 10,
        error: 'All AI providers exhausted.'
      };
    }
  }
}
