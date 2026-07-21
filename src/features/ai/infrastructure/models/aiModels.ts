/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProviderType = 'gemini' | 'openai' | 'azure_openai' | 'claude' | 'local_llm';

export type RoleType = 'system' | 'user' | 'assistant' | 'tool';

export interface AIProviderConfig {
  id: string;
  name: string;
  providerType: ProviderType;
  apiKey?: string;
  baseUrl?: string;
  modelName: string;
  temperature?: number;
  maxTokens?: number;
  enabled: boolean;
  isFallback?: boolean;
  priority: number;
}

export interface ChatMessageModel {
  id: string;
  role: RoleType;
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
  toolCalls?: AIToolCall[];
  toolResults?: AIToolResult[];
}

export interface AIToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
      required?: boolean;
    }>;
    required?: string[];
  };
  permissionRequired?: string;
}

export interface AIToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

export interface AIToolResult {
  toolCallId: string;
  name: string;
  result: any;
  success: boolean;
  error?: string;
}

export interface AIRequest {
  requestId: string;
  userId: string;
  userRole: 'user' | 'admin' | 'pilgrim' | 'agent';
  messages: ChatMessageModel[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: AIToolDefinition[];
  preferredProvider?: ProviderType;
  lang?: 'ar' | 'en';
  contextData?: Record<string, any>;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface AIResponse {
  requestId: string;
  provider: ProviderType;
  model: string;
  content: string;
  toolCalls?: AIToolCall[];
  tokenUsage?: TokenUsage;
  latencyMs: number;
  cached?: boolean;
  fallbackTriggered?: boolean;
  error?: string;
}

export interface PromptTemplate {
  id: string;
  category: 'system' | 'role' | 'travel' | 'booking' | 'wallet' | 'admin' | 'hajj' | 'umrah' | 'visa' | 'notification' | 'recommendation';
  version: string;
  templateAr: string;
  templateEn: string;
  variables: string[];
}

export interface SecurityPolicy {
  maxRequestsPerMinute: number;
  enableSanitization: boolean;
  blockedKeywords: string[];
  sensitivePatterns: RegExp[];
  allowedRoles: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userRole: string;
  requestId: string;
  provider: ProviderType;
  promptCategory?: string;
  toolsInvoked?: string[];
  sanitized: boolean;
  success: boolean;
  latencyMs: number;
  ipAddress?: string;
}
