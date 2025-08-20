import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnalysisDataDto } from './dto/create-analysis-data.dto';
import { 
  AnalysisDataResponseDto, 
  AnalysisHistoryResponseDto, 
  ProgressSummaryResponseDto 
} from './dto/analysis-data-response.dto';

@Injectable()
export class AnalysisDataService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateAnalysisDataDto): Promise<AnalysisDataResponseDto> {
    try {
      // Verify that the analysis session exists
      const analysisSession = await this.prisma.analysisSession.findUnique({
        where: { id: createDto.analysisId },
      });

      if (!analysisSession) {
        throw new NotFoundException(`Analysis session with ID ${createDto.analysisId} not found`);
      }

      // Verify that the user ID matches the session
      if (analysisSession.userId !== createDto.userId) {
        throw new BadRequestException('User ID does not match the analysis session');
      }

      const analysisData = await this.prisma.analysisData.create({
        data: {
          userId: createDto.userId,
          analysisId: createDto.analysisId,
          analysisType: createDto.analysisType,
          data: createDto.data,
        },
      });

      return this.mapToResponseDto(analysisData);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create analysis data');
    }
  }

  async findById(id: string): Promise<AnalysisDataResponseDto> {
    const analysisData = await this.prisma.analysisData.findUnique({
      where: { id },
      include: {
        analysisSession: {
          select: {
            sessionId: true,
            status: true,
            language: true,
          },
        },
      },
    });

    if (!analysisData) {
      throw new NotFoundException(`Analysis data with ID ${id} not found`);
    }

    return this.mapToResponseDto(analysisData);
  }

  async getUserAnalysisHistory(
    userId: string,
    limit: number = 10,
    offset: number = 0,
    analysisType?: string,
  ): Promise<AnalysisHistoryResponseDto> {
    const whereClause: any = { userId };
    
    if (analysisType) {
      whereClause.analysisType = analysisType;
    }

    const [history, total] = await Promise.all([
      this.prisma.analysisData.findMany({
        where: whereClause,
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip: offset,
        include: {
          analysisSession: {
            select: {
              sessionId: true,
              status: true,
              language: true,
            },
          },
        },
      }),
      this.prisma.analysisData.count({
        where: whereClause,
      }),
    ]);

    return {
      history: history.map(data => this.mapToResponseDto(data)),
      total,
      limit,
      offset,
    };
  }

  async getSessionAnalysisData(
    analysisId: string,
    analysisType?: string,
  ): Promise<AnalysisDataResponseDto[]> {
    const whereClause: any = { analysisId };
    
    if (analysisType) {
      whereClause.analysisType = analysisType;
    }

    const analysisData = await this.prisma.analysisData.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      include: {
        analysisSession: {
          select: {
            sessionId: true,
            status: true,
            language: true,
          },
        },
      },
    });

    return analysisData.map(data => this.mapToResponseDto(data));
  }

  async getUserProgressSummary(userId: string): Promise<ProgressSummaryResponseDto> {
    try {
      // Get all analysis data for the user
      const analysisData = await this.prisma.analysisData.findMany({
        where: { userId },
        orderBy: { timestamp: 'asc' },
        include: {
          analysisSession: {
            select: {
              sessionId: true,
              status: true,
            },
          },
        },
      });

      if (analysisData.length === 0) {
        return {
          userId,
          totalAnalyses: 0,
          progressTimeline: [],
          skinImprovements: [],
          recommendationFollowRate: 0,
        };
      }

      const totalAnalyses = analysisData.length;
      const firstAnalysis = analysisData[0]?.timestamp;
      const lastAnalysis = analysisData[analysisData.length - 1]?.timestamp;

      // Build progress timeline
      const progressTimeline = analysisData
        .filter(data => data.analysisType === 'skin_analysis')
        .map(data => {
          const analysisData = data.data as any;
          return {
            date: data.timestamp.toISOString().split('T')[0],
            concerns: analysisData?.concerns || [],
            skin_type: analysisData?.skin_type || 'unknown',
            confidence_score: analysisData?.confidence_score || 0,
          };
        });

      // Calculate skin improvements
      const skinImprovements = this.calculateSkinImprovements(progressTimeline);

      // Get recommendation follow rate
      const recommendationFollowRate = await this.calculateRecommendationFollowRate(userId);

      return {
        userId,
        totalAnalyses,
        firstAnalysis,
        lastAnalysis,
        progressTimeline,
        skinImprovements,
        recommendationFollowRate,
      };
    } catch (error) {
      throw new BadRequestException('Failed to generate progress summary');
    }
  }

  async getAnalysisTypes(userId?: string): Promise<{ analysisType: string; count: number }[]> {
    const whereClause = userId ? { userId } : {};

    const analysisTypes = await this.prisma.analysisData.groupBy({
      by: ['analysisType'],
      where: whereClause,
      _count: {
        analysisType: true,
      },
      orderBy: {
        _count: {
          analysisType: 'desc',
        },
      },
    });

    return analysisTypes.map(type => ({
      analysisType: type.analysisType,
      count: type._count.analysisType,
    }));
  }

  async deleteAnalysisData(id: string): Promise<void> {
    try {
      const analysisData = await this.prisma.analysisData.findUnique({
        where: { id },
      });

      if (!analysisData) {
        throw new NotFoundException(`Analysis data with ID ${id} not found`);
      }

      await this.prisma.analysisData.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete analysis data');
    }
  }

  private mapToResponseDto(data: any): AnalysisDataResponseDto {
    return {
      id: data.id,
      userId: data.userId,
      analysisId: data.analysisId,
      analysisType: data.analysisType,
      data: data.data,
      timestamp: data.timestamp,
    };
  }

  private calculateSkinImprovements(timeline: any[]): Array<{
    improvement: string;
    progress: number;
    timeline: string[];
  }> {
    if (timeline.length < 2) {
      return [];
    }

    const improvements: Array<{
      improvement: string;
      progress: number;
      timeline: string[];
    }> = [];

    const firstAnalysis = timeline[0];
    const lastAnalysis = timeline[timeline.length - 1];

    // Check for concern reductions
    const initialConcerns = new Set(firstAnalysis.concerns);
    const currentConcerns = new Set(lastAnalysis.concerns);

    initialConcerns.forEach(concern => {
      if (!currentConcerns.has(concern)) {
        improvements.push({
          improvement: `${concern}_reduction`,
          progress: 1.0, // Complete improvement
          timeline: [firstAnalysis.date, lastAnalysis.date],
        });
      }
    });

    // Check for confidence score improvement
    const confidenceImprovement = lastAnalysis.confidence_score - firstAnalysis.confidence_score;
    if (confidenceImprovement > 0.1) {
      improvements.push({
        improvement: 'analysis_confidence',
        progress: Math.min(confidenceImprovement, 1.0),
        timeline: [firstAnalysis.date, lastAnalysis.date],
      });
    }

    return improvements;
  }

  private async calculateRecommendationFollowRate(userId: string): Promise<number> {
    try {
      const [totalRecommendations, followedRecommendations] = await Promise.all([
        this.prisma.productRecommendation.count({
          where: { userId },
        }),
        this.prisma.productRecommendation.count({
          where: { 
            userId,
            status: { in: ['purchased', 'tried'] },
          },
        }),
      ]);

      return totalRecommendations > 0 ? followedRecommendations / totalRecommendations : 0;
    } catch (error) {
      return 0;
    }
  }
}
