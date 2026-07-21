/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentRegistry } from '../framework/agentRegistry';
import { AgentExecutionParams, AgentExecutionResult, BaseAgent } from '../framework/baseAgent.interface';

import { TravelAgent } from '../core/travelAgent';
import { BookingAgent } from '../core/bookingAgent';
import { WalletAgent } from '../core/walletAgent';
import { FlightAgent } from '../core/flightAgent';
import { BusAgent } from '../core/busAgent';
import { HotelAgent } from '../core/hotelAgent';
import { TourismAgent } from '../core/tourismAgent';
import { VisaAgent } from '../core/visaAgent';
import { HajjAgent } from '../core/hajjAgent';
import { UmrahAgent } from '../core/umrahAgent';
import { TransportAgent } from '../core/transportAgent';
import { RecommendationAgent } from '../core/recommendationAgent';
import { NotificationAgent } from '../core/notificationAgent';
import { AnalyticsAgent } from '../core/analyticsAgent';
import { AdminAgent } from '../core/adminAgent';
import { SupportAgent } from '../core/supportAgent';

export interface MultiAgentOrchestrationResult {
  primaryAgentName: string;
  participatingAgents: string[];
  combinedContentAr: string;
  combinedContentEn: string;
  actionExecuted?: {
    type: string;
    success: boolean;
    detailsAr: string;
    detailsEn: string;
  };
  agentResults: AgentExecutionResult[];
  totalLatencyMs: number;
}

export class MultiAgentOrchestrator {
  private static initialized = false;

  static initializeSystem(): void {
    if (this.initialized) return;

    // Register all 16 core agents
    AgentRegistry.registerAgent(new TravelAgent());
    AgentRegistry.registerAgent(new BookingAgent());
    AgentRegistry.registerAgent(new WalletAgent());
    AgentRegistry.registerAgent(new FlightAgent());
    AgentRegistry.registerAgent(new BusAgent());
    AgentRegistry.registerAgent(new HotelAgent());
    AgentRegistry.registerAgent(new TourismAgent());
    AgentRegistry.registerAgent(new VisaAgent());
    AgentRegistry.registerAgent(new HajjAgent());
    AgentRegistry.registerAgent(new UmrahAgent());
    AgentRegistry.registerAgent(new TransportAgent());
    AgentRegistry.registerAgent(new RecommendationAgent());
    AgentRegistry.registerAgent(new NotificationAgent());
    AgentRegistry.registerAgent(new AnalyticsAgent());
    AgentRegistry.registerAgent(new AdminAgent());
    AgentRegistry.registerAgent(new SupportAgent());

    this.initialized = true;
  }

  /**
   * Main multi-agent dispatch and coordination engine
   */
  static async orchestrate(params: AgentExecutionParams): Promise<MultiAgentOrchestrationResult> {
    this.initializeSystem();

    const startTime = Date.now();
    const isAr = params.lang === 'ar';

    // 1. Discover top candidate agents for this query
    const candidateAgents = AgentRegistry.findBestAgents(params.query, params.contextData, 0.25);

    // If no specific agent score is high enough, fallback to SupportAgent
    const agentsToRun: BaseAgent[] = candidateAgents.length > 0 
      ? candidateAgents.slice(0, 3) // Take top 3 for co-orchestration
      : [AgentRegistry.getAgent('agent-support') || new SupportAgent()];

    // 2. Run selected agents in parallel
    const executionPromises = agentsToRun.map(agent => 
      AgentRegistry.executeAgent(agent.id, params)
    );

    const results = await Promise.all(executionPromises);

    // 3. Extract primary and supporting outputs
    const primaryResult = results[0];
    const secondaryResults = results.slice(1).filter(r => r.success);

    const participatingAgentNames = results.map(r => r.agentName);

    // 4. Merge content & actions from participating agents
    let combinedAr = primaryResult.contentAr;
    let combinedEn = primaryResult.contentEn;

    for (const sec of secondaryResults) {
      combinedAr += `\n\n---\n📌 **إضافة من ${sec.agentName}:**\n${sec.contentAr}`;
      combinedEn += `\n\n---\n📌 **Insights from ${sec.agentName}:**\n${sec.contentEn}`;
    }

    // Capture primary action if executed
    const actionExecuted = primaryResult.actionExecuted || secondaryResults.find(r => r.actionExecuted)?.actionExecuted;

    return {
      primaryAgentName: primaryResult.agentName,
      participatingAgents: participatingAgentNames,
      combinedContentAr: combinedAr,
      combinedContentEn: combinedEn,
      actionExecuted,
      agentResults: results,
      totalLatencyMs: Date.now() - startTime
    };
  }
}
