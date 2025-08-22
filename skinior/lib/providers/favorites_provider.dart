import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import '../models/product_models.dart';

class FavoritesProvider extends ChangeNotifier {
  final List<Product> _favorites = [];
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  static const String _favoritesKey = 'user_favorites';

  List<Product> get favorites => _favorites;
  int get favoritesCount => _favorites.length;

  // Initialize favorites from storage
  Future<void> loadFavorites() async {
    try {
      final favoritesJson = await _storage.read(key: _favoritesKey);
      if (favoritesJson != null) {
        final List<dynamic> favoritesList = json.decode(favoritesJson);
        _favorites.clear();
        _favorites.addAll(
          favoritesList.map((item) => Product.fromJson(item as Map<String, dynamic>)),
        );
        notifyListeners();
      }
    } catch (e) {
      // If loading fails, start with empty favorites
      debugPrint('Failed to load favorites: $e');
    }
  }

  // Save favorites to storage
  Future<void> _saveFavorites() async {
    try {
      final favoritesJson = json.encode(
        _favorites.map((product) => product.toJson()).toList(),
      );
      await _storage.write(key: _favoritesKey, value: favoritesJson);
    } catch (e) {
      debugPrint('Failed to save favorites: $e');
    }
  }

  // Add product to favorites
  Future<void> addToFavorites(Product product) async {
    if (!isFavorite(product.id)) {
      _favorites.add(product);
      await _saveFavorites();
      notifyListeners();
    }
  }

  // Remove product from favorites
  Future<void> removeFromFavorites(String productId) async {
    _favorites.removeWhere((product) => product.id == productId);
    await _saveFavorites();
    notifyListeners();
  }

  // Toggle favorite status
  Future<void> toggleFavorite(Product product) async {
    if (isFavorite(product.id)) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites(product);
    }
  }

  // Check if product is in favorites
  bool isFavorite(String productId) {
    return _favorites.any((product) => product.id == productId);
  }

  // Clear all favorites
  Future<void> clearFavorites() async {
    _favorites.clear();
    await _storage.delete(key: _favoritesKey);
    notifyListeners();
  }

  // Get favorites by category
  List<Product> getFavoritesByCategory(String category) {
    return _favorites.where((product) => product.category == category).toList();
  }

  // Get favorites by brand
  List<Product> getFavoritesByBrand(String brand) {
    return _favorites.where((product) => product.brand == brand).toList();
  }

  // Get favorites in price range
  List<Product> getFavoritesInPriceRange(double minPrice, double maxPrice) {
    return _favorites.where((product) => 
      product.price >= minPrice && product.price <= maxPrice
    ).toList();
  }

  // Sort favorites by different criteria
  List<Product> getSortedFavorites({String sortBy = 'name'}) {
    final sortedList = List<Product>.from(_favorites);
    
    switch (sortBy) {
      case 'name':
        sortedList.sort((a, b) => a.name.compareTo(b.name));
        break;
      case 'price_low':
        sortedList.sort((a, b) => a.price.compareTo(b.price));
        break;
      case 'price_high':
        sortedList.sort((a, b) => b.price.compareTo(a.price));
        break;
      case 'rating':
        sortedList.sort((a, b) => (b.rating ?? 0).compareTo(a.rating ?? 0));
        break;
      case 'newest':
        sortedList.sort((a, b) => (b.createdAt ?? DateTime.now()).compareTo(a.createdAt ?? DateTime.now()));
        break;
      default:
        break;
    }
    
    return sortedList;
  }

  // Get favorite product IDs for API calls
  List<String> getFavoriteIds() {
    return _favorites.map((product) => product.id).toList();
  }

  // Bulk operations
  Future<void> addMultipleToFavorites(List<Product> products) async {
    for (final product in products) {
      if (!isFavorite(product.id)) {
        _favorites.add(product);
      }
    }
    await _saveFavorites();
    notifyListeners();
  }

  Future<void> removeMultipleFromFavorites(List<String> productIds) async {
    _favorites.removeWhere((product) => productIds.contains(product.id));
    await _saveFavorites();
    notifyListeners();
  }
}