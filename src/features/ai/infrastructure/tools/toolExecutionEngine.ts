/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIToolCall, AIToolDefinition, AIToolResult } from '../models/aiModels';

export class ToolExecutionEngine {
  private static registeredTools: Map<string, AIToolDefinition> = new Map([
    ['search_flights', {
      name: 'search_flights',
      description: 'Search available flight options with prices and schedules',
      parameters: {
        type: 'object',
        properties: {
          origin: { type: 'string', description: 'Origin city or airport' },
          destination: { type: 'string', description: 'Destination city or airport' },
          date: { type: 'string', description: 'Travel date' }
        },
        required: ['origin', 'destination']
      }
    }],
    ['search_hotels', {
      name: 'search_hotels',
      description: 'Search hotels near Holy Mosques or major destinations',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string', description: 'City name (e.g. Makkah, Madinah)' },
          stars: { type: 'number', description: 'Minimum hotel star rating' }
        },
        required: ['city']
      }
    }],
    ['search_buses', {
      name: 'search_buses',
      description: 'Search land transport and luxury VIP bus routes',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string', description: 'Departure city' },
          to: { type: 'string', description: 'Arrival city' }
        },
        required: ['from', 'to']
      }
    }],
    ['search_tourism', {
      name: 'search_tourism',
      description: 'Search tourism and sightseeing packages',
      parameters: {
        type: 'object',
        properties: {
          country: { type: 'string', description: 'Destination country' }
        },
        required: ['country']
      }
    }],
    ['search_hajj', {
      name: 'search_hajj',
      description: 'Search official Hajj packages and ritual itineraries',
      parameters: {
        type: 'object',
        properties: {
          tier: { type: 'string', description: 'VIP, Premium, or Standard' }
        }
      }
    }],
    ['search_umrah', {
      name: 'search_umrah',
      description: 'Search Umrah packages with e-visa assistance',
      parameters: {
        type: 'object',
        properties: {
          durationDays: { type: 'number', description: 'Number of days' }
        }
      }
    }],
    ['search_visa', {
      name: 'search_visa',
      description: 'Check e-visa processing requirements and status',
      parameters: {
        type: 'object',
        properties: {
          visaType: { type: 'string', description: 'Umrah, Tourist, Transit, or Business' }
        }
      }
    }],
    ['create_booking', {
      name: 'create_booking',
      description: 'Execute booking creation and charge wallet',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Booking title' },
          price: { type: 'number', description: 'Price in USD' }
        },
        required: ['title', 'price']
      },
      permissionRequired: 'create_booking'
    }],
    ['cancel_booking', {
      name: 'cancel_booking',
      description: 'Cancel booking and issue instant wallet refund',
      parameters: {
        type: 'object',
        properties: {
          bookingId: { type: 'string', description: 'Booking ID or Ref' }
        },
        required: ['bookingId']
      },
      permissionRequired: 'cancel_own_booking'
    }],
    ['wallet_balance', {
      name: 'wallet_balance',
      description: 'Fetch unified wallet ledger balance',
      parameters: {
        type: 'object',
        properties: {}
      }
    }],
    ['reward_points', {
      name: 'reward_points',
      description: 'Fetch customer reward points balance and conversions',
      parameters: {
        type: 'object',
        properties: {}
      }
    }],
    ['generate_invoice', {
      name: 'generate_invoice',
      description: 'Generate PDF or digital invoice for a completed booking',
      parameters: {
        type: 'object',
        properties: {
          refCode: { type: 'string', description: 'Booking reference code' }
        }
      }
    }],
    ['generate_travel_summary', {
      name: 'generate_travel_summary',
      description: 'Generate comprehensive travel itinerary summary',
      parameters: {
        type: 'object',
        properties: {}
      }
    }],
    ['generate_reports', {
      name: 'generate_reports',
      description: 'Generate executive revenue and cancellation reports for admins',
      parameters: {
        type: 'object',
        properties: {
          period: { type: 'string', description: 'monthly, quarterly, or yearly' }
        }
      },
      permissionRequired: 'read_analytics'
    }]
  ]);

  static getToolDefinitions(): AIToolDefinition[] {
    return Array.from(this.registeredTools.values());
  }

  static async executeToolCall(
    call: AIToolCall,
    context: {
      userId: string;
      userRole: string;
      userPermissions: string[];
      bookings: any[];
      setBookings?: (b: any[]) => void;
      wallet: any;
      setWallet?: (w: any) => void;
    }
  ): Promise<AIToolResult> {
    const toolDef = this.registeredTools.get(call.name);
    if (!toolDef) {
      return {
        toolCallId: call.id,
        name: call.name,
        success: false,
        error: `Tool ${call.name} is not registered in MASARI Execution Engine.`,
        result: null
      };
    }

    // Security Permission Validation
    if (toolDef.permissionRequired && !context.userPermissions.includes(toolDef.permissionRequired) && context.userRole !== 'admin') {
      return {
        toolCallId: call.id,
        name: call.name,
        success: false,
        error: `Permission Denied: User role ${context.userRole} lacks permission '${toolDef.permissionRequired}'.`,
        result: null
      };
    }

    // Execute handlers
    try {
      switch (call.name) {
        case 'wallet_balance':
          return {
            toolCallId: call.id,
            name: call.name,
            success: true,
            result: {
              availableBalance: context.wallet.availableBalance,
              reservedBalance: context.wallet.reservedBalance,
              currency: 'USD'
            }
          };

        case 'reward_points':
          return {
            toolCallId: call.id,
            name: call.name,
            success: true,
            result: {
              rewardBalance: context.wallet.rewardBalance || 450,
              valueInUsd: (context.wallet.rewardBalance || 450) / 100
            }
          };

        case 'cancel_booking': {
          const bookingId = call.arguments.bookingId;
          const target = context.bookings.find(b => b.id === bookingId || b.id.includes(bookingId));
          if (target && target.status !== 'cancelled') {
            target.status = 'cancelled';
            const refundPrice = target.price || 0;
            if (context.setWallet) {
              context.setWallet({
                ...context.wallet,
                availableBalance: context.wallet.availableBalance + refundPrice
              });
            }
            if (context.setBookings) {
              context.setBookings([...context.bookings]);
            }
            return {
              toolCallId: call.id,
              name: call.name,
              success: true,
              result: {
                refundedAmount: refundPrice,
                bookingId: target.id,
                newWalletBalance: context.wallet.availableBalance + refundPrice
              }
            };
          }
          return {
            toolCallId: call.id,
            name: call.name,
            success: true,
            result: { message: 'Booking already cancelled or not found.' }
          };
        }

        case 'generate_reports':
          return {
            toolCallId: call.id,
            name: call.name,
            success: true,
            result: {
              period: call.arguments.period || 'monthly',
              totalRevenue: 284500,
              growthRate: '+18.5%',
              cancellationRate: '4.2%'
            }
          };

        default:
          return {
            toolCallId: call.id,
            name: call.name,
            success: true,
            result: {
              status: 'executed',
              argumentsPassed: call.arguments,
              timestamp: new Date().toISOString()
            }
          };
      }
    } catch (err: any) {
      return {
        toolCallId: call.id,
        name: call.name,
        success: false,
        error: err.message || 'Execution failed',
        result: null
      };
    }
  }
}
