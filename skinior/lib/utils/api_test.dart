import '../services/api_client.dart';
import '../services/products_service.dart';
import '../services/auth_service.dart';
import '../models/auth_models.dart';

class ApiTest {
  static Future<Map<String, dynamic>> testApiConnection() async {
    final results = <String, dynamic>{};
    
    try {
      // Test basic API connectivity with featured products (public endpoint)
      final featuredResponse = await ProductsService.getFeaturedProducts();
      results['featured_products'] = {
        'success': featuredResponse.success,
        'status_code': featuredResponse.statusCode,
        'error': featuredResponse.error,
        'has_data': featuredResponse.data != null,
      };
      
      // Test today's deals endpoint
      final dealsResponse = await ProductsService.getTodaysDeals();
      results['todays_deals'] = {
        'success': dealsResponse.success,
        'status_code': dealsResponse.statusCode,
        'error': dealsResponse.error,
        'has_data': dealsResponse.data != null,
      };
      
      // Test simple search endpoint
      final searchResponse = await ProductsService.searchProducts('serum');
      results['product_search'] = {
        'success': searchResponse.success,
        'status_code': searchResponse.statusCode,
        'error': searchResponse.error,
        'has_data': searchResponse.data != null,
      };
      
      // Test base API health
      final baseResponse = await ApiClient.get('/');
      results['api_base'] = {
        'success': baseResponse.success,
        'status_code': baseResponse.statusCode,
        'error': baseResponse.error,
      };
      
    } catch (e) {
      results['error'] = 'Failed to test API: ${e.toString()}';
    }
    
    return results;
  }
  
  static Future<Map<String, dynamic>> testAuthEndpoints() async {
    final results = <String, dynamic>{};
    
    try {
      // Test login endpoint with invalid credentials (should fail gracefully)
      final loginRequest = LoginRequest(
        email: 'test@example.com',
        password: 'wrongpassword',
      );
      final loginResponse = await AuthService.login(loginRequest);
      
      results['login_test'] = {
        'success': loginResponse.success,
        'status_code': loginResponse.statusCode,
        'error': loginResponse.error,
      };
      
    } catch (e) {
      results['auth_error'] = 'Failed to test auth: ${e.toString()}';
    }
    
    return results;
  }
  
  static Future<void> printApiTestResults() async {
    print('🔍 Testing Skinior API Connection...');
    print('Base URL: ${ApiClient.baseUrl}');
    print('');
    
    final results = await testApiConnection();
    
    print('📊 API Test Results:');
    results.forEach((key, value) {
      print('  $key: $value');
    });
    
    print('');
    print('🔐 Testing Auth Endpoints...');
    final authResults = await testAuthEndpoints();
    authResults.forEach((key, value) {
      print('  $key: $value');
    });
  }
}