/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIResponse, ChatMessageModel } from '../../infrastructure/models/aiModels';

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  permissionRequired?: string;
}

export interface AgentMetrics {
  totalInvocations: number;
  successfulInvocations: number;
  failedInvocations: number;
  avgLatencyMs: number;
  lastExecutedAt?: string;
}

export interface AgentExecutionParams {
  sessionId: string;
  userId: string;
  userRole: 'user' | 'admin' | 'pilgrim' | 'agent';
  query: string;
  lang: 'ar' | 'en';
  contextData: any;
  history?: ChatMessageModel[];
  parameters?: Record<string, any>;
}

export interface AgentExecutionResult {
  agentId: string;
  agentName: string;
  success: boolean;
  contentAr: string;
  contentEn: string;
  data?: any;
  actionExecuted?: {
    type: string;
    success: boolean;
    detailsAr: string;
    detailsEn: string;
  };
  suggestedNextAgents?: string[];
  latencyMs: number;
  error?: string;
}

export interface BaseAgent {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly capabilities: AgentCapability[];
  readonly metrics: AgentMetrics;

  canHandle(query: string, context: any): number; // Returns confidence score 0.0 - 1.0
  execute(params: AgentExecutionParams): Promise<AgentExecutionResult>;
}
