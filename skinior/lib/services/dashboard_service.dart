import '../models/dashboard_models.dart';
import 'api_client.dart';

class DashboardService {
  static const String _baseEndpoint = '/dashboard';

  static Future<ApiResponse> getDashboardOverview({
    String? period,
    String? timezone,
  }) async {
    final queryParams = <String, dynamic>{};
    
    if (period != null) queryParams['period'] = period;
    if (timezone != null) queryParams['timezone'] = timezone;

    return await ApiClient.get('$_baseEndpoint/overview', queryParams: queryParams);
  }

  static Future<ApiResponse> getRevenueAnalytics({
    String? period,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    final queryParams = <String, dynamic>{};
    
    if (period != null) queryParams['period'] = period;
    if (startDate != null) queryParams['startDate'] = startDate.toIso8601String();
    if (endDate != null) queryParams['endDate'] = endDate.toIso8601String();

    return await ApiClient.get('$_baseEndpoint/revenue', queryParams: queryParams);
  }

  static Future<ApiResponse> getTopProducts({
    String? period,
    int? limit,
  }) async {
    final queryParams = <String, dynamic>{};
    
    if (period != null) queryParams['period'] = period;
    if (limit != null) queryParams['limit'] = limit.toString();

    return await ApiClient.get('$_baseEndpoint/products/top', queryParams: queryParams);
  }

  static Future<ApiResponse> getCustomerAnalytics({
    String? period,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    final queryParams = <String, dynamic>{};
    
    if (period != null) queryParams['period'] = period;
    if (startDate != null) queryParams['startDate'] = startDate.toIso8601String();
    if (endDate != null) queryParams['endDate'] = endDate.toIso8601String();

    return await ApiClient.get('$_baseEndpoint/customers', queryParams: queryParams);
  }

  static Future<ApiResponse> getOrderAnalytics({
    String? period,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    final queryParams = <String, dynamic>{};
    
    if (period != null) queryParams['period'] = period;
    if (startDate != null) queryParams['startDate'] = startDate.toIso8601String();
    if (endDate != null) queryParams['endDate'] = endDate.toIso8601String();

    return await ApiClient.get('$_baseEndpoint/orders', queryParams: queryParams);
  }

  static Future<ApiResponse> getInventoryAnalytics() async {
    return await ApiClient.get('$_baseEndpoint/inventory');
  }

  // Helper methods with parsed responses
  static Future<DashboardOverview?> getDashboardOverviewParsed({
    String? period,
    String? timezone,
  }) async {
    final response = await getDashboardOverview(period: period, timezone: timezone);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null) {
        return DashboardOverview.fromJson(data['data']);
      }
    }
    return null;
  }

  static Future<Map<String, dynamic>?> getRevenueAnalyticsParsed({
    String? period,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    final response = await getRevenueAnalytics(
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

  static Future<List<Map<String, dynamic>>> getTopProductsParsed({
    String? period,
    int? limit,
  }) async {
    final response = await getTopProducts(period: period, limit: limit);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] is List) {
        return List<Map<String, dynamic>>.from(data['data']);
      }
    }
    return [];
  }

  static Future<Map<String, dynamic>?> getCustomerAnalyticsParsed({
    String? period,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    final response = await getCustomerAnalytics(
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

  static Future<Map<String, dynamic>?> getOrderAnalyticsParsed({
    String? period,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    final response = await getOrderAnalytics(
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

  static Future<Map<String, dynamic>?> getInventoryAnalyticsParsed() async {
    final response = await getInventoryAnalytics();
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      return data?['data'] as Map<String, dynamic>?;
    }
    return null;
  }

  // Convenience methods for common dashboard periods
  static Future<DashboardOverview?> getTodayOverview() async {
    return await getDashboardOverviewParsed(period: 'today');
  }

  static Future<DashboardOverview?> getWeeklyOverview() async {
    return await getDashboardOverviewParsed(period: 'week');
  }

  static Future<DashboardOverview?> getMonthlyOverview() async {
    return await getDashboardOverviewParsed(period: 'month');
  }

  static Future<DashboardOverview?> getYearlyOverview() async {
    return await getDashboardOverviewParsed(period: 'year');
  }

  // Custom date range methods
  static Future<DashboardOverview?> getCustomRangeOverview({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    // For custom ranges, we might need to implement a different endpoint
    // For now, we'll use monthly and filter client-side if needed
    return await getDashboardOverviewParsed(period: 'custom');
  }

  // Quick stats methods
  static Future<PersonalStats?> getPersonalStats() async {
    final overview = await getDashboardOverviewParsed();
    return overview?.personalStats;
  }

  static Future<List<TreatmentSummary>> getRecentTreatments() async {
    final overview = await getDashboardOverviewParsed();
    return overview?.recentTreatments ?? [];
  }

  static Future<List<ConsultationSummary>> getRecentConsultations() async {
    final overview = await getDashboardOverviewParsed();
    return overview?.recentConsultations ?? [];
  }

  static Future<ProductMetrics?> getProductMetrics() async {
    final overview = await getDashboardOverviewParsed();
    return overview?.productMetrics;
  }

  static Future<AiStats?> getAiStats() async {
    final overview = await getDashboardOverviewParsed();
    return overview?.aiStats;
  }
}