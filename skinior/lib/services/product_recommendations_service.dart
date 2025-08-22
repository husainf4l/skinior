import '../models/product_models.dart';
import 'api_client.dart';

class ProductRecommendationsService {
  static const String _baseEndpoint = '/product-recommendations';

  static Future<ApiResponse> getRecommendations({
    String? userId,
    String? analysisId,
    String? status,
    int? limit,
    int? offset,
  }) async {
    final queryParams = <String, dynamic>{};
    
    if (userId != null) queryParams['userId'] = userId;
    if (analysisId != null) queryParams['analysisId'] = analysisId;
    if (status != null) queryParams['status'] = status;
    if (limit != null) queryParams['limit'] = limit.toString();
    if (offset != null) queryParams['offset'] = offset.toString();

    return await ApiClient.get(_baseEndpoint, queryParams: queryParams);
  }

  static Future<ApiResponse> getRecommendationById(String recommendationId) async {
    return await ApiClient.get('$_baseEndpoint/$recommendationId');
  }

  static Future<ApiResponse> updateRecommendationStatus(
    String recommendationId,
    String status,
  ) async {
    final request = UpdateProductRecommendationRequest(status: status);
    return await ApiClient.put('$_baseEndpoint/$recommendationId', body: request.toJson());
  }

  static Future<ApiResponse> getRecommendationAnalytics({
    String? userId,
    String? period,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    final queryParams = <String, dynamic>{};
    
    if (userId != null) queryParams['userId'] = userId;
    if (period != null) queryParams['period'] = period;
    if (startDate != null) queryParams['startDate'] = startDate.toIso8601String();
    if (endDate != null) queryParams['endDate'] = endDate.toIso8601String();

    return await ApiClient.get('$_baseEndpoint/analytics', queryParams: queryParams);
  }

  static Future<ApiResponse> getUserRecommendations(String userId, {
    String? status,
    int? limit,
    int? offset,
  }) async {
    final queryParams = <String, dynamic>{
      'limit': (limit ?? 20).toString(),
      'offset': (offset ?? 0).toString(),
    };
    
    if (status != null) queryParams['status'] = status;

    return await ApiClient.get('$_baseEndpoint/user/$userId', queryParams: queryParams);
  }

  static Future<ApiResponse> getAnalysisRecommendations(String analysisId) async {
    return await ApiClient.get('$_baseEndpoint/analysis/$analysisId');
  }

  // Helper methods with parsed responses
  static Future<List<ProductRecommendation>> getRecommendationsParsed({
    String? userId,
    String? analysisId,
    String? status,
    int? limit,
    int? offset,
  }) async {
    final response = await getRecommendations(
      userId: userId,
      analysisId: analysisId,
      status: status,
      limit: limit,
      offset: offset,
    );

    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] is List) {
        return (data['data'] as List)
            .map((item) => ProductRecommendation.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }
    return [];
  }

  static Future<ProductRecommendation?> getRecommendationByIdParsed(String recommendationId) async {
    final response = await getRecommendationById(recommendationId);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null) {
        return ProductRecommendation.fromJson(data['data']);
      }
    }
    return null;
  }

  static Future<bool> updateRecommendationStatusParsed(
    String recommendationId,
    String status,
  ) async {
    final response = await updateRecommendationStatus(recommendationId, status);
    return response.success;
  }

  static Future<List<ProductRecommendation>> getUserRecommendationsParsed(
    String userId, {
    String? status,
    int? limit,
    int? offset,
  }) async {
    final response = await getUserRecommendations(
      userId,
      status: status,
      limit: limit,
      offset: offset,
    );

    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] is List) {
        return (data['data'] as List)
            .map((item) => ProductRecommendation.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }
    return [];
  }

  static Future<List<ProductRecommendation>> getAnalysisRecommendationsParsed(String analysisId) async {
    final response = await getAnalysisRecommendations(analysisId);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] is List) {
        return (data['data'] as List)
            .map((item) => ProductRecommendation.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }
    return [];
  }

  // Convenience methods for different statuses
  static Future<List<ProductRecommendation>> getPendingRecommendations(String userId) async {
    return await getUserRecommendationsParsed(userId, status: 'pending');
  }

  static Future<List<ProductRecommendation>> getPurchasedRecommendations(String userId) async {
    return await getUserRecommendationsParsed(userId, status: 'purchased');
  }

  static Future<List<ProductRecommendation>> getTriedRecommendations(String userId) async {
    return await getUserRecommendationsParsed(userId, status: 'tried');
  }

  static Future<List<ProductRecommendation>> getWishlistRecommendations(String userId) async {
    return await getUserRecommendationsParsed(userId, status: 'wishlist');
  }

  static Future<List<ProductRecommendation>> getNotInterestedRecommendations(String userId) async {
    return await getUserRecommendationsParsed(userId, status: 'not_interested');
  }

  // Status update helpers
  static Future<bool> markAsPurchased(String recommendationId) async {
    return await updateRecommendationStatusParsed(recommendationId, 'purchased');
  }

  static Future<bool> markAsTried(String recommendationId) async {
    return await updateRecommendationStatusParsed(recommendationId, 'tried');
  }

  static Future<bool> addToWishlist(String recommendationId) async {
    return await updateRecommendationStatusParsed(recommendationId, 'wishlist');
  }

  static Future<bool> markAsNotInterested(String recommendationId) async {
    return await updateRecommendationStatusParsed(recommendationId, 'not_interested');
  }

  // Analytics helpers
  static Future<Map<String, dynamic>?> getRecommendationAnalyticsParsed({
    String? userId,
    String? period,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    final response = await getRecommendationAnalytics(
      userId: userId,
      period: period,
      startDate: startDate,
      endDate: endDate,
    );

    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      return data?['data'] as Map<String, dynamic>?;
    }
    return null;
  }

  // Statistics
  static Future<Map<String, int>> getRecommendationStatusCounts(String userId) async {
    final recommendations = await getUserRecommendationsParsed(userId, limit: 1000);
    final statusCounts = <String, int>{};
    
    for (final recommendation in recommendations) {
      statusCounts[recommendation.status] = (statusCounts[recommendation.status] ?? 0) + 1;
    }
    
    return statusCounts;
  }

  static Future<double> getAverageRating(String userId) async {
    final recommendations = await getUserRecommendationsParsed(userId, limit: 1000);
    if (recommendations.isEmpty) return 0.0;
    
    final totalRating = recommendations.fold<int>(0, (sum, rec) => sum + rec.rating);
    return totalRating / recommendations.length;
  }
}