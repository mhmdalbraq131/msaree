import '../../../authentication/domain/entities/user_entity.dart';

abstract class UserRepository {
  Future<UserEntity> getUserProfile(String userId);
  Future<void> updateUserProfile(UserEntity user);
  Future<void> addSavedTraveler(String userId, SavedTraveler traveler);
  Future<void> removeSavedTraveler(String userId, String travelerId);
  Future<void> addSavedDocument(String userId, SavedDocument document);
  Future<void> removeSavedDocument(String userId, String documentId);
  Future<void> addSavedAddress(String userId, SavedAddress address);
  Future<void> removeSavedAddress(String userId, String addressId);
}

abstract class TravelPreferenceRepository {
  Future<TravelPreferences> getTravelPreferences(String userId);
  Future<void> saveTravelPreferences(String userId, TravelPreferences preferences);
}
