import '../models/cart_models.dart';
import 'api_client.dart';

class CartService {
  static const String _baseEndpoint = '/cart';

  static Future<ApiResponse> createCart({String? customerId}) async {
    final request = CreateCartRequest(customerId: customerId);
    return await ApiClient.post(_baseEndpoint, body: request.toJson());
  }

  static Future<ApiResponse> getCart(String cartId) async {
    return await ApiClient.get('$_baseEndpoint/$cartId');
  }

  static Future<ApiResponse> addItemToCart(
    String cartId,
    String productId,
    int quantity,
  ) async {
    final request = AddToCartRequest(productId: productId, quantity: quantity);
    return await ApiClient.post('$_baseEndpoint/$cartId/items', body: request.toJson());
  }

  static Future<ApiResponse> updateCartItem(
    String cartId,
    String itemId,
    int quantity,
  ) async {
    final request = UpdateCartItemRequest(quantity: quantity);
    return await ApiClient.put('$_baseEndpoint/$cartId/items/$itemId', body: request.toJson());
  }

  static Future<ApiResponse> removeCartItem(String cartId, String itemId) async {
    return await ApiClient.delete('$_baseEndpoint/$cartId/items/$itemId');
  }

  static Future<ApiResponse> clearCart(String cartId) async {
    return await ApiClient.delete('$_baseEndpoint/$cartId');
  }

  // Helper methods with parsed responses
  static Future<Cart?> createCartParsed({String? customerId}) async {
    final response = await createCart(customerId: customerId);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null) {
        return Cart.fromJson(data['data']);
      }
    }
    return null;
  }

  static Future<Cart?> getCartParsed(String cartId) async {
    final response = await getCart(cartId);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null) {
        return Cart.fromJson(data['data']);
      }
    }
    return null;
  }

  static Future<Cart?> addItemToCartParsed(
    String cartId,
    String productId,
    int quantity,
  ) async {
    final response = await addItemToCart(cartId, productId, quantity);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null) {
        return Cart.fromJson(data['data']);
      }
    }
    return null;
  }

  static Future<Cart?> updateCartItemParsed(
    String cartId,
    String itemId,
    int quantity,
  ) async {
    final response = await updateCartItem(cartId, itemId, quantity);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null) {
        return Cart.fromJson(data['data']);
      }
    }
    return null;
  }

  static Future<Cart?> removeCartItemParsed(String cartId, String itemId) async {
    final response = await removeCartItem(cartId, itemId);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null) {
        return Cart.fromJson(data['data']);
      }
    }
    return null;
  }

  // Convenience methods
  static Future<bool> isItemInCart(String cartId, String productId) async {
    final cart = await getCartParsed(cartId);
    if (cart != null) {
      return cart.items.any((item) => item.productId == productId);
    }
    return false;
  }

  static Future<int> getCartItemCount(String cartId) async {
    final cart = await getCartParsed(cartId);
    if (cart != null) {
      return cart.items.fold<int>(0, (sum, item) => sum + item.quantity);
    }
    return 0;
  }

  static Future<double> getCartTotal(String cartId) async {
    final cart = await getCartParsed(cartId);
    return cart?.total ?? 0.0;
  }

  static Future<List<CartItem>> getCartItems(String cartId) async {
    final cart = await getCartParsed(cartId);
    return cart?.items ?? [];
  }

  // Bulk operations
  static Future<Cart?> addMultipleItems(
    String cartId,
    List<Map<String, dynamic>> items,
  ) async {
    Cart? currentCart = await getCartParsed(cartId);
    
    for (final item in items) {
      final productId = item['productId'] as String;
      final quantity = item['quantity'] as int;
      
      currentCart = await addItemToCartParsed(cartId, productId, quantity);
      if (currentCart == null) break;
    }
    
    return currentCart;
  }

  static Future<bool> clearCartParsed(String cartId) async {
    final response = await clearCart(cartId);
    return response.success;
  }
}