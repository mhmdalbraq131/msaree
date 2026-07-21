import '../entities/booking_entity.dart';

abstract class BookingRepository {
  Future<BookingEntity> getBookingById(String bookingId);
  Future<List<BookingEntity>> getBookingsByUserId(String userId);
  Future<void> createBooking(BookingEntity booking);
  Future<void> updateBookingStatus(String bookingId, BookingStatus status);
}
