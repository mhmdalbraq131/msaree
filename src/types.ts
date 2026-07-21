/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Global App Types for MASARI Travel Platform (منصة مساري للسفريات والسياحة والحج والعمرة)

export type Language = 'ar' | 'en';
export type AppTheme = 'luxury' | 'sky';
export type Currency = 'USD' | 'YER' | 'SAR';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'VIP';
  loyaltyPoints: number;
  walletBalance: number;
  isGuest: boolean;
  profileCompletion: number; // percentage
  savedTravelersCount: number;
}

export interface Traveler {
  id: string;
  type: 'primary' | 'spouse' | 'child' | 'parent' | 'friend';
  fullNameAr: string;
  fullNameEn: string;
  passportNo: string;
  nationalityAr: string;
  nationalityEn: string;
  birthDate: string;
  gender: 'male' | 'female';
  passportExpiry: string;
  issuingCountryAr: string;
  issuingCountryEn: string;
  specialRequirements?: string;
  emergencyContactPhone?: string;
  isVerifiedPassport: boolean;
}

export interface PassportDoc {
  id: string;
  travelerId: string;
  travelerName: string;
  passportNo: string;
  expiryDate: string;
  issueDate: string;
  nationality: string;
  imageUrl?: string;
  ocrExtracted: boolean;
  status: 'valid' | 'expiring_soon' | 'expired';
}

export interface NotificationItem {
  id: string;
  category: 'travel_reminder' | 'visa_alert' | 'passport_expiry' | 'price_drop' | 'wallet_activity' | 'reward_update' | 'special_offer';
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  timeAr: string;
  timeEn: string;
  read: boolean;
  actionUrl?: string;
  actionType?: string;
}

// Service Sections
export enum ActiveSection {
  Onboarding = 'onboarding',
  Auth = 'auth',
  Home = 'home',
  Flights = 'flights',
  Hotels = 'hotels',
  Tourism = 'tourism',
  Bus = 'bus',
  Cars = 'cars',
  Transfers = 'transfers',
  Visa = 'visa',
  Umrah = 'umrah',
  Hajj = 'hajj',
  Wallet = 'wallet',
  Travelers = 'travelers',
  Passports = 'passports',
  AiAssistant = 'ai_assistant',
}

// Sub-screens for authentication
export type AuthScreen = 'login' | 'register' | 'forgot' | 'otp' | 'success' | 'guest_upgrade';

// Bottom Navigation items
export type TabItem = 'home' | 'search' | 'bookings' | 'wallet' | 'profile';

// Flight Interface
export interface Flight {
  id: string;
  airline: string;
  airlineLogoUrl: string;
  flightNo: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number; // in USD
  classType: 'Economy' | 'Business' | 'First';
}

// Tourism Package Interface
export interface TourismPackage {
  id: string;
  titleAr: string;
  titleEn: string;
  price: number; // in USD
  durationDays: number;
  countryAr: string;
  countryEn: string;
  image: string;
  highlightsAr: string[];
  highlightsEn: string[];
  includesAr: string[];
  includesEn: string[];
}

// Umrah Package Interface
export interface UmrahPackage {
  id: string;
  titleAr: string;
  titleEn: string;
  price: number; // in USD
  durationDays: number;
  hotelMakkahAr: string;
  hotelMakkahEn: string;
  hotelMadinahAr: string;
  hotelMadinahEn: string;
  flightsIncluded: boolean;
  transportIncluded: boolean;
  airlineLogo: string;
  airlineNameAr: string;
  airlineNameEn: string;
  image: string;
}

// Hajj Package Interface
export interface HajjPackage {
  id: string;
  titleAr: string;
  titleEn: string;
  price: number; // in USD
  hotelAr: string;
  hotelEn: string;
  durationDays: number;
  capacityMax: number;
  rating: number;
  featuresAr: string[];
  featuresEn: string[];
  image: string;
}

// Booking Interface
export interface Booking {
  id: string;
  bookingRef: string;
  type: 'flight' | 'tourism' | 'umrah' | 'hajj' | 'hotel' | 'bus' | 'car' | 'transfer' | 'visa';
  titleAr: string;
  titleEn: string;
  price: number;
  bookingDate: string;
  departureDate: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  details: {
    passengersCount: number;
    phone: string;
    email: string;
    travelerNames?: string[];
    paymentMethod?: string;
    invoiceUrl?: string;
    additionalInfo?: string;
  };
}

// Technical documentation schemas
export interface DocumentationSection {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: string;
  content: string; // Markdown or rich structure
}
