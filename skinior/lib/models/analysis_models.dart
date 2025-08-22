import 'package:json_annotation/json_annotation.dart';

part 'analysis_models.g.dart';

@JsonSerializable()
class CreateAnalysisSessionRequest {
  final String userId;
  final String sessionId;
  final String? language;
  final Map<String, dynamic>? metadata;

  CreateAnalysisSessionRequest({
    required this.userId,
    required this.sessionId,
    this.language,
    this.metadata,
  });

  factory CreateAnalysisSessionRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateAnalysisSessionRequestFromJson(json);
  
  Map<String, dynamic> toJson() => _$CreateAnalysisSessionRequestToJson(this);
}

@JsonSerializable()
class AnalysisSession {
  final String id;
  final String userId;
  final String sessionId;
  final String status;
  final String? language;
  final Map<String, dynamic>? metadata;
  final DateTime createdAt;
  final DateTime? completedAt;
  final DateTime? updatedAt;

  AnalysisSession({
    required this.id,
    required this.userId,
    required this.sessionId,
    required this.status,
    this.language,
    this.metadata,
    required this.createdAt,
    this.completedAt,
    this.updatedAt,
  });

  factory AnalysisSession.fromJson(Map<String, dynamic> json) =>
      _$AnalysisSessionFromJson(json);
  
  Map<String, dynamic> toJson() => _$AnalysisSessionToJson(this);
}

@JsonSerializable()
class UpdateAnalysisSessionRequest {
  final String? status;
  final String? language;
  final Map<String, dynamic>? metadata;
  final DateTime? completedAt;

  UpdateAnalysisSessionRequest({
    this.status,
    this.language,
    this.metadata,
    this.completedAt,
  });

  factory UpdateAnalysisSessionRequest.fromJson(Map<String, dynamic> json) =>
      _$UpdateAnalysisSessionRequestFromJson(json);
  
  Map<String, dynamic> toJson() => _$UpdateAnalysisSessionRequestToJson(this);
}

@JsonSerializable()
class CreateAnalysisDataRequest {
  final String userId;
  final String analysisId;
  final String analysisType;
  final Map<String, dynamic> data;

  CreateAnalysisDataRequest({
    required this.userId,
    required this.analysisId,
    required this.analysisType,
    required this.data,
  });

  factory CreateAnalysisDataRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateAnalysisDataRequestFromJson(json);
  
  Map<String, dynamic> toJson() => _$CreateAnalysisDataRequestToJson(this);
}

@JsonSerializable()
class AnalysisData {
  final String id;
  final String userId;
  final String analysisId;
  final String analysisType;
  final Map<String, dynamic> data;
  final DateTime timestamp;

  AnalysisData({
    required this.id,
    required this.userId,
    required this.analysisId,
    required this.analysisType,
    required this.data,
    required this.timestamp,
  });

  factory AnalysisData.fromJson(Map<String, dynamic> json) =>
      _$AnalysisDataFromJson(json);
  
  Map<String, dynamic> toJson() => _$AnalysisDataToJson(this);
}

@JsonSerializable()
class SkinAnalysis {
  final String? skinType;
  final List<String>? concerns;
  final Map<String, dynamic>? metrics;
  final double? confidenceScore;
  final List<String>? recommendations;
  final Map<String, dynamic>? routine;

  SkinAnalysis({
    this.skinType,
    this.concerns,
    this.metrics,
    this.confidenceScore,
    this.recommendations,
    this.routine,
  });

  factory SkinAnalysis.fromJson(Map<String, dynamic> json) =>
      _$SkinAnalysisFromJson(json);
  
  Map<String, dynamic> toJson() => _$SkinAnalysisToJson(this);
}

@JsonSerializable()
class AnalysisSessionStats {
  final int totalSessions;
  final int completedSessions;
  final int inProgressSessions;
  final int cancelledSessions;
  final DateTime? firstSession;
  final DateTime? lastSession;

  AnalysisSessionStats({
    required this.totalSessions,
    required this.completedSessions,
    required this.inProgressSessions,
    required this.cancelledSessions,
    this.firstSession,
    this.lastSession,
  });

  factory AnalysisSessionStats.fromJson(Map<String, dynamic> json) =>
      _$AnalysisSessionStatsFromJson(json);
  
  Map<String, dynamic> toJson() => _$AnalysisSessionStatsToJson(this);
}