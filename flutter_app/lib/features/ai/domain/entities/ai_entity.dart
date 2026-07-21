class AiRecommendationEntity {
  final String recommendationId;
  final String type; // 'travel_tip', 'cheap_flight', 'personalized_offer'
  final String title;
  final String description;

  const AiRecommendationEntity({
    required this.recommendationId,
    required this.type,
    required this.title,
    required this.description,
  });
}
