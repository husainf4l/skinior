// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'product_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Product _$ProductFromJson(Map<String, dynamic> json) => Product(
  id: json['id'] as String,
  name: json['name'] as String,
  description: json['description'] as String?,
  price: (json['price'] as num).toDouble(),
  imageUrl: json['imageUrl'] as String?,
  brand: json['brand'] as String?,
  category: json['category'] as String?,
  ingredients: (json['ingredients'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  skinTypes: (json['skinTypes'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  skinConcerns: (json['skinConcerns'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  rating: (json['rating'] as num?)?.toDouble(),
  reviewCount: (json['reviewCount'] as num?)?.toInt(),
  inStock: json['inStock'] as bool,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$ProductToJson(Product instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'description': instance.description,
  'price': instance.price,
  'imageUrl': instance.imageUrl,
  'brand': instance.brand,
  'category': instance.category,
  'ingredients': instance.ingredients,
  'skinTypes': instance.skinTypes,
  'skinConcerns': instance.skinConcerns,
  'rating': instance.rating,
  'reviewCount': instance.reviewCount,
  'inStock': instance.inStock,
  'createdAt': instance.createdAt?.toIso8601String(),
  'updatedAt': instance.updatedAt?.toIso8601String(),
};

ProductSearchRequest _$ProductSearchRequestFromJson(
  Map<String, dynamic> json,
) => ProductSearchRequest(
  query: json['query'] as String?,
  categories: (json['categories'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  skinTypes: (json['skinTypes'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  skinConcerns: (json['skinConcerns'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  minPrice: (json['minPrice'] as num?)?.toDouble(),
  maxPrice: (json['maxPrice'] as num?)?.toDouble(),
  sortBy: json['sortBy'] as String?,
  sortOrder: json['sortOrder'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$ProductSearchRequestToJson(
  ProductSearchRequest instance,
) => <String, dynamic>{
  'query': instance.query,
  'categories': instance.categories,
  'skinTypes': instance.skinTypes,
  'skinConcerns': instance.skinConcerns,
  'minPrice': instance.minPrice,
  'maxPrice': instance.maxPrice,
  'sortBy': instance.sortBy,
  'sortOrder': instance.sortOrder,
  'limit': instance.limit,
  'offset': instance.offset,
};

ProductSearchResponse _$ProductSearchResponseFromJson(
  Map<String, dynamic> json,
) => ProductSearchResponse(
  success: json['success'] as bool,
  data: ProductSearchData.fromJson(json['data'] as Map<String, dynamic>),
  message: json['message'] as String,
  timestamp: json['timestamp'] as String,
);

Map<String, dynamic> _$ProductSearchResponseToJson(
  ProductSearchResponse instance,
) => <String, dynamic>{
  'success': instance.success,
  'data': instance.data,
  'message': instance.message,
  'timestamp': instance.timestamp,
};

ProductSearchData _$ProductSearchDataFromJson(Map<String, dynamic> json) =>
    ProductSearchData(
      products: (json['products'] as List<dynamic>)
          .map((e) => Product.fromJson(e as Map<String, dynamic>))
          .toList(),
      total: (json['total'] as num).toInt(),
      query: json['query'] as String?,
      filtersApplied: json['filtersApplied'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$ProductSearchDataToJson(ProductSearchData instance) =>
    <String, dynamic>{
      'products': instance.products,
      'total': instance.total,
      'query': instance.query,
      'filtersApplied': instance.filtersApplied,
    };

ProductRecommendation _$ProductRecommendationFromJson(
  Map<String, dynamic> json,
) => ProductRecommendation(
  id: json['id'] as String,
  productId: json['productId'] as String,
  userId: json['userId'] as String,
  analysisId: json['analysisId'] as String,
  rating: (json['rating'] as num).toInt(),
  reason: json['reason'] as String,
  matchingConcerns: (json['matchingConcerns'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  usageInstructions: json['usageInstructions'] as String?,
  status: json['status'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  product: json['product'] == null
      ? null
      : Product.fromJson(json['product'] as Map<String, dynamic>),
);

Map<String, dynamic> _$ProductRecommendationToJson(
  ProductRecommendation instance,
) => <String, dynamic>{
  'id': instance.id,
  'productId': instance.productId,
  'userId': instance.userId,
  'analysisId': instance.analysisId,
  'rating': instance.rating,
  'reason': instance.reason,
  'matchingConcerns': instance.matchingConcerns,
  'usageInstructions': instance.usageInstructions,
  'status': instance.status,
  'createdAt': instance.createdAt.toIso8601String(),
  'product': instance.product,
};

UpdateProductRecommendationRequest _$UpdateProductRecommendationRequestFromJson(
  Map<String, dynamic> json,
) => UpdateProductRecommendationRequest(status: json['status'] as String);

Map<String, dynamic> _$UpdateProductRecommendationRequestToJson(
  UpdateProductRecommendationRequest instance,
) => <String, dynamic>{'status': instance.status};
