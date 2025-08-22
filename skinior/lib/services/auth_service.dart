import '../models/auth_models.dart';
import 'api_client.dart';

class AuthService {
  static const String _baseEndpoint = '/auth';

  static Future<ApiResponse> register(RegisterRequest request) async {
    return await ApiClient.post('$_baseEndpoint/register', body: request.toJson());
  }

  static Future<ApiResponse> login(LoginRequest request) async {
    return await ApiClient.post('$_baseEndpoint/login', body: request.toJson());
  }

  static Future<ApiResponse> getProfile() async {
    return await ApiClient.get('$_baseEndpoint/me');
  }

  static Future<ApiResponse> refreshToken() async {
    return await ApiClient.post('$_baseEndpoint/refresh');
  }

  static Future<ApiResponse> updateProfile(UpdateProfileRequest request) async {
    return await ApiClient.put('/users/profile', body: request.toJson());
  }

  static Future<ApiResponse> changePassword(ChangePasswordRequest request) async {
    return await ApiClient.put('/users/change-password', body: request.toJson());
  }

  static Future<bool> isLoggedIn() async {
    final token = await ApiClient.getToken();
    return token != null && token.isNotEmpty;
  }

  static Future<void> logout() async {
    await ApiClient.clearToken();
  }

  static Future<AuthData?> loginWithCredentials(String email, String password) async {
    final request = LoginRequest(email: email, password: password);
    final response = await login(request);
    
    if (response.success && response.data != null) {
      final authResponse = AuthResponse.fromJson(response.data);
      await ApiClient.setToken(authResponse.data.authToken!);
      return authResponse.data;
    }
    
    return null;
  }

  static Future<AuthData?> registerUser({
    required String email,
    required String password,
    String? firstName,
    String? lastName,
    String? phone,
  }) async {
    final request = RegisterRequest(
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
    );
    
    final response = await register(request);
    
    if (response.success && response.data != null) {
      final authResponse = AuthResponse.fromJson(response.data);
      await ApiClient.setToken(authResponse.data.authToken!);
      return authResponse.data;
    }
    
    return null;
  }

  static Future<User?> getCurrentUser() async {
    final response = await getProfile();
    
    if (response.success && response.data != null) {
      if (response.data['data'] != null && response.data['data']['user'] != null) {
        return User.fromJson(response.data['data']['user']);
      }
    }
    
    return null;
  }
}