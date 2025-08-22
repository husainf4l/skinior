import 'lib/utils/simple_api_test.dart';

void main() async {
  print('Starting Skinior API Test...\n');
  
  try {
    final results = await SimpleApiTest.testBasicConnectivity();
    final formattedResults = SimpleApiTest.formatTestResults(results);
    print(formattedResults);
  } catch (e) {
    print('❌ Test failed with error: $e');
  }
}