import 'package:flutter/foundation.dart';
import '../models/auth_models.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _user != null;

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _error = error;
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final authData = await AuthService.loginWithCredentials(email, password);
      if (authData != null) {
        _user = authData.user;
        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError('Invalid credentials');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Login failed: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  Future<bool> register({
    required String email,
    required String password,
    String? firstName,
    String? lastName,
    String? phone,
  }) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final authData = await AuthService.registerUser(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
      );
      
      if (authData != null) {
        _user = authData.user;
        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError('Registration failed');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Registration failed: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  Future<void> checkAuthStatus() async {
    if (await AuthService.isLoggedIn()) {
      try {
        final user = await AuthService.getCurrentUser();
        if (user != null) {
          _user = user;
          notifyListeners();
        }
      } catch (e) {
        await logout();
      }
    }
  }

  Future<void> logout() async {
    await AuthService.logout();
    _user = null;
    _error = null;
    notifyListeners();
  }

  Future<bool> updateProfile({
    String? firstName,
    String? lastName,
    String? phone,
  }) async {
    _setLoading(true);
    _setError(null);

    try {
      final request = UpdateProfileRequest(
        firstName: firstName,
        lastName: lastName,
        phone: phone,
      );

      final response = await AuthService.updateProfile(request);
      if (response.success) {
        // Update local user data
        if (_user != null) {
          _user = User(
            id: _user!.id,
            email: _user!.email,
            firstName: firstName ?? _user!.firstName,
            lastName: lastName ?? _user!.lastName,
            phone: phone ?? _user!.phone,
            createdAt: _user!.createdAt,
            updatedAt: DateTime.now(),
          );
        }
        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError(response.error ?? 'Profile update failed');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Profile update failed: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  Future<bool> changePassword(String oldPassword, String newPassword) async {
    _setLoading(true);
    _setError(null);

    try {
      final request = ChangePasswordRequest(
        oldPassword: oldPassword,
        newPassword: newPassword,
      );

      final response = await AuthService.changePassword(request);
      if (response.success) {
        _setLoading(false);
        return true;
      } else {
        _setError(response.error ?? 'Password change failed');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Password change failed: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}