import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/transport_service.dart';
import '../../domain/repositories/transport_repository.dart';

class MockTransportRepository implements TransportRepository {
  final List<TransportServiceEntity> _mockDatabase = [];

  MockTransportRepository() {
    // Seed flights
    _mockDatabase.add(const TransportServiceEntity(
      serviceId: 'fl-701',
      mode: TransportMode.flight,
      providerName: 'Yemenia Airways',
      providerLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=50&q=80',
      departureLocation: 'SAH',
      arrivalLocation: 'CAI',
      departureTime: '2026-08-01 08:30:00',
      arrivalTime: '2026-08-01 11:30:00',
      basePrice: 450.0,
      capacity: 180,
      availableSeats: 45,
      specDetails: {
        'cabinClass': 'Economy',
        'baggageLimitKg': 30,
        'stopsCount': 0,
      },
    ));

    // Seed bus bookings
    _mockDatabase.add(const TransportServiceEntity(
      serviceId: 'bs-401',
      mode: TransportMode.bus,
      providerName: 'Yemen Express Bus',
      providerLogo: '',
      departureLocation: 'Sanaa',
      arrivalLocation: 'Aden',
      departureTime: '2026-08-01 06:00:00',
      arrivalTime: '2026-08-01 14:00:00',
      basePrice: 25.0,
      capacity: 45,
      availableSeats: 12,
      specDetails: {
        'busType': 'Super VIP Deluxe',
        'hasWifi': true,
        'hasAc': true,
      },
    ));

    // Seed car rentals
    _mockDatabase.add(const TransportServiceEntity(
      serviceId: 'cr-201',
      mode: TransportMode.carRental,
      providerName: 'Avis Yemen',
      providerLogo: '',
      departureLocation: 'Sanaa Airport',
      arrivalLocation: 'Sanaa Airport',
      departureTime: '2026-08-01 09:00:00',
      arrivalTime: '2026-08-05 09:00:00',
      basePrice: 60.0, // Per day
      capacity: 5,
      availableSeats: 3,
      specDetails: {
        'vehicleClass': 'SUV',
        'vehicleModel': 'Toyota Land Cruiser',
        'transmission': 'Automatic',
        'fuelType': 'Petrol',
      },
    ));
  }

  @override
  Future<List<TransportServiceEntity>> searchServices({
    required TransportMode mode,
    required String departure,
    required String arrival,
    required String date,
  }) async {
    await Future.delayed(const Duration(milliseconds: 400));
    return _mockDatabase.where((service) => service.mode == mode).toList();
  }

  @override
  Future<TransportServiceEntity> getServiceDetails(String serviceId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _mockDatabase.firstWhere((service) => service.serviceId == serviceId);
  }
}

final transportRepositoryProvider = Provider<TransportRepository>((ref) => MockTransportRepository());
