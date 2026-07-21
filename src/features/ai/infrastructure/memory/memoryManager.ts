/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChatMessageModel } from '../models/aiModels';

export interface UserPreferencesMemory {
  lang: 'ar' | 'en';
  currency: string;
  preferredAirline?: string;
  preferredHotelRating?: number;
  maxBudgetUsd?: number;
  frequentDestinations: string[];
}

export interface SessionMemoryState {
  sessionId: string;
  userId: string;
  shortTermMessages: ChatMessageModel[];
  longTermSummaryAr: string;
  longTermSummaryEn: string;
  travelContext?: {
    origin?: string;
    destination?: string;
    travelDates?: string;
    passengers?: number;
  };
  bookingContext?: {
    activeBookingRefs: string[];
    lastInspectedRef?: string;
  };
  walletContext?: {
    lastKnownAvailable: number;
    lastKnownReserved: number;
  };
  userPreferences: UserPreferencesMemory;
  lastUpdated: string;
}

export class MemoryManager {
  private static sessions: Map<string, SessionMemoryState> = new Map();

  static getOrCreateSession(sessionId: string, userId: string, lang: 'ar' | 'en' = 'ar'): SessionMemoryState {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        userId,
        shortTermMessages: [],
        longTermSummaryAr: 'المستخدم يبحث عن رحلات موفرة وحجوزات طيران وتأشيرات عمرة.',
        longTermSummaryEn: 'User prefers cost-effective flights, Hajj/Umrah packages and quick e-visas.',
        userPreferences: {
          lang,
          currency: 'USD',
          frequentDestinations: ['Makkah', 'Madinah', 'Cairo', 'Aden']
        },
        lastUpdated: new Date().toISOString()
      };
      this.sessions.set(sessionId, session);
    }
    return session;
  }

  static addMessage(sessionId: string, message: ChatMessageModel) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.shortTermMessages.push(message);
    session.lastUpdated = new Date().toISOString();

    // Memory Cleanup Strategy: Keep last 20 short-term messages, roll older into long-term context
    if (session.shortTermMessages.length > 20) {
      const trimmed = session.shortTermMessages.shift();
      if (trimmed && trimmed.role === 'user') {
        session.longTermSummaryAr += ` | سابقة: ${trimmed.content.substring(0, 40)}`;
        session.longTermSummaryEn += ` | Prev: ${trimmed.content.substring(0, 40)}`;
      }
    }
  }

  static updateTravelContext(sessionId: string, context: SessionMemoryState['travelContext']) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.travelContext = { ...session.travelContext, ...context };
    }
  }

  static updateWalletContext(sessionId: string, available: number, reserved: number) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.walletContext = {
        lastKnownAvailable: available,
        lastKnownReserved: reserved
      };
    }
  }

  static clearSession(sessionId: string) {
    this.sessions.delete(sessionId);
  }
}
