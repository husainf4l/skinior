import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductRecommendationsDto } from './dto/create-product-recommendation.dto';
import { UpdateProductRecommendationDto } from './dto/update-product-recommendation.dto';
import { 
  ProductRecommendationResponseDto, 
  ProductRecommendationsListResponseDto, 
  RecommendationAnalyticsResponseDto 
} from './dto/product-recommendation-response.dto';

@Injectable()
export class ProductRecommendationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateProductRecommendationsDto): Promise<{
    createdCount: number;
    recommendations: ProductRecommendationResponseDto[];
  }> {
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

      // Create all recommendations in a transaction
      const createdRecommendations = await this.prisma.$transaction(
        createDto.recommendations.map(recommendation =>
          this.prisma.productRecommendation.create({
            data: {
              userId: createDto.userId,
              analysisId: createDto.analysisId,
              productId: recommendation.productId,
              productName: recommendation.productName,
              brand: recommendation.brand,
              category: recommendation.category,
              ingredients: recommendation.ingredients || [],
              price: recommendation.price,
              currency: recommendation.currency || 'USD',
              rating: recommendation.rating,
              reviewCount: recommendation.reviewCount || 0,
              reason: recommendation.reason,
              usageInstructions: recommendation.usageInstructions,
              priority: recommendation.priority || 'medium',
              availability: recommendation.availability ?? true,
              skiniorUrl: recommendation.skiniorUrl,
            },
          })
        )
      );

      return {
        createdCount: createdRecommendations.length,
        recommendations: createdRecommendations.map(rec => this.mapToResponseDto(rec)),
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create product recommendations');
    }
  }

  async findById(id: string): Promise<ProductRecommendationResponseDto> {
    const recommendation = await this.prisma.productRecommendation.findUnique({
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

    if (!recommendation) {
      throw new NotFoundException(`Product recommendation with ID ${id} not found`);
    }

    return this.mapToResponseDto(recommendation);
  }

  async findByUserId(
    userId: string,
    limit: number = 10,
    offset: number = 0,
    status?: string,
    priority?: string,
  ): Promise<ProductRecommendationsListResponseDto> {
    const whereClause: any = { userId };
    
    if (status) {
      whereClause.status = status;
    }
    
    if (priority) {
      whereClause.priority = priority;
    }

    const [recommendations, total] = await Promise.all([
      this.prisma.productRecommendation.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
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
      this.prisma.productRecommendation.count({
        where: whereClause,
      }),
    ]);

    return {
      recommendations: recommendations.map(rec => this.mapToResponseDto(rec)),
      total,
      limit,
      offset,
    };
  }

  async findByAnalysisId(analysisId: string): Promise<ProductRecommendationResponseDto[]> {
    const recommendations = await this.prisma.productRecommendation.findMany({
      where: { analysisId },
      orderBy: [
        { priority: 'desc' }, // High priority first
        { createdAt: 'desc' },
      ],
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

    return recommendations.map(rec => this.mapToResponseDto(rec));
  }

  async update(id: string, updateDto: UpdateProductRecommendationDto): Promise<ProductRecommendationResponseDto> {
    try {
      const existingRecommendation = await this.prisma.productRecommendation.findUnique({
        where: { id },
      });

      if (!existingRecommendation) {
        throw new NotFoundException(`Product recommendation with ID ${id} not found`);
      }

      const updatedRecommendation = await this.prisma.productRecommendation.update({
        where: { id },
        data: {
          ...updateDto,
          updatedAt: new Date(),
        },
      });

      return this.mapToResponseDto(updatedRecommendation);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update product recommendation');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const existingRecommendation = await this.prisma.productRecommendation.findUnique({
        where: { id },
      });

      if (!existingRecommendation) {
        throw new NotFoundException(`Product recommendation with ID ${id} not found`);
      }

      await this.prisma.productRecommendation.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete product recommendation');
    }
  }

  async getRecommendationAnalytics(userId: string): Promise<RecommendationAnalyticsResponseDto> {
    try {
      const [
        totalRecommendations,
        purchasedCount,
        triedCount,
        notInterestedCount,
        wishlistCount,
        categoryStats,
        brandStats,
        avgRating,
      ] = await Promise.all([
        this.prisma.productRecommendation.count({
          where: { userId },
        }),
        this.prisma.productRecommendation.count({
          where: { userId, status: 'purchased' },
        }),
        this.prisma.productRecommendation.count({
          where: { userId, status: 'tried' },
        }),
        this.prisma.productRecommendation.count({
          where: { userId, status: 'not_interested' },
        }),
        this.prisma.productRecommendation.count({
          where: { userId, status: 'wishlist' },
        }),
        this.prisma.productRecommendation.groupBy({
          by: ['category'],
          where: { userId, category: { not: null } },
          _count: { category: true },
          orderBy: { _count: { category: 'desc' } },
          take: 10,
        }),
        this.prisma.productRecommendation.groupBy({
          by: ['brand'],
          where: { userId, brand: { not: null } },
          _count: { brand: true },
          orderBy: { _count: { brand: 'desc' } },
          take: 10,
        }),
        this.prisma.productRecommendation.aggregate({
          where: { userId, rating: { not: null } },
          _avg: { rating: true },
        }),
      ]);

      const purchaseRate = totalRecommendations > 0 ? purchasedCount / totalRecommendations : 0;
      const trialRate = totalRecommendations > 0 ? triedCount / totalRecommendations : 0;

      const topCategories = categoryStats.map(stat => ({
        category: stat.category!,
        count: stat._count.category,
      }));

      const topBrands = brandStats.map(stat => ({
        brand: stat.brand!,
        count: stat._count.brand,
      }));

      return {
        userId,
        totalRecommendations,
        purchasedCount,
        triedCount,
        notInterestedCount,
        wishlistCount,
        purchaseRate: Math.round(purchaseRate * 100) / 100,
        trialRate: Math.round(trialRate * 100) / 100,
        topCategories,
        topBrands,
        averageRating: Math.round((avgRating._avg.rating || 0) * 100) / 100,
      };
    } catch (error) {
      throw new BadRequestException('Failed to generate recommendation analytics');
    }
  }

  async getRecommendationsByProduct(productId: string): Promise<{
    recommendations: ProductRecommendationResponseDto[];
    totalUsers: number;
    averageRating: number;
    statusBreakdown: Record<string, number>;
  }> {
    const recommendations = await this.prisma.productRecommendation.findMany({
      where: { productId },
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

    const totalUsers = new Set(recommendations.map(r => r.userId)).size;
    
    const ratingsSum = recommendations
      .filter(r => r.rating !== null)
      .reduce((sum, r) => sum + (r.rating || 0), 0);
    
    const ratingsCount = recommendations.filter(r => r.rating !== null).length;
    const averageRating = ratingsCount > 0 ? ratingsSum / ratingsCount : 0;

    const statusBreakdown = recommendations.reduce((acc, rec) => {
      acc[rec.status] = (acc[rec.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      recommendations: recommendations.map(rec => this.mapToResponseDto(rec)),
      totalUsers,
      averageRating: Math.round(averageRating * 100) / 100,
      statusBreakdown,
    };
  }

  private mapToResponseDto(recommendation: any): ProductRecommendationResponseDto {
    return {
      id: recommendation.id,
      userId: recommendation.userId,
      analysisId: recommendation.analysisId,
      productId: recommendation.productId,
      productName: recommendation.productName,
      brand: recommendation.brand,
      category: recommendation.category,
      ingredients: recommendation.ingredients,
      price: recommendation.price,
      currency: recommendation.currency,
      rating: recommendation.rating,
      reviewCount: recommendation.reviewCount,
      reason: recommendation.reason,
      usageInstructions: recommendation.usageInstructions,
      priority: recommendation.priority,
      availability: recommendation.availability,
      skiniorUrl: recommendation.skiniorUrl,
      status: recommendation.status,
      userNotes: recommendation.userNotes,
      createdAt: recommendation.createdAt,
      updatedAt: recommendation.updatedAt,
    };
  }
}
