class UmrahProgramEntity {
  final String programId;
  final String title;
  final double price;
  final String duration;

  const UmrahProgramEntity({
    required this.programId,
    required this.title,
    required this.price,
    required this.duration,
  });
}

abstract class UmrahRepository {
  Future<List<UmrahProgramEntity>> getUmrahPrograms();
}

class MockUmrahRepository implements UmrahRepository {
  @override
  Future<List<UmrahProgramEntity>> getUmrahPrograms() async {
    return [
      const UmrahProgramEntity(
        programId: 'u-1',
        title: 'برنامج العمرة الاقتصادي المتميز',
        price: 499.0,
        duration: '10 أيام',
      )
    ];
  }
}
