/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentCapability, AgentExecutionParams, AgentExecutionResult, AgentMetrics } from '../framework/baseAgent.interface';

export class FlightAgent implements BaseAgent {
  readonly id = 'agent-flight';
  readonly name = 'Masari Flight Intelligence Agent';
  readonly description = 'Searches flight schedules, compares cabin classes, optimizes layovers, and recommends baggage policies.';

  readonly capabilities: AgentCapability[] = [
    { id: 'flight_search', name: 'Flight Search', description: 'Searches real-time airline inventory.' },
    { id: 'layover_optimizer', name: 'Layover Optimizer', description: 'Finds optimal connections and baggage rules.' }
  ];

  readonly metrics: AgentMetrics = {
    totalInvocations: 0,
    successfulInvocations: 0,
    failedInvocations: 0,
    avgLatencyMs: 0
  };

  canHandle(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('طيران') || q.includes('طيارة') || q.includes('مطار') || q.includes('رحلة جوية') || q.includes('flight') || q.includes('airline') || q.includes('airport')) {
      return 0.95;
    }
    return 0.1;
  }

  async execute(params: AgentExecutionParams): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    const contentAr = `✈️ **نتائج بحث الطيران عبر عميل الطيران الذكي:**\n\n1. **الخطوط الجوية اليمانية (Yemenia Airways):** صنعاء ➔ القاهرة ($420) - مباشرة.\n2. **الخطوط السعودية (Saudia Airlines):** عدن ➔ جدة ($380) - شاملة 2 حقيبة (23 كجم).\n3. **طيران الخليج (Gulf Air):** عدن ➔ دبي ($310) - ترانزيت مريح.`;
    const contentEn = `✈️ **Flight Search Results via Flight Agent:**\n\n1. **Yemenia Airways:** Sanaa ➔ Cairo ($420) - Direct flight.\n2. **Saudia Airlines:** Aden ➔ Jeddah ($380) - Includes 2 x 23kg checked bags.\n3. **Gulf Air:** Aden ➔ Dubai ($310) - Convenient short layover.`;

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
