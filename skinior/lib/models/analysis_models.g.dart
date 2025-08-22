// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateAnalysisSessionRequest _$CreateAnalysisSessionRequestFromJson(
  Map<String, dynamic> json,
) => CreateAnalysisSessionRequest(
  userId: json['userId'] as String,
  sessionId: json['sessionId'] as String,
  language: json['language'] as String?,
  metadata: json['metadata'] as Map<String, dynamic>?,
);

Map<String, dynamic> _$CreateAnalysisSessionRequestToJson(
  CreateAnalysisSessionRequest instance,
) => <String, dynamic>{
  'userId': instance.userId,
  'sessionId': instance.sessionId,
  'language': instance.language,
  'metadata': instance.metadata,
};

AnalysisSession _$AnalysisSessionFromJson(Map<String, dynamic> json) =>
    AnalysisSession(
      id: json['id'] as String,
      userId: json['userId'] as String,
      sessionId: json['sessionId'] as String,
      status: json['status'] as String,
      language: json['language'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      completedAt: json['completedAt'] == null
          ? null
          : DateTime.parse(json['completedAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$AnalysisSessionToJson(AnalysisSession instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'sessionId': instance.sessionId,
      'status': instance.status,
      'language': instance.language,
      'metadata': instance.metadata,
      'createdAt': instance.createdAt.toIso8601String(),
      'completedAt': instance.completedAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };

UpdateAnalysisSessionRequest _$UpdateAnalysisSessionRequestFromJson(
  Map<String, dynamic> json,
) => UpdateAnalysisSessionRequest(
  status: json['status'] as String?,
  language: json['language'] as String?,
  metadata: json['metadata'] as Map<String, dynamic>?,
  completedAt: json['completedAt'] == null
      ? null
      : DateTime.parse(json['completedAt'] as String),
);

Map<String, dynamic> _$UpdateAnalysisSessionRequestToJson(
  UpdateAnalysisSessionRequest instance,
) => <String, dynamic>{
  'status': instance.status,
  'language': instance.language,
  'metadata': instance.metadata,
  'completedAt': instance.completedAt?.toIso8601String(),
};

CreateAnalysisDataRequest _$CreateAnalysisDataRequestFromJson(
  Map<String, dynamic> json,
) => CreateAnalysisDataRequest(
  userId: json['userId'] as String,
  analysisId: json['analysisId'] as String,
  analysisType: json['analysisType'] as String,
  data: json['data'] as Map<String, dynamic>,
);

Map<String, dynamic> _$CreateAnalysisDataRequestToJson(
  CreateAnalysisDataRequest instance,
) => <String, dynamic>{
  'userId': instance.userId,
  'analysisId': instance.analysisId,
  'analysisType': instance.analysisType,
  'data': instance.data,
};

AnalysisData _$AnalysisDataFromJson(Map<String, dynamic> json) => AnalysisData(
  id: json['id'] as String,
  userId: json['userId'] as String,
  analysisId: json['analysisId'] as String,
  analysisType: json['analysisType'] as String,
  data: json['data'] as Map<String, dynamic>,
  timestamp: DateTime.parse(json['timestamp'] as String),
);

Map<String, dynamic> _$AnalysisDataToJson(AnalysisData instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'analysisId': instance.analysisId,
      'analysisType': instance.analysisType,
      'data': instance.data,
      'timestamp': instance.timestamp.toIso8601String(),
    };

SkinAnalysis _$SkinAnalysisFromJson(Map<String, dynamic> json) => SkinAnalysis(
  skinType: json['skinType'] as String?,
  concerns: (json['concerns'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  metrics: json['metrics'] as Map<String, dynamic>?,
  confidenceScore: (json['confidenceScore'] as num?)?.toDouble(),
  recommendations: (json['recommendations'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  routine: json['routine'] as Map<String, dynamic>?,
);

Map<String, dynamic> _$SkinAnalysisToJson(SkinAnalysis instance) =>
    <String, dynamic>{
      'skinType': instance.skinType,
      'concerns': instance.concerns,
      'metrics': instance.metrics,
      'confidenceScore': instance.confidenceScore,
      'recommendations': instance.recommendations,
      'routine': instance.routine,
    };

AnalysisSessionStats _$AnalysisSessionStatsFromJson(
  Map<String, dynamic> json,
) => AnalysisSessionStats(
  totalSessions: (json['totalSessions'] as num).toInt(),
  completedSessions: (json['completedSessions'] as num).toInt(),
  inProgressSessions: (json['inProgressSessions'] as num).toInt(),
  cancelledSessions: (json['cancelledSessions'] as num).toInt(),
  firstSession: json['firstSession'] == null
      ? null
      : DateTime.parse(json['firstSession'] as String),
  lastSession: json['lastSession'] == null
      ? null
      : DateTime.parse(json['lastSession'] as String),
);

Map<String, dynamic> _$AnalysisSessionStatsToJson(
  AnalysisSessionStats instance,
) => <String, dynamic>{
  'totalSessions': instance.totalSessions,
  'completedSessions': instance.completedSessions,
  'inProgressSessions': instance.inProgressSessions,
  'cancelledSessions': instance.cancelledSessions,
  'firstSession': instance.firstSession?.toIso8601String(),
  'lastSession': instance.lastSession?.toIso8601String(),
};
