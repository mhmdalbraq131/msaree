import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../authentication/domain/entities/user_entity.dart';
import '../../domain/repositories/user_repository.dart';
import '../../../authentication/data/repositories/auth_repository_impl.dart';

class MockUserRepository implements UserRepository {
  UserEntity _user;

  MockUserRepository(this._user);

  @override
  Future<UserEntity> getUserProfile(String userId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _user;
  }

  @override
  Future<void> updateUserProfile(UserEntity user) async {
    await Future.delayed(const Duration(milliseconds: 600));
    _user = user;
  }

  @override
  Future<void> addSavedTraveler(String userId, SavedTraveler traveler) async {
    final list = List<SavedTraveler>.from(_user.savedTravelers)..add(traveler);
    _user = _user.copyWith(savedTravelers: list);
  }

  @override
  Future<void> removeSavedTraveler(String userId, String travelerId) async {
    final list = List<SavedTraveler>.from(_user.savedTravelers)..removeWhere((t) => t.id == travelerId);
    _user = _user.copyWith(savedTravelers: list);
  }

  @override
  Future<void> addSavedDocument(String userId, SavedDocument document) async {
    final list = List<SavedDocument>.from(_user.savedDocuments)..add(document);
    _user = _user.copyWith(savedDocuments: list);
  }

  @override
  Future<void> removeSavedDocument(String userId, String documentId) async {
    final list = List<SavedDocument>.from(_user.savedDocuments)..removeWhere((d) => d.id == documentId);
    _user = _user.copyWith(savedDocuments: list);
  }

  @override
  Future<void> addSavedAddress(String userId, SavedAddress address) async {
    final list = List<SavedAddress>.from(_user.savedAddresses)..add(address);
    _user = _user.copyWith(savedAddresses: list);
  }

  @override
  Future<void> removeSavedAddress(String userId, String addressId) async {
    final list = List<SavedAddress>.from(_user.savedAddresses)..removeWhere((a) => a.id == addressId);
    _user = _user.copyWith(savedAddresses: list);
  }
}

class MockTravelPreferenceRepository implements TravelPreferenceRepository {
  TravelPreferences _prefs = const TravelPreferences();

  @override
  Future<TravelPreferences> getTravelPreferences(String userId) async {
    return _prefs;
  }

  @override
  Future<void> saveTravelPreferences(String userId, TravelPreferences preferences) async {
    _prefs = preferences;
  }
}

// Dependency Injection Providers
final userRepositoryProvider = Provider<UserRepository>((ref) {
  // Watch auth repository to get the live mocked user session
  final authRepo = ref.watch(authRepositoryProvider);
  return MockUserRepository(const UserEntity(
    id: 'usr-101',
    fullName: 'محمد البرق',
    email: 'mhmdalbraq131@gmail.com',
    phone: '+967 777 123 456',
    nationality: 'اليمن',
    dob: '1995-12-10',
  ));
});

final travelPreferenceRepositoryProvider = Provider<TravelPreferenceRepository>((ref) => MockTravelPreferenceRepository());
