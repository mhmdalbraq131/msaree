/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DocSection {
  titleEn: string;
  titleAr: string;
  markdown: string;
}

export const technicalDocs: Record<string, DocSection> = {
  srs: {
    titleEn: 'Software Requirements Specification (SRS)',
    titleAr: 'مواصفات متمتطلبات البرمجيات',
    markdown: `### 1. Introduction
This Software Requirements Specification (SRS) details the functional, non-functional, and structural requirements for the **Masari Platform (منصة مساري للسفريات والسياحة والحج والعمرة)**. Masari is designed as a secure, high-performance, and commercial-grade digital travel platform tailored for Yemen and the broader Middle East market, specializing in Flights, Tourism, Hajj, and Umrah bookings.

#### 1.1 Scope of Phase One
Phase One establishes the highly optimized core, foundational software architecture, responsive multi-channel UX layout framework, strict database schemas, API interface contracts, and the cross-platform presentation baseline. Advanced modules such as the Digital Wallet, AI engine, and full Admin/Staff booking management systems are planned for Phase Two.

---

### 2. User Personas
1. **Pilgrims (Hajj & Umrah)**: Often require high-accessibility UIs, offline-ready tickets/vouchers, Arabic-first localization, and clear visual steps for religious package booking.
2. **General Leisure Travelers (Flights & Tourism)**: Expect smooth filtering, transparent pricing with multiple currencies (USD, YER, SAR), and responsive mobile/web layout compatibility.
3. **Agency Operators & Staff (Future Phase)**: Require full administrative dashboards, booking status monitors, and reservation processing tools.

---

### 3. Functional Requirements
*   **FR-1.0: Localization & Directionality**: The system must support Arabic-first, full Right-to-Left (RTL) rendering with dynamic Left-to-Right (LTR) toggling.
*   **FR-1.1: Onboarding Carousel**: Informational, high-impact swipeable tutorials displaying company identity, custom features (car rental personalization, member rewards, event-based discount promos).
*   **FR-1.2: Interactive Flight Search & Display**: Form validating destination inputs, passenger categories (Adults, Children, Infants), departure/arrival datepickers, and returning clean flight offer cards.
*   **FR-1.3: Interactive Hajj & Umrah Booking Engine**: Detailed package summaries with hotels, flights, and meals, integrated with structured reservation forms capturing primary traveler, companions, and accommodations.
*   **FR-1.4: Multi-Currency Configuration**: Dynamic pricing calculation supporting real-time currency conversions between YER, SAR, and USD.

---

### 4. Non-Functional Requirements
*   **Performance (NFR-1.0)**: Initial page load under 1.5 seconds on typical mobile connections. API endpoints must respond under 300ms.
*   **Accessibility (NFR-1.1)**: Double-contrast ratios matching WCAG 2.1 AA standards. Generous 44px minimum touch targets on mobile viewports.
*   **Security & Data Privacy (NFR-1.2)**: SSL/TLS 1.3 encryption across all communication. Encrypted stored records for client profiles.
*   **Scalability (NFR-1.3)**: State management and database schemas optimized for up to 100,000 concurrent active users.`
  },
  architecture: {
    titleEn: 'System Architecture & Folder Map',
    titleAr: 'بنية النظام وخريطة المجلدات',
    markdown: `### 1. Architecture Overview
Masari Platform utilizes a **Feature-First Clean Architecture** structure. This separates concerns cleanly into presentation, domain (business logic), and data layers. It supports scalable codebases that can easily compile to responsive web applications or mobile packages (Flutter/native wrappers).

\`\`\`
lib/
├── app/                  # Application configuration, providers, and themes
│   ├── theme.dart        # Luxury Brand color schemes, styles, and typography
│   ├── routes.dart       # GoRouter path definitions and transition definitions
│   └── observers.dart    # Logging and performance trackers
├── core/                 # Shared widgets, utilities, and network clients
│   ├── network/          # Http and Firebase clients
│   ├── security/         # Cryptography and session tokens
│   └── constants/        # Assets and localized dictionaries
└── features/             # Feature-first modules
    ├── onboarding/
    ├── auth/
    ├── flights/
    ├── tourism/
    ├── umrah/
    ├── hajj/
    └── profile/
        ├── data/         # Models, data sources, and repositories implementation
        │   ├── datasources/
        │   ├── models/
        │   └── repositories/
        ├── domain/       # Use cases and abstract repository definitions
        │   ├── entities/
        │   ├── usecases/
        │   └── repositories/
        └── presentation/ # View models (Riverpod), screens, and components
            ├── controllers/
            ├── screens/
            └── widgets/
\`\`\`

---

### 2. Architectural Design Patterns
*   **Repository Pattern**: Isolates presentation state from raw data endpoints, facilitating seamless switching between local test beds and production Firebase instances.
*   **State Management (Riverpod)**: Unidirectional data flow. View models listen to domain use-cases, and screens re-render reactively based on state changes.
*   **GoRouter Navigation**: Declarative routing supporting deep-linking, query parameters, route guards (checking session state), and native transition animations.
*   **SOLID Principles Alignment**: Every single feature file has a single responsibility. Enforcing strict abstraction on data interactions prevents cross-component pollution.`
  },
  database: {
    titleEn: 'Firestore Schema & Security',
    titleAr: 'مخطط قواعد البيانات وسيكورتي فيربيز',
    markdown: `### 1. Firestore Database Planning
To support scalable, real-time client records and high-performance querying, the Firestore database schema is highly structured. All timestamps are standard ISO UTC dates.

\`\`\`typescript
// collection: users
interface UserDoc {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  createdAt: string; // ISO 8601
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'VIP';
  walletBalance: number;
  fcmToken?: string;
}

// collection: bookings
interface BookingDoc {
  bookingId: string;
  bookingRef: string; // e.g. MSR-2026-X839A
  userId: string;
  type: 'flight' | 'tourism' | 'umrah' | 'hajj';
  packageId: string;
  titleAr: string;
  titleEn: string;
  priceUSD: number;
  departureDate: string;
  returnDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  passengers: {
    fullName: string;
    passportNumber?: string;
    ageCategory: 'adult' | 'child' | 'infant';
  }[];
  contactInfo: {
    phone: string;
    email: string;
  };
  accommodationType?: 'tent' | 'hotel' | 'suite';
  companionName?: string;
  createdAt: string;
}

// collection: flights
interface FlightDoc {
  flightId: string;
  flightNo: string;
  airlineName: string;
  logoUrl: string;
  fromCode: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  priceEconomy: number;
  priceBusiness: number;
  active: boolean;
}
\`\`\`

---

### 2. Firestore Security Rules (\`firestore.rules\`)
Below is the strict security rule model protecting the Masari records against unauthorized read/writes:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User Profile Rules
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Booking Records Rules
    match /bookings/{bookingId} {
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || request.auth.token.role == 'admin');
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Static / Public Travel Products
    match /flights/{flightId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    match /packages/{packageId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
\`\`\``
  },
  apis: {
    titleEn: 'API Contracts (JSON Spec)',
    titleAr: 'مواصفات واجهات البرمجة (APIs)',
    markdown: `### 1. Flight Search Request / Response
This contract defines the parameters exchanged between the mobile clients and the Express/Node backend router when requesting flight offers.

**Endpoint**: \`POST /api/flights/search\`

**Request Header**:
\`\`\`json
{
  "Content-Type": "application/json",
  "Accept-Language": "ar"
}
\`\`\`

**Request Body**:
\`\`\`json
{
  "from": "SAH",
  "to": "CAI",
  "departureDate": "2026-08-10",
  "returnDate": "2026-08-25",
  "tripType": "roundTrip",
  "passengers": {
    "adults": 1,
    "children": 0,
    "infants": 0
  }
}
\`\`\`

**Success Response (200 OK)**:
\`\`\`json
{
  "searchId": "search_res_991823a",
  "results": [
    {
      "flightId": "f1",
      "airline": "Yemenia Airways",
      "flightNo": "IY-601",
      "departureTime": "08:30",
      "arrivalTime": "11:45",
      "duration": "3h 15m",
      "stops": 0,
      "currency": "USD",
      "price": 450
    }
  ]
}
\`\`\`

---

### 2. Create Booking Contract
Handles Hajj, Umrah, and General Package registration.

**Endpoint**: \`POST /api/bookings/create\`

**Request Body**:
\`\`\`json
{
  "userId": "usr_99a82b3",
  "type": "hajj",
  "packageId": "h1",
  "passengers": [
    {
      "fullName": "محمد البرق",
      "ageCategory": "adult"
    }
  ],
  "contactPhone": "+967777123456",
  "contactEmail": "mhmd@gmail.com",
  "accommodationType": "hotel",
  "companionName": "أحمد البرق"
}
\`\`\`

**Success Response (201 Created)**:
\`\`\`json
{
  "status": "success",
  "message": "Booking created successfully",
  "booking": {
    "bookingId": "bk_9a8df011x",
    "bookingRef": "MSR-2026-H88B",
    "status": "pending",
    "amountPaidUSD": 8500
  }
}
\`\`\``
  },
  design: {
    titleEn: 'Luxury Brand Design System',
    titleAr: 'نظام التصميم الفاخر',
    markdown: `### 1. Brand Identity & Visual Philosophy
The **Masari Design System** utilizes an Arabic-first modern luxury theme. Every layout is structured cleanly with generous padding and crisp lines to reflect comfort and elite security, matching the travel agency's core business identity.

---

### 2. Official Color Palette
Our colors are directly extracted from the approved brand logo.

| Color Name | Hex Code | Role in UI | Visual Showcase |
| :--- | :--- | :--- | :--- |
| **Masari Deep Blue** | \`#0E4B75\` | Primary brand background, luxury header accents, primary buttons | <span style="background-color:#0E4B75;color:white;padding:2px 8px;border-radius:4px">#0E4B75</span> |
| **Masari Vibrant Cyan** | \`#22B0C3\` | Highlighting sub-elements, active bottom bars, selection states | <span style="background-color:#22B0C3;color:black;padding:2px 8px;border-radius:4px">#22B0C3</span> |
| **Masari Coral Orange** | \`#E85A1D\` | Action banners, booking alerts, primary CTAs | <span style="background-color:#E85A1D;color:white;padding:2px 8px;border-radius:4px">#E85A1D</span> |
| **Luxury Gold Accent** | \`#C5A880\` | Hajj and VIP package borders, crown badges, rating indicators | <span style="background-color:#C5A880;color:black;padding:2px 8px;border-radius:4px">#C5A880</span> |
| **Alabaster White** | \`#F8FAFC\` | Base viewport background, input panels, card dividers | <span style="background-color:#F8FAFC;color:black;padding:2px 8px;border:1px solid #ddd;border-radius:4px">#F8FAFC</span> |
| **Rich Slate** | \`#0F172A\` | Body typography, core navigation icons, high-density shadows | <span style="background-color:#0F172A;color:white;padding:2px 8px;border-radius:4px">#0F172A</span> |

---

### 3. Typography System
*   **Arabic Heading Text**: Cairo (SemiBold / ExtraBold), line height 1.4
*   **English Heading Text**: Inter (Medium / Bold), letter-spacing: \`-0.025em\`
*   **Mono Indicators (Prices/Flight Numbers)**: JetBrains Mono (Medium), tabular numbers configuration

---

### 4. Responsive Rules
To align with our multi-device goals (Mobile App + Desktop Hub), Masari Platform applies fluid containers:
*   **Mobile Viewports (< 640px)**: Single column layouts, sticky bottom action bar, hidden sidebars. Minimum click target sizes of 44px x 44px.
*   **Tablet Viewports (640px - 1024px)**: Dual column grids, slide-out drawer menus.
*   **Desktop Viewports (> 1024px)**: Triple-column grids, permanent responsive sidebars, integrated sidebar navigation.`
  },
  roadmap: {
    titleEn: 'Milestones & Phase One Roadmap',
    titleAr: 'الأهداف وخارطة طريق المرحلة الأولى',
    markdown: `### 1. Milestone Tracking Plan
The launch of the Masari Platform is structured into six high-craft phases ensuring zero regression and pristine stability.

*   **Milestone 1: Architectural Baseline (Weeks 1-2) - Current Turn Completed**
    *   Setup clean directory structure, declare type definitions, and configure multi-language tailwind theme tokens.
    *   Formulate Firestore and REST API interfaces.
*   **Milestone 2: Navigation & Onboarding UI (Weeks 3-4)**
    *   Implement GoRouter state and register localized onboarding cards.
    *   Design high-fidelity Login, Signup, and OTP forms.
*   **Milestone 3: Core Booking Views (Weeks 5-6)**
    *   Build flights searching form and results cards.
    *   Formulate lists for Hajj, Umrah, and Tour packages.
*   **Milestone 4: Firebase Provisioning & Integration (Weeks 7-8)**
    *   Provision Firestore DB instance and build repository adapter classes.
    *   Enable Firebase Auth login and user sessions.
*   **Milestone 5: Advanced Modules Integration (Weeks 9-10)**
    *   Deploy cloud functions for payment transactions.
    *   Incorporate Digital Wallet, push alerts, and booking status boards.
*   **Milestone 6: QA, Performance Hardening, and Launch (Weeks 11-12)**
    *   Rigorous integration tests, optimize image loading times, and deploy live on Cloud Run.

---

### 2. Quality Assurance Checklist
- [x] Arabic RTL alignment and Cairo typography configurations
- [x] Clean directory specifications modeled after Enterprise patterns
- [x] Complete REST API models detailing flight searches and booking requests
- [x] Hardened database security guidelines configured
- [x] Double-contrast colors selected and WCAG targets satisfied`
  },
};
