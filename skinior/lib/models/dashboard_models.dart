import 'package:json_annotation/json_annotation.dart';

part 'dashboard_models.g.dart';

@JsonSerializable()
class DashboardOverviewRequest {
  final String? period;
  final String? timezone;

  DashboardOverviewRequest({
    this.period,
    this.timezone,
  });

  factory DashboardOverviewRequest.fromJson(Map<String, dynamic> json) =>
      _$DashboardOverviewRequestFromJson(json);
  
  Map<String, dynamic> toJson() => _$DashboardOverviewRequestToJson(this);
}

@JsonSerializable()
class DashboardOverview {
  final PersonalStats personalStats;
  final List<TreatmentSummary> recentTreatments;
  final List<ConsultationSummary> recentConsultations;
  final ProductMetrics productMetrics;
  final AiStats aiStats;

  DashboardOverview({
    required this.personalStats,
    required this.recentTreatments,
    required this.recentConsultations,
    required this.productMetrics,
    required this.aiStats,
  });

  factory DashboardOverview.fromJson(Map<String, dynamic> json) =>
      _$DashboardOverviewFromJson(json);
  
  Map<String, dynamic> toJson() => _$DashboardOverviewToJson(this);
}

@JsonSerializable()
class PersonalStats {
  final int totalConsultations;
  final int completedTreatments;
  final int activeTreatments;
  final int productsPurchased;
  final double averageRating;
  final DateTime? lastConsultation;

  PersonalStats({
    required this.totalConsultations,
    required this.completedTreatments,
    required this.activeTreatments,
    required this.productsPurchased,
    required this.averageRating,
    this.lastConsultation,
  });

  factory PersonalStats.fromJson(Map<String, dynamic> json) =>
      _$PersonalStatsFromJson(json);
  
  Map<String, dynamic> toJson() => _$PersonalStatsToJson(this);
}

@JsonSerializable()
class TreatmentSummary {
  final String id;
  final String name;
  final String status;
  final DateTime startDate;
  final DateTime? endDate;
  final int progress;

  TreatmentSummary({
    required this.id,
    required this.name,
    required this.status,
    required this.startDate,
    this.endDate,
    required this.progress,
  });

  factory TreatmentSummary.fromJson(Map<String, dynamic> json) =>
      _$TreatmentSummaryFromJson(json);
  
  Map<String, dynamic> toJson() => _$TreatmentSummaryToJson(this);
}

@JsonSerializable()
class ConsultationSummary {
  final String id;
  final String status;
  final DateTime date;
  final List<String> concerns;
  final int recommendationsCount;

  ConsultationSummary({
    required this.id,
    required this.status,
    required this.date,
    required this.concerns,
    required this.recommendationsCount,
  });

  factory ConsultationSummary.fromJson(Map<String, dynamic> json) =>
      _$ConsultationSummaryFromJson(json);
  
  Map<String, dynamic> toJson() => _$ConsultationSummaryToJson(this);
}

@JsonSerializable()
class ProductMetrics {
  final int totalRecommended;
  final int purchased;
  final int wishlist;
  final int tried;
  final double averageRating;

  ProductMetrics({
    required this.totalRecommended,
    required this.purchased,
    required this.wishlist,
    required this.tried,
    required this.averageRating,
  });

  factory ProductMetrics.fromJson(Map<String, dynamic> json) =>
      _$ProductMetricsFromJson(json);
  
  Map<String, dynamic> toJson() => _$ProductMetricsToJson(this);
}

@JsonSerializable()
class AiStats {
  final int totalAnalyses;
  final String? lastAnalysisType;
  final DateTime? lastAnalysisDate;
  final double averageConfidence;
  final Map<String, int> analysisBreakdown;

  AiStats({
    required this.totalAnalyses,
    this.lastAnalysisType,
    this.lastAnalysisDate,
    required this.averageConfidence,
    required this.analysisBreakdown,
  });

  factory AiStats.fromJson(Map<String, dynamic> json) =>
      _$AiStatsFromJson(json);
  
  Map<String, dynamic> toJson() => _$AiStatsToJson(this);
}