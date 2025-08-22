import 'package:flutter/foundation.dart';
import '../models/product_models.dart';
import '../services/products_service.dart';

class ProductsProvider extends ChangeNotifier {
  List<Product> _featuredProducts = [];
  List<Product> _todaysDeals = [];
  List<Product> _searchResults = [];
  ProductSearchData? _lastSearchData;
  bool _isLoading = false;
  String? _error;

  List<Product> get featuredProducts => _featuredProducts;
  List<Product> get todaysDeals => _todaysDeals;
  List<Product> get searchResults => _searchResults;
  ProductSearchData? get lastSearchData => _lastSearchData;
  bool get isLoading => _isLoading;
  String? get error => _error;

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _error = error;
    notifyListeners();
  }

  Future<void> loadFeaturedProducts() async {
    _setLoading(true);
    _setError(null);

    try {
      _featuredProducts = await ProductsService.getFeaturedProductsList();
      _setLoading(false);
    } catch (e) {
      _setError('Failed to load featured products: ${e.toString()}');
      _setLoading(false);
    }
  }

  Future<void> loadTodaysDeals({int limit = 20, int offset = 0}) async {
    _setLoading(true);
    _setError(null);

    try {
      _todaysDeals = await ProductsService.getTodaysDealsList(limit: limit, offset: offset);
      _setLoading(false);
    } catch (e) {
      _setError('Failed to load today\'s deals: ${e.toString()}');
      _setLoading(false);
    }
  }

  Future<void> searchProducts(String query) async {
    if (query.trim().isEmpty) {
      _searchResults = [];
      _lastSearchData = null;
      notifyListeners();
      return;
    }

    _setLoading(true);
    _setError(null);

    try {
      final response = await ProductsService.searchProducts(query);
      if (response.success && response.data != null) {
        final data = response.getData<Map<String, dynamic>>();
        if (data != null && data['data'] is List) {
          _searchResults = (data['data'] as List)
              .map((item) => Product.fromJson(item as Map<String, dynamic>))
              .toList();
        }
      }
      _setLoading(false);
    } catch (e) {
      _setError('Search failed: ${e.toString()}');
      _setLoading(false);
    }
  }

  Future<void> searchProductsAdvanced(ProductSearchRequest request) async {
    _setLoading(true);
    _setError(null);

    try {
      _lastSearchData = await ProductsService.searchProductsAdvancedParsed(request);
      if (_lastSearchData != null) {
        _searchResults = _lastSearchData!.products;
      }
      _setLoading(false);
    } catch (e) {
      _setError('Advanced search failed: ${e.toString()}');
      _setLoading(false);
    }
  }

  Future<Product?> getProductById(String productId) async {
    try {
      return await ProductsService.getProductByIdParsed(productId);
    } catch (e) {
      _setError('Failed to load product: ${e.toString()}');
      return null;
    }
  }

  Future<List<Product>> getAvailableProducts({
    List<String>? skinTypes,
    List<String>? skinConcerns,
    double? minPrice,
    double? maxPrice,
    int? limit,
    int? offset,
  }) async {
    try {
      final response = await ProductsService.getAvailableProducts(
        skinTypes: skinTypes,
        skinConcerns: skinConcerns,
        minPrice: minPrice,
        maxPrice: maxPrice,
        limit: limit,
        offset: offset,
      );

      if (response.success && response.data != null) {
        final data = response.getData<Map<String, dynamic>>();
        if (data != null && data['data'] != null && data['data']['products'] is List) {
          return (data['data']['products'] as List)
              .map((item) => Product.fromJson(item as Map<String, dynamic>))
              .toList();
        }
      }
      return [];
    } catch (e) {
      _setError('Failed to load available products: ${e.toString()}');
      return [];
    }
  }

  Future<List<Product>> getProductsByCategory(String categoryId) async {
    try {
      final response = await ProductsService.getProductsByCategory(categoryId);
      if (response.success && response.data != null) {
        final data = response.getData<Map<String, dynamic>>();
        if (data != null && data['data'] is List) {
          return (data['data'] as List)
              .map((item) => Product.fromJson(item as Map<String, dynamic>))
              .toList();
        }
      }
      return [];
    } catch (e) {
      _setError('Failed to load products by category: ${e.toString()}');
      return [];
    }
  }

  void clearSearchResults() {
    _searchResults = [];
    _lastSearchData = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  Future<void> refreshFeaturedProducts() async {
    await loadFeaturedProducts();
  }

  Future<void> refreshTodaysDeals() async {
    await loadTodaysDeals();
  }

  // Helper methods for filtering
  List<Product> getProductsBySkinType(String skinType) {
    return _searchResults.where((product) => 
      product.skinTypes?.contains(skinType) ?? false
    ).toList();
  }

  List<Product> getProductsBySkinConcern(String concern) {
    return _searchResults.where((product) => 
      product.skinConcerns?.contains(concern) ?? false
    ).toList();
  }

  List<Product> getProductsByPriceRange(double minPrice, double maxPrice) {
    return _searchResults.where((product) => 
      product.price >= minPrice && product.price <= maxPrice
    ).toList();
  }

  List<Product> getInStockProducts() {
    return _searchResults.where((product) => product.inStock).toList();
  }
}