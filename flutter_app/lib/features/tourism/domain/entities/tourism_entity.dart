class TourismPackageEntity {
  final String packageId;
  final String title;
  final String destination;
  final int daysCount;
  final double price;

  const TourismPackageEntity({
    required this.packageId,
    required this.title,
    required this.destination,
    required this.daysCount,
    required this.price,
  });
}

abstract class TourismRepository {
  Future<List<TourismPackageEntity>> getAvailablePackages();
}

class MockTourismRepository implements TourismRepository {
  @override
  Future<List<TourismPackageEntity>> getAvailablePackages() async {
    return [
      const TourismPackageEntity(
        packageId: 'tp-101',
        title: 'باقة مغامرات تركيا الصيفية',
        destination: 'إسطنبول - كابادوكيا',
        daysCount: 7,
        price: 850.0,
      )
    ];
  }
}
