import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/booking_entity.dart';
import '../../domain/repositories/booking_repository.dart';

class MockBookingRepository implements BookingRepository {
  final List<BookingEntity> _bookingsTable = [];

  MockBookingRepository() {
    // Seed a couple of bookings
    _bookingsTable.add(BookingEntity(
      bookingId: 'b-100',
      userId: 'usr-101',
      bookingType: BookingType.flight,
      status: BookingStatus.confirmed,
      amount: 450.0,
      currency: 'USD',
      createdAt: '2026-07-15 11:00:00',
      travelDate: '2026-08-01',
      serviceDetails: const {
        'flightNumber': 'MS-771',
        'airline': 'Yemenia Airways',
        'departureAirport': 'Sanaa Intl (SAH)',
        'arrivalAirport': 'Cairo Intl (CAI)',
        'departureTime': '2026-08-01 08:30:00',
        'seatClass': 'Economy',
      },
    ));

    _bookingsTable.add(BookingEntity(
      bookingId: 'b-101',
      userId: 'usr-101',
      bookingType: BookingType.hotel,
      status: BookingStatus.pending,
      amount: 600.0,
      currency: 'USD',
      createdAt: '2026-07-20 12:00:00',
      travelDate: '2026-08-01',
      serviceDetails: const {
        'hotelName': 'Hilton Ramses Cairo',
        'roomType': 'Deluxe Nile View',
        'nightsCount': 4,
        'checkInDate': '2026-08-01',
        'checkOutDate': '2026-08-05',
      },
    ));
  }

  @override
  Future<BookingEntity> getBookingById(String bookingId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _bookingsTable.firstWhere((b) => b.bookingId == bookingId);
  }

  @override
  Future<List<BookingEntity>> getBookingsByUserId(String userId) async {
    await Future.delayed(const Duration(milliseconds: 400));
    return _bookingsTable.where((b) => b.userId == userId).toList();
  }

  @override
  Future<void> createBooking(BookingEntity booking) async {
    await Future.delayed(const Duration(milliseconds: 500));
    _bookingsTable.add(booking);
  }

  @override
  Future<void> updateBookingStatus(String bookingId, BookingStatus status) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final index = _bookingsTable.indexWhere((b) => b.bookingId == bookingId);
    if (index != -1) {
      _bookingsTable[index] = _bookingsTable[index].copyWith(status: status);
    }
  }
}

final bookingRepositoryProvider = Provider<BookingRepository>((ref) => MockBookingRepository());
