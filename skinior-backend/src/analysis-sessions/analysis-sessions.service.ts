import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnalysisSessionDto } from './dto/create-analysis-session.dto';
import { UpdateAnalysisSessionDto } from './dto/update-analysis-session.dto';
import { AnalysisSessionResponseDto } from './dto/analysis-session-response.dto';

@Injectable()
export class AnalysisSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateAnalysisSessionDto): Promise<AnalysisSessionResponseDto> {
    try {
      // Check if session ID already exists
      const existingSession = await this.prisma.analysisSession.findUnique({
        where: { sessionId: createDto.sessionId },
      });

      if (existingSession) {
        throw new ConflictException(`Session with ID ${createDto.sessionId} already exists`);
      }

      const analysisSession = await this.prisma.analysisSession.create({
        data: {
          userId: createDto.userId,
          sessionId: createDto.sessionId,
          language: createDto.language || 'english',
          metadata: createDto.metadata || {},
        },
      });

      return this.mapToResponseDto(analysisSession);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create analysis session');
    }
  }

  async findBySessionId(sessionId: string): Promise<AnalysisSessionResponseDto> {
    const analysisSession = await this.prisma.analysisSession.findUnique({
      where: { sessionId },
      include: {
        analysisData: {
          orderBy: { timestamp: 'desc' },
          take: 5, // Include recent analysis data for context
        },
        productRecommendations: {
          orderBy: { createdAt: 'desc' },
          take: 10, // Include recent recommendations
        },
      },
    });

    if (!analysisSession) {
      throw new NotFoundException(`Analysis session with ID ${sessionId} not found`);
    }

    return this.mapToResponseDto(analysisSession);
  }

  async findByUserId(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<{
    sessions: AnalysisSessionResponseDto[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const [sessions, total] = await Promise.all([
      this.prisma.analysisSession.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.analysisSession.count({
        where: { userId },
      }),
    ]);

    return {
      sessions: sessions.map(session => this.mapToResponseDto(session)),
      total,
      limit,
      offset,
    };
  }

  async update(sessionId: string, updateDto: UpdateAnalysisSessionDto): Promise<AnalysisSessionResponseDto> {
    try {
      // Check if session exists
      const existingSession = await this.prisma.analysisSession.findUnique({
        where: { sessionId },
      });

      if (!existingSession) {
        throw new NotFoundException(`Analysis session with ID ${sessionId} not found`);
      }

      const updateData: any = {
        ...updateDto,
        updatedAt: new Date(),
      };

      // If status is being set to completed and completedAt is not provided, set it to now
      if (updateDto.status === 'completed' && !updateDto.completedAt) {
        updateData.completedAt = new Date();
      }

      // If completedAt is provided as string, convert to Date
      if (updateDto.completedAt) {
        updateData.completedAt = new Date(updateDto.completedAt);
      }

      const updatedSession = await this.prisma.analysisSession.update({
        where: { sessionId },
        data: updateData,
      });

      return this.mapToResponseDto(updatedSession);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update analysis session');
    }
  }

  async delete(sessionId: string): Promise<void> {
    try {
      const existingSession = await this.prisma.analysisSession.findUnique({
        where: { sessionId },
      });

      if (!existingSession) {
        throw new NotFoundException(`Analysis session with ID ${sessionId} not found`);
      }

      await this.prisma.analysisSession.delete({
        where: { sessionId },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete analysis session');
    }
  }

  async getSessionStats(userId: string): Promise<{
    totalSessions: number;
    completedSessions: number;
    inProgressSessions: number;
    cancelledSessions: number;
    firstSession?: Date;
    lastSession?: Date;
  }> {
    const [
      totalSessions,
      completedSessions,
      inProgressSessions,
      cancelledSessions,
      firstSession,
      lastSession,
    ] = await Promise.all([
      this.prisma.analysisSession.count({
        where: { userId },
      }),
      this.prisma.analysisSession.count({
        where: { userId, status: 'completed' },
      }),
      this.prisma.analysisSession.count({
        where: { userId, status: 'in_progress' },
      }),
      this.prisma.analysisSession.count({
        where: { userId, status: 'cancelled' },
      }),
      this.prisma.analysisSession.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      }),
      this.prisma.analysisSession.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    return {
      totalSessions,
      completedSessions,
      inProgressSessions,
      cancelledSessions,
      firstSession: firstSession?.createdAt,
      lastSession: lastSession?.createdAt,
    };
  }

  private mapToResponseDto(session: any): AnalysisSessionResponseDto {
    return {
      id: session.id,
      userId: session.userId,
      sessionId: session.sessionId,
      language: session.language,
      status: session.status,
      metadata: session.metadata,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      completedAt: session.completedAt,
    };
  }
}
