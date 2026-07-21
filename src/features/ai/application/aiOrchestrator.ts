/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProviderSelector } from '../infrastructure/providers/providerSelector';
import { PromptManager } from '../infrastructure/prompts/promptManager';
import { MemoryManager } from '../infrastructure/memory/memoryManager';
import { ContextBuilder } from '../infrastructure/services/contextBuilder';
import { ToolExecutionEngine } from '../infrastructure/tools/toolExecutionEngine';
import { SecurityEngine } from '../infrastructure/security/securityEngine';
import { PerformanceEngine } from '../infrastructure/services/performanceEngine';
import { AIRequest, AIResponse, ChatMessageModel, ProviderType } from '../infrastructure/models/aiModels';
import { MultiAgentOrchestrator, MultiAgentOrchestrationResult } from '../agents/orchestration/agentOrchestrator';

export interface ExecuteAiTaskParams {
  sessionId: string;
  userId: string;
  userRole?: 'user' | 'admin' | 'pilgrim' | 'agent';
  query: string;
  lang?: 'ar' | 'en';
  preferredProvider?: ProviderType;
  bookings?: any[];
  setBookings?: (b: any[]) => void;
  wallet?: any;
  setWallet?: (w: any) => void;
  currency?: string;
  formatCurrency?: (val: number) => string;
}

export class EnterpriseAiOrchestrator {
  private static providerSelector = new ProviderSelector();

  static async processUserQuery(params: ExecuteAiTaskParams): Promise<{
    response: AIResponse;
    actionExecuted?: {
      type: string;
      success: boolean;
      detailsAr: string;
      detailsEn: string;
    };
    context: any;
    multiAgentResult?: MultiAgentOrchestrationResult;
  }> {
    const startTime = Date.now();
    const lang = params.lang || 'ar';
    const isAr = lang === 'ar';
    const role = params.userRole || 'user';

    // 1. Rate Limiting Security Check
    const rateCheck = SecurityEngine.checkRateLimit(params.userId);
    if (!rateCheck.allowed) {
      return {
        response: {
          requestId: `req-rate-${Date.now()}`,
          provider: 'gemini',
          model: 'security-rate-limiter',
          content: isAr 
            ? 'تجاوزت الحد المسموح به من الاستعلامات في الدقيقة. يرجى الانتظار قليلاً.' 
            : 'Rate limit exceeded. Please wait a moment before sending more queries.',
          latencyMs: 5,
          error: 'RATE_LIMIT_EXCEEDED'
        },
        context: {}
      };
    }

    // 2. Input Sanitization & Injection Protection
    const inputSanitized = SecurityEngine.sanitizeInput(params.query);
    if (inputSanitized.isMalicious) {
      SecurityEngine.logAudit({
        userId: params.userId,
        userRole: role,
        requestId: `req-sec-${Date.now()}`,
        provider: params.preferredProvider || 'gemini',
        sanitized: true,
        success: false,
        latencyMs: Date.now() - startTime
      });

      return {
        response: {
          requestId: `req-sec-${Date.now()}`,
          provider: 'gemini',
          model: 'security-filter',
          content: isAr 
            ? 'عذراً، تم حظر طلبك بواسطة درع الأمان لمنصة مساري.' 
            : 'Security Alert: Prompt rejected by MASARI Platform Firewall.',
          latencyMs: 10,
          error: 'PROMPT_INJECTION_DETECTED'
        },
        context: {}
      };
    }

    // 3. Multi-Agent System Execution Pipeline
    const enterpriseContext = ContextBuilder.buildContext({
      userId: params.userId,
      userRole: role,
      bookings: params.bookings,
      wallet: params.wallet,
      currency: params.currency
    });

    const agentOrchestration = await MultiAgentOrchestrator.orchestrate({
      sessionId: params.sessionId,
      userId: params.userId,
      userRole: role,
      query: inputSanitized.sanitizedText,
      lang,
      contextData: enterpriseContext
    });

    // 4. Conversation Memory Management
    const sessionMemory = MemoryManager.getOrCreateSession(params.sessionId, params.userId, lang);
    const userMsgModel: ChatMessageModel = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputSanitized.sanitizedText,
      timestamp: new Date().toISOString()
    };
    MemoryManager.addMessage(params.sessionId, userMsgModel);

    // 5. Caching Check
    const cacheKey = `${params.sessionId}_${inputSanitized.sanitizedText.trim().toLowerCase()}`;
    const cachedRes = PerformanceEngine.getCachedResponse(cacheKey);
    if (cachedRes) {
      return {
        response: cachedRes,
        context: enterpriseContext,
        multiAgentResult: agentOrchestration
      };
    }

    // 6. System Prompt & Render
    const systemCorePrompt = PromptManager.renderPrompt('system_core', {
      userId: params.userId,
      userName: enterpriseContext.user.name,
      lang
    }, lang);

    const rolePrompt = PromptManager.renderPrompt(role === 'admin' ? 'role_admin' : 'role_user', {
      userName: enterpriseContext.user.name
    }, lang);

    // 7. Tool Definition Attachment
    const availableTools = ToolExecutionEngine.getToolDefinitions();

    // 8. Formulate AI Infrastructure Request
    const aiRequest: AIRequest = {
      requestId: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: params.userId,
      userRole: role,
      messages: sessionMemory.shortTermMessages,
      systemPrompt: `${systemCorePrompt}\n${rolePrompt}`,
      tools: availableTools,
      preferredProvider: params.preferredProvider || 'gemini',
      lang,
      contextData: enterpriseContext
    };

    // 9. Execute Process Request via Multi-Provider Engine with Timeout
    let aiResponse: AIResponse;
    try {
      aiResponse = await PerformanceEngine.executeWithTimeout(
        this.providerSelector.processRequest(aiRequest),
        6000
      );
      // Enhance content with Multi-Agent Orchestrator Synthesis
      if (agentOrchestration.combinedContentAr && isAr) {
        aiResponse.content = agentOrchestration.combinedContentAr;
      } else if (agentOrchestration.combinedContentEn && !isAr) {
        aiResponse.content = agentOrchestration.combinedContentEn;
      }
    } catch (err: any) {
      aiResponse = {
        requestId: aiRequest.requestId,
        provider: 'gemini',
        model: 'emergency-fallback',
        content: isAr ? agentOrchestration.combinedContentAr : agentOrchestration.combinedContentEn,
        latencyMs: Date.now() - startTime,
        error: err.message
      };
    }

    // 10. Record Metrics & Audit Log
    const totalLatency = Date.now() - startTime;
    PerformanceEngine.recordMetrics(totalLatency);
    SecurityEngine.logAudit({
      userId: params.userId,
      userRole: role,
      requestId: aiRequest.requestId,
      provider: aiResponse.provider,
      sanitized: false,
      success: !aiResponse.error,
      latencyMs: totalLatency
    });

    // Cache successful response
    if (!aiResponse.error) {
      PerformanceEngine.cacheResponse(cacheKey, aiResponse);
    }

    return {
      response: aiResponse,
      actionExecuted: agentOrchestration.actionExecuted,
      context: enterpriseContext,
      multiAgentResult: agentOrchestration
    };
  }
}
