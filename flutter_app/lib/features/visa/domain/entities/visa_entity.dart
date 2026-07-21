class VisaRequirementEntity {
  final String visaId;
  final String countryName;
  final double applicationFee;
  final String processingTime;

  const VisaRequirementEntity({
    required this.visaId,
    required this.countryName,
    required this.applicationFee,
    required this.processingTime,
  });
}

abstract class VisaRepository {
  Future<List<VisaRequirementEntity>> getVisaRequirements();
}

class MockVisaRepository implements VisaRepository {
  @override
  Future<List<VisaRequirementEntity>> getVisaRequirements() async {
    return [
      const VisaRequirementEntity(
        visaId: 'v-1',
        countryName: 'المملكة العربية السعودية (زيارة سياحية)',
        applicationFee: 120.0,
        processingTime: '24-48 ساعة',
      )
    ];
  }
}
