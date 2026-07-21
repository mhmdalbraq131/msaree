/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentCapability, AgentExecutionParams, AgentExecutionResult, AgentMetrics } from '../framework/baseAgent.interface';

export class BusAgent implements BaseAgent {
  readonly id = 'agent-bus';
  readonly name = 'Masari VIP Land Transit & Bus Agent';
  readonly description = 'Searches intercity VIP bus schedules, seat availability, routes, and comfortable transit amenities.';

  readonly capabilities: AgentCapability[] = [
    { id: 'bus_search', name: 'Bus Search', description: 'Finds land transit bus routes.' }
  ];

  readonly metrics: AgentMetrics = {
    totalInvocations: 0,
    successfulInvocations: 0,
    failedInvocations: 0,
    avgLatencyMs: 0
  };

  canHandle(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('باص') || q.includes('حافلة') || q.includes('برياً') || q.includes('الرويشان') || q.includes('bus') || q.includes('coach') || q.includes('transit')) {
      return 0.95;
    }
    return 0.1;
  }

  async execute(params: AgentExecutionParams): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    const contentAr = `🚌 **رحلات الباصات المتاحة عبر عميل النقل البري:**\n\n1. **شركة الرويشان VIP:** صنعاء ➔ عدن | السعر: $35 | الموعد: 7:00 صباحاً (إنترنت + مقاعد مريحة).\n2. **شركة البركة الفاخرة:** صنعاء ➔ المكلا | السعر: $45 | الموعد: 8:30 مساءً.`;
    const contentEn = `🚌 **Bus Routes Available via Bus Agent:**\n\n1. **Al-Rowaishan VIP:** Sanaa ➔ Aden | Price: $35 | Time: 7:00 AM (Free WiFi + Reclining seats).\n2. **Al-Baraka Executive:** Sanaa ➔ Mukalla | Price: $45 | Time: 8:30 PM.`;

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
