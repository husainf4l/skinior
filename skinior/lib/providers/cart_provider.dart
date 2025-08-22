import 'package:flutter/foundation.dart';
import '../models/cart_models.dart';
import '../models/product_models.dart';
import '../services/cart_service.dart';

class CartProvider extends ChangeNotifier {
  Cart? _cart;
  bool _isLoading = false;
  String? _error;
  
  // Local cart for guest users (stored in memory)
  final List<CartItem> _localCartItems = [];

  Cart? get cart => _cart;
  List<CartItem> get localCartItems => _localCartItems;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  int get itemCount {
    if (_cart != null) {
      return _cart!.items.fold<int>(0, (sum, item) => sum + item.quantity);
    }
    return _localCartItems.fold<int>(0, (sum, item) => sum + item.quantity);
  }

  double get total {
    if (_cart != null) {
      return _cart!.total;
    }
    return _localCartItems.fold<double>(0, (sum, item) => sum + item.totalPrice);
  }

  List<CartItem> get items {
    if (_cart != null) {
      return _cart!.items;
    }
    return _localCartItems;
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _error = error;
    notifyListeners();
  }

  // Initialize cart for authenticated users
  Future<void> initializeCart(String customerId) async {
    _setLoading(true);
    _setError(null);

    try {
      _cart = await CartService.createCartParsed(customerId: customerId);
      _setLoading(false);
    } catch (e) {
      _setError('Failed to initialize cart: ${e.toString()}');
      _setLoading(false);
    }
  }

  // Add item to cart (works for both guest and authenticated users)
  Future<void> addItem(Product product, {int quantity = 1}) async {
    if (_cart != null) {
      // Authenticated user - use API
      _setLoading(true);
      try {
        _cart = await CartService.addItemToCartParsed(
          _cart!.id,
          product.id,
          quantity,
        );
        _setLoading(false);
      } catch (e) {
        _setError('Failed to add item to cart: ${e.toString()}');
        _setLoading(false);
      }
    } else {
      // Guest user - use local storage
      _addItemToLocalCart(product, quantity);
    }
  }

  void _addItemToLocalCart(Product product, int quantity) {
    final existingItemIndex = _localCartItems.indexWhere(
      (item) => item.productId == product.id,
    );

    if (existingItemIndex != -1) {
      // Update existing item
      final existingItem = _localCartItems[existingItemIndex];
      final newQuantity = existingItem.quantity + quantity;
      final newItem = CartItem(
        id: existingItem.id,
        productId: product.id,
        quantity: newQuantity,
        price: product.price,
        totalPrice: product.price * newQuantity,
        product: product,
      );
      _localCartItems[existingItemIndex] = newItem;
    } else {
      // Add new item
      final newItem = CartItem(
        id: 'local_${product.id}_${DateTime.now().millisecondsSinceEpoch}',
        productId: product.id,
        quantity: quantity,
        price: product.price,
        totalPrice: product.price * quantity,
        product: product,
      );
      _localCartItems.add(newItem);
    }
    notifyListeners();
  }

  // Update item quantity
  Future<void> updateItemQuantity(String itemId, int quantity) async {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    if (_cart != null) {
      // Authenticated user - use API
      _setLoading(true);
      try {
        _cart = await CartService.updateCartItemParsed(
          _cart!.id,
          itemId,
          quantity,
        );
        _setLoading(false);
      } catch (e) {
        _setError('Failed to update item: ${e.toString()}');
        _setLoading(false);
      }
    } else {
      // Guest user - update local cart
      _updateLocalCartItem(itemId, quantity);
    }
  }

  void _updateLocalCartItem(String itemId, int quantity) {
    final itemIndex = _localCartItems.indexWhere((item) => item.id == itemId);
    if (itemIndex != -1) {
      final item = _localCartItems[itemIndex];
      final updatedItem = CartItem(
        id: item.id,
        productId: item.productId,
        quantity: quantity,
        price: item.price,
        totalPrice: item.price * quantity,
        product: item.product,
      );
      _localCartItems[itemIndex] = updatedItem;
      notifyListeners();
    }
  }

  // Remove item from cart
  Future<void> removeItem(String itemId) async {
    if (_cart != null) {
      // Authenticated user - use API
      _setLoading(true);
      try {
        _cart = await CartService.removeCartItemParsed(_cart!.id, itemId);
        _setLoading(false);
      } catch (e) {
        _setError('Failed to remove item: ${e.toString()}');
        _setLoading(false);
      }
    } else {
      // Guest user - remove from local cart
      _localCartItems.removeWhere((item) => item.id == itemId);
      notifyListeners();
    }
  }

  // Clear cart
  Future<void> clearCart() async {
    if (_cart != null) {
      // Authenticated user - use API
      _setLoading(true);
      try {
        await CartService.clearCartParsed(_cart!.id);
        _cart = await CartService.createCartParsed(customerId: _cart!.customerId);
        _setLoading(false);
      } catch (e) {
        _setError('Failed to clear cart: ${e.toString()}');
        _setLoading(false);
      }
    } else {
      // Guest user - clear local cart
      _localCartItems.clear();
      notifyListeners();
    }
  }

  // Check if product is in cart
  bool isInCart(String productId) {
    if (_cart != null) {
      return _cart!.items.any((item) => item.productId == productId);
    }
    return _localCartItems.any((item) => item.productId == productId);
  }

  // Get item quantity for a product
  int getItemQuantity(String productId) {
    if (_cart != null) {
      final item = _cart!.items.firstWhere(
        (item) => item.productId == productId,
        orElse: () => CartItem(
          id: '',
          productId: '',
          quantity: 0,
          price: 0,
          totalPrice: 0,
        ),
      );
      return item.quantity;
    }
    
    final item = _localCartItems.firstWhere(
      (item) => item.productId == productId,
      orElse: () => CartItem(
        id: '',
        productId: '',
        quantity: 0,
        price: 0,
        totalPrice: 0,
      ),
    );
    return item.quantity;
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Convert local cart to API cart when user logs in
  Future<void> migrateLocalCartToApi(String customerId) async {
    if (_localCartItems.isEmpty) return;

    try {
      _setLoading(true);
      
      // Create new cart for authenticated user
      _cart = await CartService.createCartParsed(customerId: customerId);
      
      // Add all local items to API cart
      for (final localItem in _localCartItems) {
        if (localItem.product != null) {
          await addItem(localItem.product!, quantity: localItem.quantity);
        }
      }
      
      // Clear local cart
      _localCartItems.clear();
      _setLoading(false);
    } catch (e) {
      _setError('Failed to migrate cart: ${e.toString()}');
      _setLoading(false);
    }
  }
}