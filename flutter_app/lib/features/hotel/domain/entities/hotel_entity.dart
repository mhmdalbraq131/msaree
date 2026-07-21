class HotelEntity {
  final String hotelId;
  final String name;
  final String city;
  final double starRating;
  final double pricePerNight;
  final String description;

  const HotelEntity({
    required this.hotelId,
    required this.name,
    required this.city,
    required this.starRating,
    required this.pricePerNight,
    required this.description,
  });
}

abstract class HotelRepository {
  Future<List<HotelEntity>> searchHotels(String city);
}

class MockHotelRepository implements HotelRepository {
  @override
  Future<List<HotelEntity>> searchHotels(String city) async {
    return [
      const HotelEntity(
        hotelId: 'h-101',
        name: 'فندق هيلتون رمسيس القاهرة',
        city: 'القاهرة',
        starRating: 5.0,
        pricePerNight: 150.0,
        description: 'إطلالة ساحرة على النيل',
      )
    ];
  }
}
