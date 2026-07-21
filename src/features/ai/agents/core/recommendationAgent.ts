/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentCapability, AgentExecutionParams, AgentExecutionResult, AgentMetrics } from '../framework/baseAgent.interface';

export class RecommendationAgent implements BaseAgent {
  readonly id = 'agent-recommendation';
  readonly name = 'Masari Personalization & Offer Agent';
  readonly description = 'Generates AI personalized travel deals, offer optimizations, destination rankings, and budget-matched trips.';

  readonly capabilities: AgentCapability[] = [
    { id: 'personalized_deals', name: 'Personalized Travel Deals', description: 'Ranks top travel destinations matching user profile.' }
  ];

  readonly metrics: AgentMetrics = {
    totalInvocations: 0,
    successfulInvocations: 0,
    failedInvocations: 0,
    avgLatencyMs: 0
  };

  canHandle(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('ترشيح') || q.includes('توصية') || q.includes('عروض') || q.includes('أفضل') || q.includes('خصم') || q.includes('recommend') || q.includes('deals') || q.includes('best') || q.includes('offer')) {
      return 0.88;
    }
    return 0.1;
  }

  async execute(params: AgentExecutionParams): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    const contentAr = `🌟 **التوصيات والعروض المخصصة لك عبر عميل التوصيات الذكية:**\n\n1. **باقة القاهرة الشاملة:** خصم حقيقي 15% لمشتركي مساري الفئة الذهبية.\n2. **توصية الفنادق:** فندق شيراتون مكة بخصم $40/ليلة للقيام برحلات العمرة المرتقبة.\n3. **عروض نقاط المكافآت:** يمكنك تحويل 400 نقطة لمبلغ $12 خصم فوري.`;
    const contentEn = `🌟 **Personalized Recommendations via Recommendation Agent:**\n\n1. **Comprehensive Cairo Deal:** 15% discount for Gold tier MASARI members.\n2. **Hotel Choice:** Sheraton Makkah with $40/night savings for upcoming Umrah trips.\n3. **Reward Points Conversion:** Convert 400 pts into an instant $12 off.`;

    return {
      agentId: this.id,
      agentName: this.name,
      success: true,
      contentAr,
      contentEn,
      latencyMs: Date.now() - startTime
    };
  }
}
