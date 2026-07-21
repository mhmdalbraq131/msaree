enum TransportMode {
  flight,
  bus,
  carRental,
  privateTransfer,
  airportTransfer,
  train,
  ferry,
}

enum TransportServiceStatus {
  available,
  fullyBooked,
  suspended,
  cancelled,
}

class TransportServiceEntity {
  final String serviceId;
  final TransportMode mode;
  final String providerName;
  final String providerLogo;
  final String departureLocation;
  final String arrivalLocation;
  final String departureTime;
  final String arrivalTime;
  final double basePrice;
  final String currency;
  final int capacity;
  final int availableSeats;
  final TransportServiceStatus status;
  
  // High extensibility for mode-specific details (e.g. cabin class, baggage limit, bus type)
  final Map<String, dynamic> specDetails;

  const TransportServiceEntity({
    required this.serviceId,
    required this.mode,
    required this.providerName,
    required this.providerLogo,
    required this.departureLocation,
    required this.arrivalLocation,
    required this.departureTime,
    required this.arrivalTime,
    required this.basePrice,
    this.currency = 'USD',
    required this.capacity,
    required this.availableSeats,
    this.status = TransportServiceStatus.available,
    this.specDetails = const {},
  });

  TransportServiceEntity copyWith({
    String? serviceId,
    TransportMode? mode,
    String? providerName,
    String? providerLogo,
    String? departureLocation,
    String? arrivalLocation,
    String? departureTime,
    String? arrivalTime,
    double? basePrice,
    String? currency,
    int? capacity,
    int? availableSeats,
    TransportServiceStatus? status,
    Map<String, dynamic>? specDetails,
  }) {
    return TransportServiceEntity(
      serviceId: serviceId ?? this.serviceId,
      mode: mode ?? this.mode,
      providerName: providerName ?? this.providerName,
      providerLogo: providerLogo ?? this.providerLogo,
      departureLocation: departureLocation ?? this.departureLocation,
      arrivalLocation: arrivalLocation ?? this.arrivalLocation,
      departureTime: departureTime ?? this.departureTime,
      arrivalTime: arrivalTime ?? this.arrivalTime,
      basePrice: basePrice ?? this.basePrice,
      currency: currency ?? this.currency,
      capacity: capacity ?? this.capacity,
      availableSeats: availableSeats ?? this.availableSeats,
      status: status ?? this.status,
      specDetails: specDetails ?? this.specDetails,
    );
  }

  Map<String, dynamic> toJson() => {
        'serviceId': serviceId,
        'mode': mode.name,
        'providerName': providerName,
        'providerLogo': providerLogo,
        'departureLocation': departureLocation,
        'arrivalLocation': arrivalLocation,
        'departureTime': departureTime,
        'arrivalTime': arrivalTime,
        'basePrice': basePrice,
        'currency': currency,
        'capacity': capacity,
        'availableSeats': availableSeats,
        'status': status.name,
        'specDetails': specDetails,
      };

  factory TransportServiceEntity.fromJson(Map<String, dynamic> json) => TransportServiceEntity(
        serviceId: json['serviceId'] as String,
        mode: TransportMode.values.firstWhere((e) => e.name == json['mode']),
        providerName: json['providerName'] as String,
        providerLogo: json['providerLogo'] as String? ?? '',
        departureLocation: json['departureLocation'] as String,
        arrivalLocation: json['arrivalLocation'] as String,
        departureTime: json['departureTime'] as String,
        arrivalTime: json['arrivalTime'] as String,
        basePrice: (json['basePrice'] as num).toDouble(),
        currency: json['currency'] as String? ?? 'USD',
        capacity: json['capacity'] as int? ?? 1,
        availableSeats: json['availableSeats'] as int? ?? 1,
        status: TransportServiceStatus.values.firstWhere((e) => e.name == json['status'], orElse: () => TransportServiceStatus.available),
        specDetails: Map<String, dynamic>.from(json['specDetails'] ?? {}),
      );
}
