/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Booking } from '../../../../types';

export interface EnterpriseContextPayload {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'pilgrim' | 'agent';
    permissions: string[];
  };
  bookings: {
    totalBookings: number;
    activeBookingsCount: number;
    cancelledCount: number;
    recentBookings: Booking[];
  };
  wallet: {
    availableBalance: number;
    reservedBalance: number;
    rewardPoints: number;
    currency: string;
  };
  travelHistory: {
    frequentDestinations: string[];
    topPreferredAirline: string;
  };
  currentSearch?: {
    origin?: string;
    destination?: string;
  };
  activeOffers: {
    id: string;
    code: string;
    discountPercent: number;
  }[];
  unreadNotificationsCount: number;
  adminPermissions?: {
    canViewAnalytics: boolean;
    canProcessRefunds: boolean;
    canManageInventory: boolean;
  };
}

export class ContextBuilder {
  static buildContext(params: {
    userId?: string;
    userRole?: 'user' | 'admin' | 'pilgrim' | 'agent';
    bookings?: Booking[];
    wallet?: any;
    currency?: string;
  }): EnterpriseContextPayload {
    const role = params.userRole || 'user';
    const rawBookings = params.bookings || [];
    const walletObj = params.wallet || { availableBalance: 1250, reservedBalance: 200, rewardBalance: 450 };

    const activeBookings = rawBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
    const cancelledBookings = rawBookings.filter(b => b.status === 'cancelled');

    return {
      user: {
        id: params.userId || 'usr-masari-789',
        name: 'Mohammed Al-Baraq',
        email: 'mhmdalbraq131@gmail.com',
        role,
        permissions: role === 'admin' 
          ? ['read_analytics', 'manage_ledgers', 'process_refunds', 'manage_inventory']
          : ['create_booking', 'view_own_wallet', 'cancel_own_booking']
      },
      bookings: {
        totalBookings: rawBookings.length,
        activeBookingsCount: activeBookings.length,
        cancelledCount: cancelledBookings.length,
        recentBookings: rawBookings.slice(0, 5)
      },
      wallet: {
        availableBalance: walletObj.availableBalance ?? 1250,
        reservedBalance: walletObj.reservedBalance ?? 200,
        rewardPoints: walletObj.rewardBalance ?? 450,
        currency: params.currency || 'USD'
      },
      travelHistory: {
        frequentDestinations: ['Makkah', 'Madinah', 'Cairo', 'Aden', 'Sanaa'],
        topPreferredAirline: 'Yemenia Airways / Saudia Airlines'
      },
      activeOffers: [
        { id: 'off-1', code: 'RAMADAN2026', discountPercent: 15 },
        { id: 'off-2', code: 'HAJJVIP', discountPercent: 10 }
      ],
      unreadNotificationsCount: 2,
      adminPermissions: role === 'admin' ? {
        canViewAnalytics: true,
        canProcessRefunds: true,
        canManageInventory: true
      } : undefined
    };
  }
}
