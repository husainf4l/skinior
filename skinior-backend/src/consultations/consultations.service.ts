import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConsultationsService {
  constructor(private prisma: PrismaService) {}

  async getConsultations(
    userId: string,
    options: {
      limit?: number;
      cursor?: string;
      status?: string;
      from?: string;
      to?: string;
    } = {},
  ) {
    const { limit = 20, cursor, status, from, to } = options;

    // Build where clause
    const where: any = {
      userId,
    };

    // Add status filter
    if (status && status !== 'all') {
      where.status = status;
    }

    // Add date range filter
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    // Add cursor for pagination
    if (cursor) {
      where.id = {
        lt: cursor,
      };
    }

    // Execute query
    const analysisSessionsQuery = this.prisma.analysisSession.findMany({
      where,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        analysisData: {
          take: 1,
          orderBy: {
            timestamp: 'desc',
          },
        },
        productRecommendations: {
          take: 5,
          orderBy: {
            priority: 'desc',
          },
        },
      },
    });

    // Get total count for pagination
    const totalQuery = this.prisma.analysisSession.count({
      where: { userId },
    });

    const [analysisSessions, total] = await Promise.all([
      analysisSessionsQuery,
      totalQuery,
    ]);

    // Transform data to match the expected consultation format
    const consultations = analysisSessions.map((session) => {
      const latestAnalysis = session.analysisData[0];
      const analysisData = latestAnalysis?.data as any;

      // Extract concerns from analysis data
      const concerns = this.extractConcerns(analysisData);

      // Transform recommendations
      const recommendations = session.productRecommendations.map((rec) => ({
        id: rec.id,
        title: rec.productName || 'Product Recommendation',
        description: rec.reason || 'Recommended based on analysis',
        priority: (rec.priority || 'medium') as 'high' | 'medium' | 'low',
        category: rec.category || 'product',
      }));

      // Calculate skin analysis scores
      const skinAnalysis = this.calculateSkinAnalysis(analysisData);

      // Calculate improvement score (mock for now)
      const improvementScore = this.calculateImprovementScore(session);

      return {
        id: session.id,
        analysisType: 'AI Skin Analysis',
        status: session.status as 'completed' | 'in_progress' | 'pending' | 'cancelled',
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
        duration: 30, // Default consultation duration
        concerns,
        recommendations,
        skinAnalysis,
        improvementScore,
        advisorName: 'AI Beauty Advisor',
        notes: (session.metadata as any)?.notes || '',
        customerName: (session.metadata as any)?.customerName || 'Customer',
      };
    });

    // Determine next cursor
    const lastConsultation = consultations[consultations.length - 1];
    const nextCursor = lastConsultation ? lastConsultation.id : null;

    return {
      consultations,
      pagination: {
        total,
        limit,
        cursor: nextCursor,
        hasMore: consultations.length === limit,
      },
    };
  }

  async getConsultationById(userId: string, consultationId: string) {
    const analysisSession = await this.prisma.analysisSession.findFirst({
      where: {
        id: consultationId,
        userId,
      },
      include: {
        analysisData: {
          orderBy: {
            timestamp: 'desc',
          },
        },
        productRecommendations: {
          orderBy: {
            priority: 'desc',
          },
        },
      },
    });

    if (!analysisSession) {
      throw new NotFoundException('Consultation not found');
    }

    const latestAnalysis = analysisSession.analysisData[0];
    const analysisData = latestAnalysis?.data as any;

    // Extract concerns from analysis data
    const concerns = this.extractConcerns(analysisData);

    // Transform recommendations
    const recommendations = analysisSession.productRecommendations.map((rec) => ({
      id: rec.id,
      title: rec.productName || 'Product Recommendation',
      description: rec.reason || 'Recommended based on analysis',
      priority: (rec.priority || 'medium') as 'high' | 'medium' | 'low',
      category: rec.category || 'product',
    }));

    // Calculate skin analysis scores
    const skinAnalysis = this.calculateSkinAnalysis(analysisData);

    // Calculate improvement score
    const improvementScore = this.calculateImprovementScore(analysisSession);

    // Transform product recommendations with more details
    const productRecommendations = analysisSession.productRecommendations.map((rec) => ({
      id: rec.id,
      name: rec.productName || 'Recommended Product',
      brand: rec.brand || 'Various',
      price: rec.price || 0,
      priority: (rec.priority || 'medium') as 'high' | 'medium' | 'low',
      reason: rec.reason || 'Recommended based on your skin analysis',
      category: rec.category || 'skincare',
    }));

    return {
      id: analysisSession.id,
      analysisType: 'AI Skin Analysis',
      status: analysisSession.status as 'completed' | 'in_progress' | 'pending' | 'cancelled',
      createdAt: analysisSession.createdAt.toISOString(),
      updatedAt: analysisSession.updatedAt.toISOString(),
      duration: 30,
      concerns,
      recommendations,
      skinAnalysis,
      improvementScore,
      advisorName: 'AI Beauty Advisor',
      notes: (analysisSession.metadata as any)?.notes || '',
      customerName: (analysisSession.metadata as any)?.customerName || 'Customer',
      analysisData: analysisData || {},
      productRecommendations,
    };
  }

  private extractConcerns(analysisData: any): string[] {
    if (!analysisData) return [];

    const concerns: string[] = [];

    // Extract concerns based on analysis data structure
    if (analysisData.skinIssues) {
      concerns.push(...analysisData.skinIssues);
    }

    if (analysisData.concerns) {
      concerns.push(...analysisData.concerns);
    }

    // Analyze skin scores to determine concerns
    if (analysisData.skinScores) {
      const scores = analysisData.skinScores;
      if (scores.acne && scores.acne > 60) concerns.push('Acne');
      if (scores.dryness && scores.dryness > 60) concerns.push('Dry Skin');
      if (scores.oiliness && scores.oiliness > 60) concerns.push('Oily Skin');
      if (scores.aging && scores.aging > 60) concerns.push('Aging Signs');
      if (scores.sensitivity && scores.sensitivity > 60) concerns.push('Sensitive Skin');
    }

    // Remove duplicates
    return [...new Set(concerns)];
  }

  private calculateSkinAnalysis(analysisData: any): any {
    if (!analysisData || !analysisData.skinScores) {
      return {
        hydration: 50,
        oiliness: 50,
        elasticity: 50,
        pigmentation: 50,
        texture: 50,
        pores: 50,
      };
    }

    const scores = analysisData.skinScores;

    return {
      hydration: scores.hydration || scores.moisture || 50,
      oiliness: scores.oiliness || scores.sebum || 50,
      elasticity: scores.elasticity || scores.firmness || 50,
      pigmentation: scores.pigmentation || scores.darkSpots || 50,
      texture: scores.texture || scores.smoothness || 50,
      pores: scores.pores || scores.poreSize || 50,
    };
  }

  private calculateImprovementScore(session: any): number {
    // Mock calculation - in real implementation, this would compare
    // multiple analysis sessions over time
    const daysSinceStart = Math.floor(
      (new Date().getTime() - new Date(session.createdAt).getTime()) / 
      (1000 * 60 * 60 * 24)
    );

    // Simple mock: improvement score based on time and status
    let baseScore = 0;
    if (session.status === 'completed') baseScore = 30;
    else if (session.status === 'in_progress') baseScore = 15;

    // Add points for time (suggesting treatment progress)
    const timeBonus = Math.min(daysSinceStart * 2, 40);

    return Math.min(baseScore + timeBonus, 100);
  }
}
