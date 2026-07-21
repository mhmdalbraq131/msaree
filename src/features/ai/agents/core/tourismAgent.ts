/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentCapability, AgentExecutionParams, AgentExecutionResult, AgentMetrics } from '../framework/baseAgent.interface';

export class TourismAgent implements BaseAgent {
  readonly id = 'agent-tourism';
  readonly name = 'Masari Tourism & Experiences Agent';
  readonly description = 'Recommends guided tour packages, local sightseeing activities, and cultural experiences.';

  readonly capabilities: AgentCapability[] = [
    { id: 'tourism_search', name: 'Tourism Packages', description: 'Searches curated leisure and cultural tours.' }
  ];

  readonly metrics: AgentMetrics = {
    totalInvocations: 0,
    successfulInvocations: 0,
    failedInvocations: 0,
    avgLatencyMs: 0
  };

  canHandle(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('سياحة') || q.includes('جولة') || q.includes('رحلة سياحية') || q.includes('معالم') || q.includes('tourism') || q.includes('tour') || q.includes('sightseeing') || q.includes('package')) {
      return 0.9;
    }
    return 0.1;
  }

  async execute(params: AgentExecutionParams): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    const contentAr = `🌴 **باقات السياحة والجولات عبر عميل السياحة:**\n\n1. **جولة القاهرة والأهرامات (4 أيام):** $350 | طيران + فندق 4 نجوم + مرشد سياحي.\n2. **رحلة دبي وسفاري الصحراء (5 أيام):** $620 | تشمل تذاكر المعالم والسيارة الخاصة.`;
    const contentEn = `🌴 **Tourism & Experience Packages via Tourism Agent:**\n\n1. **Cairo & Pyramids Discovery (4 Days):** $350 | Flights + 4-Star Hotel + Tour Guide.\n2. **Dubai City & Desert Safari (5 Days):** $620 | Attractions & Private Transfers included.`;

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
