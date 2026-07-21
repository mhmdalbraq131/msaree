enum BookingType {
  flight,
  hotel,
  bus,
  car,
  transfer,
  visa,
  tourismPackage,
  hajj,
  umrah,
}

enum BookingStatus {
  pending,
  confirmed,
  cancelled,
  completed,
  refunded,
}

class BookingEntity {
  final String bookingId;
  final String userId;
  final BookingType bookingType;
  final BookingStatus status;
  final double amount;
  final String currency;
  final String createdAt;
  final String travelDate;
  
  // Generic flexible extension parameters for FlightDetails, HotelDetails, etc.
  final Map<String, dynamic> serviceDetails;

  const BookingEntity({
    required this.bookingId,
    required this.userId,
    required this.bookingType,
    this.status = BookingStatus.pending,
    required this.amount,
    this.currency = 'USD',
    required this.createdAt,
    required this.travelDate,
    this.serviceDetails = const {},
  });

  BookingEntity copyWith({
    String? bookingId,
    String? userId,
    BookingType? bookingType,
    BookingStatus? status,
    double? amount,
    String? currency,
    String? createdAt,
    String? travelDate,
    Map<String, dynamic>? serviceDetails,
  }) {
    return BookingEntity(
      bookingId: bookingId ?? this.bookingId,
      userId: userId ?? this.userId,
      bookingType: bookingType ?? this.bookingType,
      status: status ?? this.status,
      amount: amount ?? this.amount,
      currency: currency ?? this.currency,
      createdAt: createdAt ?? this.createdAt,
      travelDate: travelDate ?? this.travelDate,
      serviceDetails: serviceDetails ?? this.serviceDetails,
    );
  }

  Map<String, dynamic> toJson() => {
        'bookingId': bookingId,
        'userId': userId,
        'bookingType': bookingType.name,
        'status': status.name,
        'amount': amount,
        'currency': currency,
        'createdAt': createdAt,
        'travelDate': travelDate,
        'serviceDetails': serviceDetails,
      };

  factory BookingEntity.fromJson(Map<String, dynamic> json) => BookingEntity(
        bookingId: json['bookingId'] as String,
        userId: json['userId'] as String,
        bookingType: BookingType.values.firstWhere((e) => e.name == json['bookingType']),
        status: BookingStatus.values.firstWhere((e) => e.name == json['status'], orElse: () => BookingStatus.pending),
        amount: (json['amount'] as num).toDouble(),
        currency: json['currency'] as String? ?? 'USD',
        createdAt: json['createdAt'] as String,
        travelDate: json['travelDate'] as String,
        serviceDetails: Map<String, dynamic>.from(json['serviceDetails'] ?? {}),
      );
}

// Service Specific Extensions Helpers (Type Safety for each transport/hotel)
class FlightBookingDetails {
  final String flightNumber;
  final String airline;
  final String departureAirport;
  final String arrivalAirport;
  final String departureTime;
  final String arrivalTime;
  final String seatClass; // Economy, Business, First

  const FlightBookingDetails({
    required this.flightNumber,
    required this.airline,
    required this.departureAirport,
    required this.arrivalAirport,
    required this.departureTime,
    required this.arrivalTime,
    required this.seatClass,
  });

  Map<String, dynamic> toJson() => {
        'flightNumber': flightNumber,
        'airline': airline,
        'departureAirport': departureAirport,
        'arrivalAirport': arrivalAirport,
        'departureTime': departureTime,
        'arrivalTime': arrivalTime,
        'seatClass': seatClass,
      };
}

class HotelBookingDetails {
  final String hotelName;
  final String roomType;
  final int nightsCount;
  final String checkInDate;
  final String checkOutDate;
  final bool hasBreakfast;

  const HotelBookingDetails({
    required this.hotelName,
    required this.roomType,
    required this.nightsCount,
    required this.checkInDate,
    required this.checkOutDate,
    required this.hasBreakfast,
  });

  Map<String, dynamic> toJson() => {
        'hotelName': hotelName,
        'roomType': roomType,
        'nightsCount': nightsCount,
        'checkInDate': checkInDate,
        'checkOutDate': checkOutDate,
        'hasBreakfast': hasBreakfast,
      };
}
