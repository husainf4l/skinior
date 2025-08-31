import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const String baseUrl = 'https://skinior.com/api';
  static const String loginEndpoint = '/auth/login';
  static const String registerEndpoint = '/auth/register';
  static const String socialLoginEndpoint = '/auth/social-login';

  // Login method
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$loginEndpoint'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      print('Login Response Status: ${response.statusCode}');
      print('Login Response Body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        print('Login Parsed Data: $data');
        
        // Check if response has the expected structure
        if (data['user'] != null && data['tokens'] != null) {
          // Store tokens
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('accessToken', data['tokens']['accessToken']);
          await prefs.setString('refreshToken', data['tokens']['refreshToken']);
          await prefs.setString('user', jsonEncode(data['user']));
          return {'success': true, 'message': 'Login successful'};
        } else {
          return {
            'success': false,
            'message': data['message'] ?? 'Login failed - Invalid response format',
          };
        }
      } else {
        return {
          'success': false,
          'message': 'Server error: ${response.statusCode} - ${response.body}',
        };
      }
    } catch (e) {
      print('Login Error: $e');
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  // Register method
  Future<Map<String, dynamic>> register(
    String name,
    String email,
    String password,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$registerEndpoint'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'name': name, 'email': email, 'password': password}),
      );

      print('Register Response Status: ${response.statusCode}');
      print('Register Response Body: ${response.body}');

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        print('Register Parsed Data: $data');
        
        // Check if response has the expected structure (successful registration)
        if (data['user'] != null) {
          return {'success': true, 'message': 'Registration successful! Please login.'};
        } else {
          return {
            'success': false,
            'message': data['message'] ?? 'Registration failed',
          };
        }
      } else {
        return {
          'success': false,
          'message': 'Server error: ${response.statusCode} - ${response.body}',
        };
      }
    } catch (e) {
      print('Register Error: $e');
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  // Social Login method (Google/Apple)
  Future<Map<String, dynamic>> socialLogin(
    String provider,
    Map<String, dynamic> tokens,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$socialLoginEndpoint'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'provider': provider,
          ...tokens,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        if (data['user'] != null && data['tokens'] != null) {
          // Store tokens
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('accessToken', data['tokens']['accessToken']);
          await prefs.setString('refreshToken', data['tokens']['refreshToken']);
          await prefs.setString('user', jsonEncode(data['user']));
          return {'success': true, 'message': 'Social login successful'};
        } else {
          return {
            'success': false,
            'message': data['message'] ?? 'Social login failed',
          };
        }
      } else {
        return {
          'success': false,
          'message': 'Server error: ${response.statusCode}',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  // Logout method
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('accessToken');
    await prefs.remove('refreshToken');
    await prefs.remove('user');
  }

  // Get stored access token
  Future<String?> getAccessToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('accessToken');
  }

  // Get stored refresh token
  Future<String?> getRefreshToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('refreshToken');
  }

  // Get stored token (backward compatibility)
  Future<String?> getToken() async {
    return getAccessToken();
  }

  // Get stored user data
  Future<Map<String, dynamic>?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userString = prefs.getString('user');
    if (userString != null) {
      return jsonDecode(userString);
    }
    return null;
  }

  // Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null;
  }
}
