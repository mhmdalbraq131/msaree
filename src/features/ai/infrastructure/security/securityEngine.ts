/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuditLogEntry, SecurityPolicy } from '../models/aiModels';

export class SecurityEngine {
  private static auditLogs: AuditLogEntry[] = [];
  private static userRequestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  private static policy: SecurityPolicy = {
    maxRequestsPerMinute: 60,
    enableSanitization: true,
    blockedKeywords: [
      'ignore previous instructions',
      'system prompt leak',
      'drop database',
      'sudo rm',
      'bypass security'
    ],
    sensitivePatterns: [
      /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, // Credit Card Pattern
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g // Email address (if sanitization requested)
    ],
    allowedRoles: ['user', 'admin', 'pilgrim', 'agent']
  };

  /**
   * Rate limiting validator
   */
  static checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    let record = this.userRequestCounts.get(userId);

    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + 60000 };
      this.userRequestCounts.set(userId, record);
      return { allowed: true, remaining: this.policy.maxRequestsPerMinute - 1 };
    }

    if (record.count >= this.policy.maxRequestsPerMinute) {
      return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: this.policy.maxRequestsPerMinute - record.count };
  }

  /**
   * Prompt Injection Protection & Sanitization
   */
  static sanitizeInput(input: string): { sanitizedText: string; isMalicious: boolean } {
    const lower = input.toLowerCase();

    // Check for prompt injection keywords
    for (const kw of this.policy.blockedKeywords) {
      if (lower.includes(kw)) {
        return {
          sanitizedText: '[BLOCKED_PROMPT_INJECTION_ATTEMPT]',
          isMalicious: true
        };
      }
    }

    let sanitized = input;

    // Mask credit card numbers
    sanitized = sanitized.replace(this.policy.sensitivePatterns[0], '****-****-****-****');

    return {
      sanitizedText: sanitized,
      isMalicious: false
    };
  }

  /**
   * Output Sanitization
   */
  static sanitizeOutput(output: string): string {
    // Mask sensitive financial account numbers or credentials in output
    return output.replace(this.policy.sensitivePatterns[0], '[PROTECTED_CARD]');
  }

  /**
   * Audit Logging
   */
  static logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const fullEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };

    this.auditLogs.unshift(fullEntry);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }

  static getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }
}
