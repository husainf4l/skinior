import 'package:json_annotation/json_annotation.dart';

part 'product_models.g.dart';

@JsonSerializable()
class Product {
  final String id;
  final String name;
  final String? description;
  final double price;
  final String? imageUrl;
  final String? brand;
  final String? category;
  final List<String>? ingredients;
  final List<String>? skinTypes;
  final List<String>? skinConcerns;
  final double? rating;
  final int? reviewCount;
  final bool inStock;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Product({
    required this.id,
    required this.name,
    this.description,
    required this.price,
    this.imageUrl,
    this.brand,
    this.category,
    this.ingredients,
    this.skinTypes,
    this.skinConcerns,
    this.rating,
    this.reviewCount,
    required this.inStock,
    this.createdAt,
    this.updatedAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);
  
  Map<String, dynamic> toJson() => _$ProductToJson(this);
}

@JsonSerializable()
class ProductSearchRequest {
  final String? query;
  final List<String>? categories;
  final List<String>? skinTypes;
  final List<String>? skinConcerns;
  final double? minPrice;
  final double? maxPrice;
  final String? sortBy;
  final String? sortOrder;
  final int? limit;
  final int? offset;

  ProductSearchRequest({
    this.query,
    this.categories,
    this.skinTypes,
    this.skinConcerns,
    this.minPrice,
    this.maxPrice,
    this.sortBy,
    this.sortOrder,
    this.limit,
    this.offset,
  });

  factory ProductSearchRequest.fromJson(Map<String, dynamic> json) =>
      _$ProductSearchRequestFromJson(json);
  
  Map<String, dynamic> toJson() => _$ProductSearchRequestToJson(this);
}

@JsonSerializable()
class ProductSearchResponse {
  final bool success;
  final ProductSearchData data;
  final String message;
  final String timestamp;

  ProductSearchResponse({
    required this.success,
    required this.data,
    required this.message,
    required this.timestamp,
  });

  factory ProductSearchResponse.fromJson(Map<String, dynamic> json) =>
      _$ProductSearchResponseFromJson(json);
  
  Map<String, dynamic> toJson() => _$ProductSearchResponseToJson(this);
}

@JsonSerializable()
class ProductSearchData {
  final List<Product> products;
  final int total;
  final String? query;
  final Map<String, dynamic>? filtersApplied;

  ProductSearchData({
    required this.products,
    required this.total,
    this.query,
    this.filtersApplied,
  });

  factory ProductSearchData.fromJson(Map<String, dynamic> json) =>
      _$ProductSearchDataFromJson(json);
  
  Map<String, dynamic> toJson() => _$ProductSearchDataToJson(this);
}

@JsonSerializable()
class ProductRecommendation {
  final String id;
  final String productId;
  final String userId;
  final String analysisId;
  final int rating;
  final String reason;
  final List<String>? matchingConcerns;
  final String? usageInstructions;
  final String status;
  final DateTime createdAt;
  final Product? product;

  ProductRecommendation({
    required this.id,
    required this.productId,
    required this.userId,
    required this.analysisId,
    required this.rating,
    required this.reason,
    this.matchingConcerns,
    this.usageInstructions,
    required this.status,
    required this.createdAt,
    this.product,
  });

  factory ProductRecommendation.fromJson(Map<String, dynamic> json) =>
      _$ProductRecommendationFromJson(json);
  
  Map<String, dynamic> toJson() => _$ProductRecommendationToJson(this);
}

@JsonSerializable()
class UpdateProductRecommendationRequest {
  final String status;

  UpdateProductRecommendationRequest({
    required this.status,
  });

  factory UpdateProductRecommendationRequest.fromJson(Map<String, dynamic> json) =>
      _$UpdateProductRecommendationRequestFromJson(json);
  
  Map<String, dynamic> toJson() => _$UpdateProductRecommendationRequestToJson(this);
}