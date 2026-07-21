class HajjCampaignEntity {
  final String campaignId;
  final String agencyName;
  final double price;
  final String departureDate;
  final String itineraryDetails;

  const HajjCampaignEntity({
    required this.campaignId,
    required this.agencyName,
    required this.price,
    required this.departureDate,
    required this.itineraryDetails,
  });
}

abstract class HajjRepository {
  Future<List<HajjCampaignEntity>> getHajjCampaigns();
}

class MockHajjRepository implements HajjRepository {
  @override
  Future<List<HajjCampaignEntity>> getHajjCampaigns() async {
    return [
      const HajjCampaignEntity(
        campaignId: 'hj-101',
        agencyName: 'وكالة البرق للحج والعمرة',
        price: 3500.0,
        departureDate: '1447-11-25',
        itineraryDetails: 'شامل الطيران والفنادق الممتازة في مكة والمدينة',
      )
    ];
  }
}
