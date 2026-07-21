import '../entities/transport_service.dart';

abstract class TransportRepository {
  Future<List<TransportServiceEntity>> searchServices({
    required TransportMode mode,
    required String departure,
    required String arrival,
    required String date,
  });

  Future<TransportServiceEntity> getServiceDetails(String serviceId);
}
