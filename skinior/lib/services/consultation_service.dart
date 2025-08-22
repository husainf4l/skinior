import '../models/consultation_models.dart';
import 'api_client.dart';

class ConsultationService {
  static const String _baseEndpoint = '/consultations';

  static Future<ApiResponse> getMyConsultations({
    int? limit,
    String? cursor,
    String? status,
    String? from,
    String? to,
  }) async {
    final queryParams = <String, dynamic>{};
    
    if (limit != null) queryParams['limit'] = limit.toString();
    if (cursor != null) queryParams['cursor'] = cursor;
    if (status != null) queryParams['status'] = status;
    if (from != null) queryParams['from'] = from;
    if (to != null) queryParams['to'] = to;

    return await ApiClient.get(_baseEndpoint, queryParams: queryParams);
  }

  static Future<ApiResponse> getConsultationDetails(String consultationId) async {
    return await ApiClient.get('$_baseEndpoint/$consultationId');
  }

  // Helper methods with parsed responses
  static Future<ConsultationsData?> getMyConsultationsParsed({
    int? limit,
    String? cursor,
    String? status,
    String? from,
    String? to,
  }) async {
    final response = await getMyConsultations(
      limit: limit,
      cursor: cursor,
      status: status,
      from: from,
      to: to,
    );

    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null) {
        return ConsultationsData.fromJson(data['data']);
      }
    }
    return null;
  }

  static Future<Consultation?> getConsultationDetailsParsed(String consultationId) async {
    final response = await getConsultationDetails(consultationId);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null && data['data']['consultation'] != null) {
        return Consultation.fromJson(data['data']['consultation']);
      }
    }
    return null;
  }

  // Convenience methods for common queries
  static Future<List<Consultation>> getRecentConsultations({int limit = 10}) async {
    final data = await getMyConsultationsParsed(limit: limit);
    return data?.consultations ?? [];
  }

  static Future<List<Consultation>> getCompletedConsultations({int limit = 20}) async {
    final data = await getMyConsultationsParsed(
      limit: limit,
      status: 'completed',
    );
    return data?.consultations ?? [];
  }

  static Future<List<Consultation>> getInProgressConsultations() async {
    final data = await getMyConsultationsParsed(
      status: 'in_progress',
    );
    return data?.consultations ?? [];
  }

  static Future<List<Consultation>> getPendingConsultations() async {
    final data = await getMyConsultationsParsed(
      status: 'pending',
    );
    return data?.consultations ?? [];
  }

  // Date range queries
  static Future<List<Consultation>> getConsultationsInDateRange({
    required DateTime from,
    required DateTime to,
    int? limit,
  }) async {
    final data = await getMyConsultationsParsed(
      from: from.toIso8601String(),
      to: to.toIso8601String(),
      limit: limit,
    );
    return data?.consultations ?? [];
  }

  static Future<List<Consultation>> getConsultationsThisWeek() async {
    final now = DateTime.now();
    final weekStart = now.subtract(Duration(days: now.weekday - 1));
    final weekEnd = weekStart.add(const Duration(days: 6, hours: 23, minutes: 59));

    return await getConsultationsInDateRange(
      from: weekStart,
      to: weekEnd,
    );
  }

  static Future<List<Consultation>> getConsultationsThisMonth() async {
    final now = DateTime.now();
    final monthStart = DateTime(now.year, now.month, 1);
    final monthEnd = DateTime(now.year, now.month + 1, 0, 23, 59);

    return await getConsultationsInDateRange(
      from: monthStart,
      to: monthEnd,
    );
  }

  // Statistics helpers
  static Future<Map<String, int>> getConsultationStatusCounts() async {
    final data = await getMyConsultationsParsed(limit: 1000); // Get all for counting
    final consultations = data?.consultations ?? [];
    
    final statusCounts = <String, int>{};
    for (final consultation in consultations) {
      statusCounts[consultation.status] = (statusCounts[consultation.status] ?? 0) + 1;
    }
    
    return statusCounts;
  }

  static Future<int> getTotalConsultationsCount() async {
    final data = await getMyConsultationsParsed(limit: 1);
    return data?.total ?? 0;
  }
}