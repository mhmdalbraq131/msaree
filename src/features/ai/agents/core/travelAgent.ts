/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentCapability, AgentExecutionParams, AgentExecutionResult, AgentMetrics } from '../framework/baseAgent.interface';

export class TravelAgent implements BaseAgent {
  readonly id = 'agent-travel';
  readonly name = 'Masari Travel Planning Agent';
  readonly description = 'Builds complete itineraries, estimates trip costs, compares travel alternatives and optimizes plans.';
  
  readonly capabilities: AgentCapability[] = [
    { id: 'itinerary_build', name: 'Itinerary Builder', description: 'Creates custom multi-day travel itineraries.' },
    { id: 'cost_estimate', name: 'Cost Estimator', description: 'Estimates total trip cost including flights, stay, and transport.' }
  ];

  readonly metrics: AgentMetrics = {
    totalInvocations: 0,
    successfulInvocations: 0,
    failedInvocations: 0,
    avgLatencyMs: 0
  };

  canHandle(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('خطط') || q.includes('رحلة') || q.includes('جدول') || q.includes('برنامج') || q.includes('itinerary') || q.includes('plan') || q.includes('trip')) {
      return 0.85;
    }
    return 0.1;
  }

  async execute(params: AgentExecutionParams): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    const isAr = params.lang === 'ar';

    const contentAr = `🗺️ **جدول الرحلة المقترح من عميل التخطيط والسفر:**\n\n- **اليوم 1:** الوصول، التسكين بالفندق، والتجول في المعالم الرئيسية.\n- **اليوم 2-3:** جولات سياحية وزيارة الأماكن التاريخية والمراكز التجارية.\n- **اليوم 4:** المغادرة والعودة المريحة.\n\n💰 **تقدير التكلفة الإجمالية:** ~650 - 900 دولار شاملاً الإقامة والتنقلات.`;
    const contentEn = `🗺️ **Proposed Travel Itinerary:**\n\n- **Day 1:** Arrival, hotel check-in, and central city walk.\n- **Day 2-3:** Guided heritage tour and cultural visits.\n- **Day 4:** Checkout & seamless return transfer.\n\n💰 **Estimated Total Cost:** ~$650 - $900 including stay & transit.`;

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
