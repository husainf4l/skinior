import 'package:json_annotation/json_annotation.dart';
import 'product_models.dart';

part 'cart_models.g.dart';

@JsonSerializable()
class CreateCartRequest {
  final String? customerId;

  CreateCartRequest({this.customerId});

  factory CreateCartRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateCartRequestFromJson(json);
  
  Map<String, dynamic> toJson() => _$CreateCartRequestToJson(this);
}

@JsonSerializable()
class AddToCartRequest {
  final String productId;
  final int quantity;

  AddToCartRequest({
    required this.productId,
    required this.quantity,
  });

  factory AddToCartRequest.fromJson(Map<String, dynamic> json) =>
      _$AddToCartRequestFromJson(json);
  
  Map<String, dynamic> toJson() => _$AddToCartRequestToJson(this);
}

@JsonSerializable()
class UpdateCartItemRequest {
  final int quantity;

  UpdateCartItemRequest({required this.quantity});

  factory UpdateCartItemRequest.fromJson(Map<String, dynamic> json) =>
      _$UpdateCartItemRequestFromJson(json);
  
  Map<String, dynamic> toJson() => _$UpdateCartItemRequestToJson(this);
}

@JsonSerializable()
class Cart {
  final String id;
  final String? customerId;
  final List<CartItem> items;
  final double subtotal;
  final double tax;
  final double total;
  final DateTime createdAt;
  final DateTime updatedAt;

  Cart({
    required this.id,
    this.customerId,
    required this.items,
    required this.subtotal,
    required this.tax,
    required this.total,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Cart.fromJson(Map<String, dynamic> json) =>
      _$CartFromJson(json);
  
  Map<String, dynamic> toJson() => _$CartToJson(this);
}

@JsonSerializable()
class CartItem {
  final String id;
  final String productId;
  final int quantity;
  final double price;
  final double totalPrice;
  final Product? product;

  CartItem({
    required this.id,
    required this.productId,
    required this.quantity,
    required this.price,
    required this.totalPrice,
    this.product,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) =>
      _$CartItemFromJson(json);
  
  Map<String, dynamic> toJson() => _$CartItemToJson(this);
}