import 'package:flutter_riverpod/flutter_riverpod.dart';

// ==========================================
// 1. DATA ENTITIES/MODELS FOR THE PLATFORM
// ==========================================

class FlightEntity {
  final String id;
  final String airline;
  final String airlineLogoUrl;
  final String flightNo;
  final String from;
  final String to;
  final String departureTime;
  final String arrivalTime;
  final String duration;
  final int stops;
  final double priceUSD;
  final String classType;

  FlightEntity({
    required this.id,
    required this.airline,
    required this.airlineLogoUrl,
    required this.flightNo,
    required this.from,
    required this.to,
    required this.departureTime,
    required this.arrivalTime,
    required this.duration,
    required this.stops,
    required this.priceUSD,
    required this.classType,
  });
}

class HotelEntity {
  final String id;
  final String nameAr;
  final String nameEn;
  final String locationAr;
  final String locationEn;
  final double rating;
  final double pricePerNightUSD;
  final List<String> images;
  final List<String> amenitiesAr;
  final List<String> amenitiesEn;

  HotelEntity({
    required this.id,
    required this.nameAr,
    required this.nameEn,
    required this.locationAr,
    required this.locationEn,
    required this.rating,
    required this.pricePerNightUSD,
    required this.images,
    required this.amenitiesAr,
    required this.amenitiesEn,
  });
}

class TourismPackageEntity {
  final String id;
  final String titleAr;
  final String titleEn;
  final double priceUSD;
  final int durationDays;
  final String countryAr;
  final String countryEn;
  final String image;
  final List<String> highlightsAr;
  final List<String> highlightsEn;

  TourismPackageEntity({
    required this.id,
    required this.titleAr,
    required this.titleEn,
    required this.priceUSD,
    required this.durationDays,
    required this.countryAr,
    required this.countryEn,
    required this.image,
    required this.highlightsAr,
    required this.highlightsEn,
  });
}

class HajjPackageEntity {
  final String id;
  final String titleAr;
  final String titleEn;
  final double priceUSD;
  final String hotelAr;
  final String hotelEn;
  final int durationDays;
  final int capacityMax;
  final double rating;
  final List<String> featuresAr;
  final List<String> featuresEn;
  final String image;

  HajjPackageEntity({
    required this.id,
    required this.titleAr,
    required this.titleEn,
    required this.priceUSD,
    required this.hotelAr,
    required this.hotelEn,
    required this.durationDays,
    required this.capacityMax,
    required this.rating,
    required this.featuresAr,
    required this.featuresEn,
    required this.image,
  });
}

class UmrahPackageEntity {
  final String id;
  final String titleAr;
  final String titleEn;
  final double priceUSD;
  final int durationDays;
  final String hotelMakkahAr;
  final String hotelMakkahEn;
  final String hotelMadinahAr;
  final String hotelMadinahEn;
  final bool flightsIncluded;
  final bool transportIncluded;
  final String airlineLogo;
  final String airlineNameAr;
  final String airlineNameEn;
  final String image;

  UmrahPackageEntity({
    required this.id,
    required this.titleAr,
    required this.titleEn,
    required this.priceUSD,
    required this.durationDays,
    required this.hotelMakkahAr,
    required this.hotelMakkahEn,
    required this.hotelMadinahAr,
    required this.hotelMadinahEn,
    required this.flightsIncluded,
    required this.transportIncluded,
    required this.airlineLogo,
    required this.airlineNameAr,
    required this.airlineNameEn,
    required this.image,
  });
}

class OfferEntity {
  final String id;
  final String titleAr;
  final String titleEn;
  final String descAr;
  final String descEn;
  final double discountPercent;
  final String promoCode;
  final String bannerImageUrl;

  OfferEntity({
    required this.id,
    required this.titleAr,
    required this.titleEn,
    required this.descAr,
    required this.descEn,
    required this.discountPercent,
    required this.promoCode,
    required this.bannerImageUrl,
  });
}

class BookingEntity {
  final String id;
  final String bookingRef;
  final String type; // flight, hotel, tourism, hajj, umrah
  final String titleAr;
  final String titleEn;
  final double priceUSD;
  final String bookingDate;
  final String departureDate;
  final String status; // confirmed, pending, completed, cancelled
  final Map<String, dynamic> details;

  BookingEntity({
    required this.id,
    required this.bookingRef,
    required this.type,
    required this.titleAr,
    required this.titleEn,
    required this.priceUSD,
    required this.bookingDate,
    required this.departureDate,
    required this.status,
    required this.details,
  });
}

class NotificationEntity {
  final String id;
  final String titleAr;
  final String titleEn;
  final String bodyAr;
  final String bodyEn;
  final String timestamp;
  final bool isRead;

  NotificationEntity({
    required this.id,
    required this.titleAr,
    required this.titleEn,
    required this.bodyAr,
    required this.bodyEn,
    required this.timestamp,
    required this.isRead,
  });
}

class ProfileEntity {
  final String name;
  final String email;
  final String phone;
  final String avatarUrl;
  final String loyaltyTier;
  final double walletBalance;

  ProfileEntity({
    required this.name,
    required this.email,
    required this.phone,
    required this.avatarUrl,
    required this.loyaltyTier,
    required this.walletBalance,
  });
}

class SettingsEntity {
  final String currentLanguage;
  final String currentCurrency;
  final String currentTheme;
  final bool notificationsEnabled;

  SettingsEntity({
    required this.currentLanguage,
    required this.currentCurrency,
    required this.currentTheme,
    required this.notificationsEnabled,
  });
}

// ==========================================
// 2. ABSTRACT CORE REPOSITORIES INTERFACES
// ==========================================

abstract class FlightRepository {
  Future<List<FlightEntity>> searchFlights(String from, String to, String date);
  Future<FlightEntity?> getFlightById(String id);
}

abstract class HotelRepository {
  Future<List<HotelEntity>> getHotels(String city);
  Future<HotelEntity?> getHotelById(String id);
}

abstract class TourismRepository {
  Future<List<TourismPackageEntity>> getTourismPackages();
  Future<List<TourismPackageEntity>> filterPackagesByCountry(String country);
}

abstract class HajjRepository {
  Future<List<HajjPackageEntity>> getHajjPackages();
}

abstract class UmrahRepository {
  Future<List<UmrahPackageEntity>> getUmrahPackages();
}

abstract class OfferRepository {
  Future<List<OfferEntity>> getActiveOffers();
}

abstract class BookingRepository {
  Future<List<BookingEntity>> getMyBookings();
  Future<BookingEntity> createBooking(BookingEntity booking);
  Future<bool> cancelBooking(String bookingId);
}

abstract class NotificationRepository {
  Future<List<NotificationEntity>> getNotifications();
  Future<void> markAsRead(String notificationId);
}

abstract class ProfileRepository {
  Future<ProfileEntity> getProfile();
  Future<ProfileEntity> updateProfile(ProfileEntity profile);
}

abstract class SettingsRepository {
  Future<SettingsEntity> getSettings();
  Future<void> saveSettings(SettingsEntity settings);
}

// ==========================================
// 3. MOCK SOURCE REPOSITORY IMPLEMENTATIONS
// ==========================================

class MockFlightRepository implements FlightRepository {
  @override
  Future<List<FlightEntity>> searchFlights(String from, String to, String date) async {
    await Future.delayed(const Duration(milliseconds: 800));
    return [
      FlightEntity(
        id: 'f-1',
        airline: 'Yemenia Airways',
        airlineLogoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=50&q=80',
        flightNo: 'IY-607',
        from: 'Sanaa (SAH)',
        to: 'Cairo (CAI)',
        departureTime: '08:30 AM',
        arrivalTime: '11:45 AM',
        duration: '3h 15m',
        stops: 0,
        priceUSD: 450.0,
        classType: 'Economy',
      ),
      FlightEntity(
        id: 'f-2',
        airline: 'EgyptAir',
        airlineLogoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=50&q=80',
        flightNo: 'MS-842',
        from: 'Aden (ADE)',
        to: 'Cairo (CAI)',
        departureTime: '02:00 PM',
        arrivalTime: '05:30 PM',
        duration: '3h 30m',
        stops: 0,
        priceUSD: 480.0,
        classType: 'Economy',
      )
    ];
  }

  @override
  Future<FlightEntity?> getFlightById(String id) async => null;
}

class MockHotelRepository implements HotelRepository {
  @override
  Future<List<HotelEntity>> getHotels(String city) async {
    await Future.delayed(const Duration(milliseconds: 800));
    return [
      HotelEntity(
        id: 'h-1',
        nameAr: 'فندق سيزونز روتانا مكة',
        nameEn: 'Rotana Seasons Makkah',
        locationAr: 'مكة المكرمة - شارع أجياد',
        locationEn: 'Makkah - Ajyad Street',
        rating: 4.8,
        pricePerNightUSD: 180.0,
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'],
        amenitiesAr: ['إفطار مجاني', 'قريب من الحرم', 'واي فاي مجاني'],
        amenitiesEn: ['Free Breakfast', 'Close to Haram', 'Free WiFi'],
      ),
      HotelEntity(
        id: 'h-2',
        nameAr: 'فندق شيراتون المدينة المنورة',
        nameEn: 'Sheraton Madinah Hotel',
        locationAr: 'المدينة المنورة - المنطقة المركزية',
        locationEn: 'Madinah - Central Area',
        rating: 4.7,
        pricePerNightUSD: 140.0,
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80'],
        amenitiesAr: ['توصيل للحرم', 'مطعم فاخر', 'موقف سيارات'],
        amenitiesEn: ['Shuttle to Haram', 'Luxury Dining', 'Parking'],
      )
    ];
  }

  @override
  Future<HotelEntity?> getHotelById(String id) async => null;
}

class MockTourismRepository implements TourismRepository {
  @override
  Future<List<TourismPackageEntity>> getTourismPackages() async {
    return [
      TourismPackageEntity(
        id: 't-1',
        titleAr: 'سحر إسطنبول التاريخية والبوسفور المذهل',
        titleEn: 'Magic of Istanbul & Breathtaking Bosphorus',
        priceUSD: 799.0,
        durationDays: 7,
        countryAr: 'تركيا',
        countryEn: 'Turkey',
        image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80',
        highlightsAr: ['رحلة البوسفور', 'زيارة آيا صوفيا', 'التسوق في البازار الكبير'],
        highlightsEn: ['Bosphorus Cruise', 'Hagia Sophia Guided Tour', 'Grand Bazaar Shopping'],
      ),
      TourismPackageEntity(
        id: 't-2',
        titleAr: 'باقة دبي الفاخرة مع جولات المغامرة والتسوق',
        titleEn: 'Dubai Luxury Getaway & Desert Safaris',
        priceUSD: 950.0,
        durationDays: 5,
        countryAr: 'الإمارات',
        countryEn: 'UAE',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
        highlightsAr: ['قمة برج خليفة', 'سفاري رملي فاخر', 'جولة حديقة الزهور'],
        highlightsEn: ['Burj Khalifa Observation Deck', 'VIP Desert Safari', 'Miracle Garden Tour'],
      )
    ];
  }

  @override
  Future<List<TourismPackageEntity>> filterPackagesByCountry(String country) async {
    final list = await getTourismPackages();
    return list.where((element) => element.countryEn.toLowerCase() == country.toLowerCase()).toList();
  }
}

class MockHajjRepository implements HajjRepository {
  @override
  Future<List<HajjPackageEntity>> getHajjPackages() async {
    return [
      HajjPackageEntity(
        id: 'hj-1',
        titleAr: 'باقة الحج الملكية الفاخرة لعام 1447هـ',
        titleEn: 'Masari Royal Elite Hajj Package 1447 AH',
        priceUSD: 4999.0,
        hotelAr: 'أبراج الساعة مكة المكرمة (5 نجوم)',
        hotelEn: 'Clock Towers Makkah (5-Star Luxury)',
        durationDays: 21,
        capacityMax: 50,
        rating: 5.0,
        featuresAr: ['تذاكر طيران مباشرة', 'سكن خاص متميز في منى وعرفات', 'بوفيه طعام متكامل 24 ساعة', 'إرشاد ديني وصحي على مدار الساعة'],
        featuresEn: ['Direct Business Flight', 'VIP Camps in Mina & Arafat', 'All-Inclusive 24/7 Buffet', 'Continuous Medical & Religious Guide'],
        image: 'https://images.unsplash.com/photo-1565552645632-d7c5f7ebe166?w=600&q=80',
      )
    ];
  }
}

class MockUmrahRepository implements UmrahRepository {
  @override
  Future<List<UmrahPackageEntity>> getUmrahPackages() async {
    return [
      UmrahPackageEntity(
        id: 'u-1',
        titleAr: 'عمرة التوحيد والسكينة لشهر شعبان',
        titleEn: 'Umrah of Serenity & Tranquility (Shaban Special)',
        priceUSD: 1150.0,
        durationDays: 10,
        hotelMakkahAr: 'فندق روتانا مكة (4 نجوم)',
        hotelMakkahEn: 'Rotana Makkah Hotel (4-Star)',
        hotelMadinahAr: 'فندق دار السلام (4 نجوم)',
        hotelMadinahEn: 'Dar Al Salam Madinah (4-Star)',
        flightsIncluded: true,
        transportIncluded: true,
        airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=50&q=80',
        airlineNameAr: 'طيران السعيدة',
        airlineNameEn: 'Felix Airways',
        image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80',
      )
    ];
  }
}

class MockOfferRepository implements OfferRepository {
  @override
  Future<List<OfferEntity>> getActiveOffers() async {
    return [
      OfferEntity(
        id: 'o-1',
        titleAr: 'خصم الذكرى السنوية لمنصة مساري',
        titleEn: 'Masari Anniversary Golden Savings',
        descAr: 'وفر حتى 500 دولار على باقات العمرة العائلية الحصرية.',
        descEn: 'Save up to \$500 on family Umrah packages with coupon code.',
        discountPercent: 15.0,
        promoCode: 'MASARI15',
        bannerImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
      )
    ];
  }
}

class MockBookingRepository implements BookingRepository {
  final List<BookingEntity> _bookings = [
    BookingEntity(
      id: 'b-100',
      bookingRef: 'MSR-2026-FLI8839',
      type: 'flight',
      titleAr: 'طيران اليمنية • صنعاء - القاهرة',
      titleEn: 'Yemenia Airways • Sanaa - Cairo',
      priceUSD: 450.0,
      bookingDate: '2026-07-15',
      departureDate: '2026-08-10',
      status: 'confirmed',
      details: {'passengers': 1, 'email': 'mhmdalbraq131@gmail.com', 'phone': '+967 777 123 456'},
    )
  ];

  @override
  Future<List<BookingEntity>> getMyBookings() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _bookings;
  }

  @override
  Future<BookingEntity> createBooking(BookingEntity booking) async {
    _bookings.add(booking);
    return booking;
  }

  @override
  Future<bool> cancelBooking(String bookingId) async {
    _bookings.removeWhere((element) => element.id == bookingId);
    return true;
  }
}

class MockNotificationRepository implements NotificationRepository {
  @override
  Future<List<NotificationEntity>> getNotifications() async {
    return [
      NotificationEntity(
        id: 'n-1',
        titleAr: 'تم تأكيد طلب الحجز بنجاح',
        titleEn: 'Booking Request Confirmed Successfully',
        bodyAr: 'عزيزي محمد، تم تأكيد باقة العمرة وجاري استخراج تأشيرتك.',
        bodyEn: 'Dear Mohamed, your Umrah package booking was successfully finalized.',
        timestamp: '10 mins ago',
        isRead: false,
      )
    ];
  }

  @override
  Future<void> markAsRead(String notificationId) async {}
}

class MockProfileRepository implements ProfileRepository {
  @override
  Future<ProfileEntity> getProfile() async {
    return ProfileEntity(
      name: 'محمد البرق',
      email: 'mhmdalbraq131@gmail.com',
      phone: '+967 777 123 456',
      avatarUrl: '',
      loyaltyTier: 'VIP Elite',
      walletBalance: 0.0,
    );
  }

  @override
  Future<ProfileEntity> updateProfile(ProfileEntity profile) async => profile;
}

class MockSettingsRepository implements SettingsRepository {
  @override
  Future<SettingsEntity> getSettings() async {
    return SettingsEntity(
      currentLanguage: 'ar',
      currentCurrency: 'USD',
      currentTheme: 'Royal Gold',
      notificationsEnabled: true,
    );
  }

  @override
  Future<void> saveSettings(SettingsEntity settings) async {}
}

// ==========================================
// 4. RIVERPOD DEPENDENCY INJECTION PROVIDERS
// ==========================================

final flightRepositoryProvider = Provider<FlightRepository>((ref) => MockFlightRepository());
final hotelRepositoryProvider = Provider<HotelRepository>((ref) => MockHotelRepository());
final tourismRepositoryProvider = Provider<TourismRepository>((ref) => MockTourismRepository());
final hajjRepositoryProvider = Provider<HajjRepository>((ref) => MockHajjRepository());
final umrahRepositoryProvider = Provider<UmrahRepository>((ref) => MockUmrahRepository());
final offerRepositoryProvider = Provider<OfferRepository>((ref) => MockOfferRepository());
final bookingRepositoryProvider = Provider<BookingRepository>((ref) => MockBookingRepository());
final notificationRepositoryProvider = Provider<NotificationRepository>((ref) => MockNotificationRepository());
final profileRepositoryProvider = Provider<ProfileRepository>((ref) => MockProfileRepository());
final settingsRepositoryProvider = Provider<SettingsRepository>((ref) => MockSettingsRepository());
