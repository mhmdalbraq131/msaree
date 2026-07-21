/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentExecutionParams, AgentExecutionResult } from './baseAgent.interface';

export class AgentRegistry {
  private static agents: Map<string, BaseAgent> = new Map();
  private static executionLogs: Array<{
    timestamp: string;
    agentId: string;
    userId: string;
    success: boolean;
    latencyMs: number;
  }> = [];

  static registerAgent(agent: BaseAgent): void {
    this.agents.set(agent.id, agent);
  }

  static getAgent(agentId: string): BaseAgent | undefined {
    return this.agents.get(agentId);
  }

  static getAllAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  static findBestAgents(query: string, context: any, threshold: number = 0.3): BaseAgent[] {
    const scored = Array.from(this.agents.values()).map(agent => ({
      agent,
      score: agent.canHandle(query, context)
    }));

    return scored
      .filter(item => item.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .map(item => item.agent);
  }

  static async executeAgent(agentId: string, params: AgentExecutionParams): Promise<AgentExecutionResult> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return {
        agentId,
        agentName: 'UnknownAgent',
        success: false,
        contentAr: `العميل الذكي (${agentId}) غير مسجل في المنصة.`,
        contentEn: `Agent (${agentId}) is not registered in the platform.`,
        latencyMs: 0,
        error: `Agent ${agentId} not found.`
      };
    }

    const startTime = Date.now();
    try {
      const result = await agent.execute(params);
      const latencyMs = Date.now() - startTime;

      // Update Agent Metrics
      agent.metrics.totalInvocations++;
      if (result.success) {
        agent.metrics.successfulInvocations++;
      } else {
        agent.metrics.failedInvocations++;
      }
      agent.metrics.avgLatencyMs = Math.round(
        (agent.metrics.avgLatencyMs * (agent.metrics.totalInvocations - 1) + latencyMs) / agent.metrics.totalInvocations
      );
      agent.metrics.lastExecutedAt = new Date().toISOString();

      // Audit Log
      this.executionLogs.unshift({
        timestamp: new Date().toISOString(),
        agentId,
        userId: params.userId,
        success: result.success,
        latencyMs
      });

      if (this.executionLogs.length > 500) {
        this.executionLogs.pop();
      }

      return result;
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      agent.metrics.totalInvocations++;
      agent.metrics.failedInvocations++;

      return {
        agentId: agent.id,
        agentName: agent.name,
        success: false,
        contentAr: `حدث خطأ أثناء تشغيل العميل الذكي: ${agent.name}`,
        contentEn: `Error executing agent: ${agent.name}`,
        latencyMs,
        error: err.message || 'Execution exception'
      };
    }
  }

  static getLogs() {
    return this.executionLogs;
  }
}
