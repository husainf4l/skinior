// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DashboardOverviewRequest _$DashboardOverviewRequestFromJson(
  Map<String, dynamic> json,
) => DashboardOverviewRequest(
  period: json['period'] as String?,
  timezone: json['timezone'] as String?,
);

Map<String, dynamic> _$DashboardOverviewRequestToJson(
  DashboardOverviewRequest instance,
) => <String, dynamic>{
  'period': instance.period,
  'timezone': instance.timezone,
};

DashboardOverview _$DashboardOverviewFromJson(Map<String, dynamic> json) =>
    DashboardOverview(
      personalStats: PersonalStats.fromJson(
        json['personalStats'] as Map<String, dynamic>,
      ),
      recentTreatments: (json['recentTreatments'] as List<dynamic>)
          .map((e) => TreatmentSummary.fromJson(e as Map<String, dynamic>))
          .toList(),
      recentConsultations: (json['recentConsultations'] as List<dynamic>)
          .map((e) => ConsultationSummary.fromJson(e as Map<String, dynamic>))
          .toList(),
      productMetrics: ProductMetrics.fromJson(
        json['productMetrics'] as Map<String, dynamic>,
      ),
      aiStats: AiStats.fromJson(json['aiStats'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$DashboardOverviewToJson(DashboardOverview instance) =>
    <String, dynamic>{
      'personalStats': instance.personalStats,
      'recentTreatments': instance.recentTreatments,
      'recentConsultations': instance.recentConsultations,
      'productMetrics': instance.productMetrics,
      'aiStats': instance.aiStats,
    };

PersonalStats _$PersonalStatsFromJson(Map<String, dynamic> json) =>
    PersonalStats(
      totalConsultations: (json['totalConsultations'] as num).toInt(),
      completedTreatments: (json['completedTreatments'] as num).toInt(),
      activeTreatments: (json['activeTreatments'] as num).toInt(),
      productsPurchased: (json['productsPurchased'] as num).toInt(),
      averageRating: (json['averageRating'] as num).toDouble(),
      lastConsultation: json['lastConsultation'] == null
          ? null
          : DateTime.parse(json['lastConsultation'] as String),
    );

Map<String, dynamic> _$PersonalStatsToJson(PersonalStats instance) =>
    <String, dynamic>{
      'totalConsultations': instance.totalConsultations,
      'completedTreatments': instance.completedTreatments,
      'activeTreatments': instance.activeTreatments,
      'productsPurchased': instance.productsPurchased,
      'averageRating': instance.averageRating,
      'lastConsultation': instance.lastConsultation?.toIso8601String(),
    };

TreatmentSummary _$TreatmentSummaryFromJson(Map<String, dynamic> json) =>
    TreatmentSummary(
      id: json['id'] as String,
      name: json['name'] as String,
      status: json['status'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: json['endDate'] == null
          ? null
          : DateTime.parse(json['endDate'] as String),
      progress: (json['progress'] as num).toInt(),
    );

Map<String, dynamic> _$TreatmentSummaryToJson(TreatmentSummary instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'status': instance.status,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate?.toIso8601String(),
      'progress': instance.progress,
    };

ConsultationSummary _$ConsultationSummaryFromJson(Map<String, dynamic> json) =>
    ConsultationSummary(
      id: json['id'] as String,
      status: json['status'] as String,
      date: DateTime.parse(json['date'] as String),
      concerns: (json['concerns'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      recommendationsCount: (json['recommendationsCount'] as num).toInt(),
    );

Map<String, dynamic> _$ConsultationSummaryToJson(
  ConsultationSummary instance,
) => <String, dynamic>{
  'id': instance.id,
  'status': instance.status,
  'date': instance.date.toIso8601String(),
  'concerns': instance.concerns,
  'recommendationsCount': instance.recommendationsCount,
};

ProductMetrics _$ProductMetricsFromJson(Map<String, dynamic> json) =>
    ProductMetrics(
      totalRecommended: (json['totalRecommended'] as num).toInt(),
      purchased: (json['purchased'] as num).toInt(),
      wishlist: (json['wishlist'] as num).toInt(),
      tried: (json['tried'] as num).toInt(),
      averageRating: (json['averageRating'] as num).toDouble(),
    );

Map<String, dynamic> _$ProductMetricsToJson(ProductMetrics instance) =>
    <String, dynamic>{
      'totalRecommended': instance.totalRecommended,
      'purchased': instance.purchased,
      'wishlist': instance.wishlist,
      'tried': instance.tried,
      'averageRating': instance.averageRating,
    };

AiStats _$AiStatsFromJson(Map<String, dynamic> json) => AiStats(
  totalAnalyses: (json['totalAnalyses'] as num).toInt(),
  lastAnalysisType: json['lastAnalysisType'] as String?,
  lastAnalysisDate: json['lastAnalysisDate'] == null
      ? null
      : DateTime.parse(json['lastAnalysisDate'] as String),
  averageConfidence: (json['averageConfidence'] as num).toDouble(),
  analysisBreakdown: Map<String, int>.from(json['analysisBreakdown'] as Map),
);

Map<String, dynamic> _$AiStatsToJson(AiStats instance) => <String, dynamic>{
  'totalAnalyses': instance.totalAnalyses,
  'lastAnalysisType': instance.lastAnalysisType,
  'lastAnalysisDate': instance.lastAnalysisDate?.toIso8601String(),
  'averageConfidence': instance.averageConfidence,
  'analysisBreakdown': instance.analysisBreakdown,
};
