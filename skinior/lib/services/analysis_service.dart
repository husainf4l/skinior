import '../models/analysis_models.dart';
import 'api_client.dart';

class AnalysisService {
  static const String _sessionsEndpoint = '/analysis-sessions';
  static const String _dataEndpoint = '/analysis-data';

  // Analysis Sessions
  static Future<ApiResponse> createAnalysisSession(CreateAnalysisSessionRequest request) async {
    return await ApiClient.post(_sessionsEndpoint, body: request.toJson());
  }

  static Future<ApiResponse> getAnalysisSession(String sessionId) async {
    return await ApiClient.get('$_sessionsEndpoint/$sessionId');
  }

  static Future<ApiResponse> getUserAnalysisSessions(
    String userId, {
    int limit = 10,
    int offset = 0,
  }) async {
    return await ApiClient.get('$_sessionsEndpoint/user/$userId', queryParams: {
      'limit': limit.toString(),
      'offset': offset.toString(),
    });
  }

  static Future<ApiResponse> updateAnalysisSession(
    String sessionId,
    UpdateAnalysisSessionRequest request,
  ) async {
    return await ApiClient.put('$_sessionsEndpoint/$sessionId', body: request.toJson());
  }

  static Future<ApiResponse> deleteAnalysisSession(String sessionId) async {
    return await ApiClient.delete('$_sessionsEndpoint/$sessionId');
  }

  static Future<ApiResponse> getAnalysisSessionStats(String userId) async {
    return await ApiClient.get('$_sessionsEndpoint/user/$userId/stats');
  }

  // Analysis Data
  static Future<ApiResponse> createAnalysisData(CreateAnalysisDataRequest request) async {
    return await ApiClient.post(_dataEndpoint, body: request.toJson());
  }

  static Future<ApiResponse> getAnalysisDataByAnalysisId(String analysisId) async {
    return await ApiClient.get('$_dataEndpoint/analysis/$analysisId');
  }

  static Future<ApiResponse> getUserAnalysisData(
    String userId, {
    String? analysisType,
    int limit = 20,
    int offset = 0,
  }) async {
    final queryParams = <String, dynamic>{
      'limit': limit.toString(),
      'offset': offset.toString(),
    };
    
    if (analysisType != null) {
      queryParams['analysisType'] = analysisType;
    }

    return await ApiClient.get('$_dataEndpoint/user/$userId', queryParams: queryParams);
  }

  static Future<ApiResponse> getAnalysisHistory(
    String userId, {
    String? analysisType,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    final queryParams = <String, dynamic>{};
    
    if (analysisType != null) {
      queryParams['analysisType'] = analysisType;
    }
    if (startDate != null) {
      queryParams['startDate'] = startDate.toIso8601String();
    }
    if (endDate != null) {
      queryParams['endDate'] = endDate.toIso8601String();
    }

    return await ApiClient.get('$_dataEndpoint/user/$userId/history', queryParams: queryParams);
  }

  static Future<ApiResponse> getProgressSummary(String userId) async {
    return await ApiClient.get('$_dataEndpoint/user/$userId/progress');
  }

  // Helper methods with parsed responses
  static Future<AnalysisSession?> createAnalysisSessionParsed(CreateAnalysisSessionRequest request) async {
    final response = await createAnalysisSession(request);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null) {
        return AnalysisSession.fromJson(data['data']);
      }
    }
    return null;
  }

  static Future<AnalysisSession?> getAnalysisSessionParsed(String sessionId) async {
    final response = await getAnalysisSession(sessionId);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null) {
        return AnalysisSession.fromJson(data['data']);
      }
    }
    return null;
  }

  static Future<List<AnalysisSession>> getUserAnalysisSessionsParsed(
    String userId, {
    int limit = 10,
    int offset = 0,
  }) async {
    final response = await getUserAnalysisSessions(userId, limit: limit, offset: offset);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null && data['data']['sessions'] is List) {
        return (data['data']['sessions'] as List)
            .map((item) => AnalysisSession.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }
    return [];
  }

  static Future<AnalysisSessionStats?> getAnalysisSessionStatsParsed(String userId) async {
    final response = await getAnalysisSessionStats(userId);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null) {
        return AnalysisSessionStats.fromJson(data['data']);
      }
    }
    return null;
  }

  static Future<AnalysisData?> createAnalysisDataParsed(CreateAnalysisDataRequest request) async {
    final response = await createAnalysisData(request);
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] != null) {
        return AnalysisData.fromJson(data['data']);
      }
    }
    return null;
  }

  static Future<List<AnalysisData>> getUserAnalysisDataParsed(
    String userId, {
    String? analysisType,
    int limit = 20,
    int offset = 0,
  }) async {
    final response = await getUserAnalysisData(
      userId,
      analysisType: analysisType,
      limit: limit,
      offset: offset,
    );
    
    if (response.success && response.data != null) {
      final data = response.getData<Map<String, dynamic>>();
      if (data != null && data['data'] is List) {
        return (data['data'] as List)
            .map((item) => AnalysisData.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }
    return [];
  }

  // Quick analysis creation helper
  static Future<String?> startSkinAnalysis(String userId) async {
    final sessionId = 'session_${DateTime.now().millisecondsSinceEpoch}';
    final request = CreateAnalysisSessionRequest(
      userId: userId,
      sessionId: sessionId,
      language: 'english',
      metadata: {
        'type': 'skin_analysis',
        'platform': 'flutter',
        'timestamp': DateTime.now().toIso8601String(),
      },
    );

    final session = await createAnalysisSessionParsed(request);
    return session?.sessionId;
  }

  static Future<bool> completeAnalysisSession(String sessionId) async {
    final request = UpdateAnalysisSessionRequest(
      status: 'completed',
      completedAt: DateTime.now(),
    );

    final response = await updateAnalysisSession(sessionId, request);
    return response.success;
  }
}