import 'package:json_annotation/json_annotation.dart';

part 'consultation_models.g.dart';

@JsonSerializable()
class ConsultationQueryRequest {
  final int? limit;
  final String? cursor;
  final String? status;
  final String? from;
  final String? to;

  ConsultationQueryRequest({
    this.limit,
    this.cursor,
    this.status,
    this.from,
    this.to,
  });

  factory ConsultationQueryRequest.fromJson(Map<String, dynamic> json) =>
      _$ConsultationQueryRequestFromJson(json);
  
  Map<String, dynamic> toJson() => _$ConsultationQueryRequestToJson(this);
}

@JsonSerializable()
class Consultation {
  final String id;
  final String userId;
  final String status;
  final String? sessionId;
  final List<String>? concerns;
  final Map<String, dynamic>? skinAnalysis;
  final List<ConsultationRecommendation>? recommendations;
  final DateTime createdAt;
  final DateTime? completedAt;
  final DateTime? updatedAt;

  Consultation({
    required this.id,
    required this.userId,
    required this.status,
    this.sessionId,
    this.concerns,
    this.skinAnalysis,
    this.recommendations,
    required this.createdAt,
    this.completedAt,
    this.updatedAt,
  });

  factory Consultation.fromJson(Map<String, dynamic> json) =>
      _$ConsultationFromJson(json);
  
  Map<String, dynamic> toJson() => _$ConsultationToJson(this);
}

@JsonSerializable()
class ConsultationRecommendation {
  final String type;
  final String title;
  final String description;
  final String? productId;
  final String? treatmentId;
  final Map<String, dynamic>? details;

  ConsultationRecommendation({
    required this.type,
    required this.title,
    required this.description,
    this.productId,
    this.treatmentId,
    this.details,
  });

  factory ConsultationRecommendation.fromJson(Map<String, dynamic> json) =>
      _$ConsultationRecommendationFromJson(json);
  
  Map<String, dynamic> toJson() => _$ConsultationRecommendationToJson(this);
}

@JsonSerializable()
class ConsultationsResponse {
  final bool success;
  final ConsultationsData data;
  final String message;
  final String timestamp;

  ConsultationsResponse({
    required this.success,
    required this.data,
    required this.message,
    required this.timestamp,
  });

  factory ConsultationsResponse.fromJson(Map<String, dynamic> json) =>
      _$ConsultationsResponseFromJson(json);
  
  Map<String, dynamic> toJson() => _$ConsultationsResponseToJson(this);
}

@JsonSerializable()
class ConsultationsData {
  final List<Consultation> consultations;
  final int total;
  final String? nextCursor;
  final bool hasMore;

  ConsultationsData({
    required this.consultations,
    required this.total,
    this.nextCursor,
    required this.hasMore,
  });

  factory ConsultationsData.fromJson(Map<String, dynamic> json) =>
      _$ConsultationsDataFromJson(json);
  
  Map<String, dynamic> toJson() => _$ConsultationsDataToJson(this);
}