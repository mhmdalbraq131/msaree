/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProviderConfig, AIRequest, AIResponse, ProviderType } from '../models/aiModels';

export interface AIProvider {
  readonly id: string;
  readonly providerType: ProviderType;
  readonly config: AIProviderConfig;

  isHealthy(): Promise<boolean>;
  
  generateResponse(request: AIRequest): Promise<AIResponse>;
  
  generateStreamResponse?(
    request: AIRequest,
    onChunk: (chunk: string) => void
  ): Promise<AIResponse>;
}

export interface AIService {
  processRequest(request: AIRequest): Promise<AIResponse>;
  getProvider(type?: ProviderType): AIProvider;
  getActiveProviders(): AIProviderConfig[];
}
