// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'consultation_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ConsultationQueryRequest _$ConsultationQueryRequestFromJson(
  Map<String, dynamic> json,
) => ConsultationQueryRequest(
  limit: (json['limit'] as num?)?.toInt(),
  cursor: json['cursor'] as String?,
  status: json['status'] as String?,
  from: json['from'] as String?,
  to: json['to'] as String?,
);

Map<String, dynamic> _$ConsultationQueryRequestToJson(
  ConsultationQueryRequest instance,
) => <String, dynamic>{
  'limit': instance.limit,
  'cursor': instance.cursor,
  'status': instance.status,
  'from': instance.from,
  'to': instance.to,
};

Consultation _$ConsultationFromJson(Map<String, dynamic> json) => Consultation(
  id: json['id'] as String,
  userId: json['userId'] as String,
  status: json['status'] as String,
  sessionId: json['sessionId'] as String?,
  concerns: (json['concerns'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  skinAnalysis: json['skinAnalysis'] as Map<String, dynamic>?,
  recommendations: (json['recommendations'] as List<dynamic>?)
      ?.map(
        (e) => ConsultationRecommendation.fromJson(e as Map<String, dynamic>),
      )
      .toList(),
  createdAt: DateTime.parse(json['createdAt'] as String),
  completedAt: json['completedAt'] == null
      ? null
      : DateTime.parse(json['completedAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$ConsultationToJson(Consultation instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'status': instance.status,
      'sessionId': instance.sessionId,
      'concerns': instance.concerns,
      'skinAnalysis': instance.skinAnalysis,
      'recommendations': instance.recommendations,
      'createdAt': instance.createdAt.toIso8601String(),
      'completedAt': instance.completedAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };

ConsultationRecommendation _$ConsultationRecommendationFromJson(
  Map<String, dynamic> json,
) => ConsultationRecommendation(
  type: json['type'] as String,
  title: json['title'] as String,
  description: json['description'] as String,
  productId: json['productId'] as String?,
  treatmentId: json['treatmentId'] as String?,
  details: json['details'] as Map<String, dynamic>?,
);

Map<String, dynamic> _$ConsultationRecommendationToJson(
  ConsultationRecommendation instance,
) => <String, dynamic>{
  'type': instance.type,
  'title': instance.title,
  'description': instance.description,
  'productId': instance.productId,
  'treatmentId': instance.treatmentId,
  'details': instance.details,
};

ConsultationsResponse _$ConsultationsResponseFromJson(
  Map<String, dynamic> json,
) => ConsultationsResponse(
  success: json['success'] as bool,
  data: ConsultationsData.fromJson(json['data'] as Map<String, dynamic>),
  message: json['message'] as String,
  timestamp: json['timestamp'] as String,
);

Map<String, dynamic> _$ConsultationsResponseToJson(
  ConsultationsResponse instance,
) => <String, dynamic>{
  'success': instance.success,
  'data': instance.data,
  'message': instance.message,
  'timestamp': instance.timestamp,
};

ConsultationsData _$ConsultationsDataFromJson(Map<String, dynamic> json) =>
    ConsultationsData(
      consultations: (json['consultations'] as List<dynamic>)
          .map((e) => Consultation.fromJson(e as Map<String, dynamic>))
          .toList(),
      total: (json['total'] as num).toInt(),
      nextCursor: json['nextCursor'] as String?,
      hasMore: json['hasMore'] as bool,
    );

Map<String, dynamic> _$ConsultationsDataToJson(ConsultationsData instance) =>
    <String, dynamic>{
      'consultations': instance.consultations,
      'total': instance.total,
      'nextCursor': instance.nextCursor,
      'hasMore': instance.hasMore,
    };
