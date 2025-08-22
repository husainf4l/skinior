import 'dart:convert';
import 'package:http/http.dart' as http;

/// Simple API connectivity test without using our full service layer
class SimpleApiTest {
  static const String baseUrl = 'https://skinior.com/api';
  
  static Future<Map<String, dynamic>> testBasicConnectivity() async {
    final results = <String, dynamic>{
      'base_url': baseUrl,
      'timestamp': DateTime.now().toIso8601String(),
    };
    
    try {
      // Test 1: Basic API connectivity
      final response = await http.get(
        Uri.parse('$baseUrl/products/featured'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));
      
      results['featured_products_test'] = {
        'status_code': response.statusCode,
        'success': response.statusCode >= 200 && response.statusCode < 300,
        'headers_present': response.headers.isNotEmpty,
        'has_body': response.body.isNotEmpty,
        'content_type': response.headers['content-type'],
      };
      
      // Try to parse response
      if (response.body.isNotEmpty) {
        try {
          final jsonData = json.decode(response.body);
          results['featured_products_test']['valid_json'] = true;
          results['featured_products_test']['response_structure'] = {
            'has_success_field': jsonData.containsKey('success'),
            'has_data_field': jsonData.containsKey('data'),
            'has_message_field': jsonData.containsKey('message'),
          };
        } catch (e) {
          results['featured_products_test']['valid_json'] = false;
          results['featured_products_test']['parse_error'] = e.toString();
        }
      }
      
    } catch (e) {
      results['featured_products_test'] = {
        'error': e.toString(),
        'success': false,
      };
    }
    
    try {
      // Test 2: Today's deals endpoint
      final dealsResponse = await http.get(
        Uri.parse('$baseUrl/products/deals/today'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));
      
      results['todays_deals_test'] = {
        'status_code': dealsResponse.statusCode,
        'success': dealsResponse.statusCode >= 200 && dealsResponse.statusCode < 300,
        'has_body': dealsResponse.body.isNotEmpty,
      };
      
    } catch (e) {
      results['todays_deals_test'] = {
        'error': e.toString(),
        'success': false,
      };
    }
    
    try {
      // Test 3: Simple search endpoint
      final searchResponse = await http.get(
        Uri.parse('$baseUrl/products/search/simple?q=serum'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));
      
      results['search_test'] = {
        'status_code': searchResponse.statusCode,
        'success': searchResponse.statusCode >= 200 && searchResponse.statusCode < 300,
        'has_body': searchResponse.body.isNotEmpty,
      };
      
    } catch (e) {
      results['search_test'] = {
        'error': e.toString(),
        'success': false,
      };
    }
    
    // Summary
    final successfulTests = [
      results['featured_products_test']?['success'] == true,
      results['todays_deals_test']?['success'] == true,
      results['search_test']?['success'] == true,
    ].where((test) => test).length;
    
    results['summary'] = {
      'total_tests': 3,
      'successful_tests': successfulTests,
      'success_rate': '${(successfulTests / 3 * 100).toStringAsFixed(1)}%',
      'overall_status': successfulTests > 0 ? 'API_ACCESSIBLE' : 'API_INACCESSIBLE',
    };
    
    return results;
  }
  
  static String formatTestResults(Map<String, dynamic> results) {
    final buffer = StringBuffer();
    
    buffer.writeln('🔍 Skinior API Connectivity Test');
    buffer.writeln('Base URL: ${results['base_url']}');
    buffer.writeln('Timestamp: ${results['timestamp']}');
    buffer.writeln('');
    
    final summary = results['summary'];
    buffer.writeln('📊 Summary:');
    buffer.writeln('  Overall Status: ${summary['overall_status']}');
    buffer.writeln('  Success Rate: ${summary['success_rate']}');
    buffer.writeln('  Tests Passed: ${summary['successful_tests']}/${summary['total_tests']}');
    buffer.writeln('');
    
    buffer.writeln('📋 Detailed Results:');
    
    // Featured Products Test
    final featuredTest = results['featured_products_test'];
    buffer.writeln('  1. Featured Products Endpoint:');
    buffer.writeln('     Status: ${featuredTest['success'] ? '✅ SUCCESS' : '❌ FAILED'}');
    buffer.writeln('     Status Code: ${featuredTest['status_code'] ?? 'N/A'}');
    if (featuredTest['error'] != null) {
      buffer.writeln('     Error: ${featuredTest['error']}');
    }
    buffer.writeln('');
    
    // Today's Deals Test
    final dealsTest = results['todays_deals_test'];
    buffer.writeln('  2. Today\'s Deals Endpoint:');
    buffer.writeln('     Status: ${dealsTest['success'] ? '✅ SUCCESS' : '❌ FAILED'}');
    buffer.writeln('     Status Code: ${dealsTest['status_code'] ?? 'N/A'}');
    if (dealsTest['error'] != null) {
      buffer.writeln('     Error: ${dealsTest['error']}');
    }
    buffer.writeln('');
    
    // Search Test
    final searchTest = results['search_test'];
    buffer.writeln('  3. Product Search Endpoint:');
    buffer.writeln('     Status: ${searchTest['success'] ? '✅ SUCCESS' : '❌ FAILED'}');
    buffer.writeln('     Status Code: ${searchTest['status_code'] ?? 'N/A'}');
    if (searchTest['error'] != null) {
      buffer.writeln('     Error: ${searchTest['error']}');
    }
    
    return buffer.toString();
  }
}