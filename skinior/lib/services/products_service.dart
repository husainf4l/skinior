import '../models/product_models.dart';
import 'api_client.dart';

class ProductsService {
  static const String _baseEndpoint = '/products';

  static Future<ApiResponse> getFeaturedProducts() async {
    return await ApiClient.get('$_baseEndpoint/featured');
  }

  static Future<ApiResponse> getTodaysDeals({int limit = 20, int offset = 0}) async {
    return await ApiClient.get('$_baseEndpoint/deals/today', queryParams: {
      'limit': limit.toString(),
      'offset': offset.toString(),
    });
  }

  static Future<ApiResponse> searchProducts(String query) async {
    return await ApiClient.get('$_baseEndpoint/search/simple', queryParams: {
      'q': query,
    });
  }

  static Future<ApiResponse> getProductsByCategory(String categoryId) async {
    return await ApiClient.get('$_baseEndpoint/category/$categoryId');
  }

  static Future<ApiResponse> getProductDetails(String productId) async {
    return await ApiClient.get('$_baseEndpoint/$productId/details');
  }

  static Future<ApiResponse> getAvailableProducts({
    List<String>? skinTypes,
    List<String>? skinConcerns,
    double? minPrice,
    double? maxPrice,
    int? limit,
    int? offset,
  }) async {
    final queryParams = <String, dynamic>{};
    
    if (skinTypes != null && skinTypes.isNotEmpty) {
      queryParams['skinTypes'] = skinTypes.join(',');
    }
    if (skinConcerns != null && skinConcerns.isNotEmpty) {
      queryParams['skinConcerns'] = skinConcerns.join(',');
    }
    if (minPrice != null) queryParams['minPrice'] = minPrice.toString();
    if (maxPrice != null) queryParams['maxPrice'] = maxPrice.toString();
    if (limit != null) queryParams['limit'] = limit.toString();
    if (offset != null) queryParams['offset'] = offset.toString();

    return await ApiClient.get('$_baseEndpoint/available', queryParams: queryParams);
  }

  static Future<ApiResponse> searchProductsAdvanced(ProductSearchRequest request) async {
    return await ApiClient.post('$_baseEndpoint/search', body: request.toJson());
  }

  static Future<ApiResponse> getProductById(String productId) async {
    return await ApiClient.get('$_baseEndpoint/$productId');
  }

  static Future<ApiResponse> getAllProducts() async {
    return await ApiClient.get(_baseEndpoint);
  }

  static Future<List<Product>> getFeaturedProductsList() async {
    final response = await getFeaturedProducts();
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] is List) {
        return (data['data'] as List)
            .map((item) => Product.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }
    return [];
  }

  static Future<List<Product>> getTodaysDealsList({int limit = 20, int offset = 0}) async {
    final response = await getTodaysDeals(limit: limit, offset: offset);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] is List) {
        return (data['data'] as List)
            .map((item) => Product.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }
    return [];
  }

  static Future<ProductSearchData?> searchProductsAdvancedParsed(ProductSearchRequest request) async {
    final response = await searchProductsAdvanced(request);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null) {
        return ProductSearchData.fromJson(data['data']);
      }
    }
    return null;
  }

  static Future<Product?> getProductByIdParsed(String productId) async {
    final response = await getProductById(productId);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null) {
        return Product.fromJson(data['data']);
      }
    }
    return null;
  }
}