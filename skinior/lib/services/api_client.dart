import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiClient {
  static const String baseUrl = 'https://skinior.com/api';
  static const String _tokenKey = 'auth_token';
  static const FlutterSecureStorage _storage = FlutterSecureStorage();

  static Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  static Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  static Future<void> setToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  static Future<void> clearToken() async {
    await _storage.delete(key: _tokenKey);
  }

  static Future<Map<String, String>> _getAuthHeaders() async {
    final token = await getToken();
    final headers = Map<String, String>.from(_headers);
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  static Future<ApiResponse> get(String endpoint, {Map<String, dynamic>? queryParams}) async {
    try {
      String url = '$baseUrl$endpoint';
      if (queryParams != null && queryParams.isNotEmpty) {
        final query = queryParams.entries
            .map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value.toString())}')
            .join('&');
        url += '?$query';
      }

      final response = await http.get(
        Uri.parse(url),
        headers: await _getAuthHeaders(),
      );

      return _handleResponse(response);
    } catch (e) {
      return ApiResponse(success: false, error: 'Network error: ${e.toString()}');
    }
  }

  static Future<ApiResponse> post(String endpoint, {Map<String, dynamic>? body}) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: await _getAuthHeaders(),
        body: body != null ? json.encode(body) : null,
      );

      return _handleResponse(response);
    } catch (e) {
      return ApiResponse(success: false, error: 'Network error: ${e.toString()}');
    }
  }

  static Future<ApiResponse> put(String endpoint, {Map<String, dynamic>? body}) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl$endpoint'),
        headers: await _getAuthHeaders(),
        body: body != null ? json.encode(body) : null,
      );

      return _handleResponse(response);
    } catch (e) {
      return ApiResponse(success: false, error: 'Network error: ${e.toString()}');
    }
  }

  static Future<ApiResponse> delete(String endpoint) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl$endpoint'),
        headers: await _getAuthHeaders(),
      );

      return _handleResponse(response);
    } catch (e) {
      return ApiResponse(success: false, error: 'Network error: ${e.toString()}');
    }
  }

  static ApiResponse _handleResponse(http.Response response) {
    try {
      final Map<String, dynamic> responseData = json.decode(response.body);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return ApiResponse(
          success: true,
          data: responseData,
          statusCode: response.statusCode,
        );
      } else {
        return ApiResponse(
          success: false,
          error: responseData['message'] ?? responseData['error'] ?? 'Unknown error',
          statusCode: response.statusCode,
          data: responseData,
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        error: 'Failed to parse response: ${e.toString()}',
        statusCode: response.statusCode,
      );
    }
  }
}

class ApiResponse {
  final bool success;
  final dynamic data;
  final String? error;
  final int? statusCode;

  ApiResponse({
    required this.success,
    this.data,
    this.error,
    this.statusCode,
  });

  T? getData<T>() {
    if (success && data != null) {
      if (data is Map<String, dynamic> && data.containsKey('data')) {
        return data['data'] as T?;
      }
      return data as T?;
    }
    return null;
  }
}