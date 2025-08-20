import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentUserDto, AgentTokenResponseDto, RefreshAgentTokenDto } from './dto/agent-auth.dto';
import * as crypto from 'crypto';

@Injectable()
export class AgentAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createAgentUser(createDto: CreateAgentUserDto): Promise<AgentTokenResponseDto> {
    try {
      // Check if agent user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createDto.email },
      });

      if (existingUser) {
        throw new ConflictException(`Agent user with email ${createDto.email} already exists`);
      }

      // Generate API key
      const apiKey = this.generateApiKey(createDto.name);

      // Set expiration date (default to 6 months from now)
      const expiresAt = createDto.expiresAt 
        ? new Date(createDto.expiresAt)
        : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // 6 months

      // Create agent user
      const agentUser = await this.prisma.user.create({
        data: {
          email: createDto.email,
          firstName: createDto.name,
          lastName: createDto.description || 'Agent System',
          role: 'agent',
          isSystem: true,
          isActive: true,
          apiKey,
          tokenExpiresAt: expiresAt
        },
      });

      // Generate long-term JWT token
      const payload = {
        sub: agentUser.id,
        email: agentUser.email,
        role: agentUser.role,
        isSystem: true,
        type: 'agent',
      };

      const token = this.jwtService.sign(payload, {
        expiresIn: '180d', // 6 months
      });

      return {
        id: agentUser.id,
        email: agentUser.email,
        role: agentUser.role,
        token,
        apiKey,
        expiresAt: agentUser.tokenExpiresAt!,
        createdAt: agentUser.createdAt,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create agent user');
    }
  }

  async refreshAgentToken(refreshDto: RefreshAgentTokenDto): Promise<AgentTokenResponseDto> {
    try {
      const agentUser = await this.prisma.user.findUnique({
        where: { 
          id: refreshDto.agentId,
          role: 'agent',
          isSystem: true,
        },
      });

      if (!agentUser) {
        throw new NotFoundException(`Agent user with ID ${refreshDto.agentId} not found`);
      }

      // Update expiration date if provided
      const expiresAt = refreshDto.expiresAt 
        ? new Date(refreshDto.expiresAt)
        : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // 6 months

      // Update user with new expiration
      const updatedUser = await this.prisma.user.update({
        where: { id: refreshDto.agentId },
        data: {
          tokenExpiresAt: expiresAt,
          updatedAt: new Date(),
        },
      });

      // Generate new JWT token
      const payload = {
        sub: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        isSystem: true,
        type: 'agent',
      };

      const token = this.jwtService.sign(payload, {
        expiresIn: '180d', // 6 months
      });

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        token,
        apiKey: updatedUser.apiKey!,
        expiresAt: updatedUser.tokenExpiresAt!,
        createdAt: updatedUser.createdAt,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to refresh agent token');
    }
  }

  async getAgentUsers(): Promise<Array<{
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    apiKey: string;
    expiresAt?: Date;
    createdAt: Date;
  }>> {
    const agents = await this.prisma.user.findMany({
      where: {
        role: 'agent',
        isSystem: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return agents.map(agent => ({
      id: agent.id,
      email: agent.email,
      name: agent.firstName || 'Unknown Agent',
      role: agent.role,
      isActive: agent.isActive,
      apiKey: agent.apiKey!,
      expiresAt: agent.tokenExpiresAt || undefined,
      createdAt: agent.createdAt,
    }));
  }

  async deactivateAgent(agentId: string): Promise<void> {
    try {
      const agentUser = await this.prisma.user.findUnique({
        where: { 
          id: agentId,
          role: 'agent',
          isSystem: true,
        },
      });

      if (!agentUser) {
        throw new NotFoundException(`Agent user with ID ${agentId} not found`);
      }

      await this.prisma.user.update({
        where: { id: agentId },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to deactivate agent');
    }
  }

  async validateAgentToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      
      if (payload.type !== 'agent' || !payload.isSystem) {
        return null;
      }

      const user = await this.prisma.user.findUnique({
        where: { 
          id: payload.sub,
          role: 'agent',
          isSystem: true,
          isActive: true,
        },
      });

      if (!user) {
        return null;
      }

      // Check if token has expired
      if (user.tokenExpiresAt && new Date() > user.tokenExpiresAt) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        isSystem: user.isSystem,
      };
    } catch (error) {
      return null;
    }
  }

  async validateApiKey(apiKey: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { 
          apiKey,
          role: 'agent',
          isSystem: true,
          isActive: true,
        },
      });

      if (!user) {
        return null;
      }

      // Check if token has expired
      if (user.tokenExpiresAt && new Date() > user.tokenExpiresAt) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        isSystem: user.isSystem,
      };
    } catch (error) {
      return null;
    }
  }

  private generateApiKey(agentName: string): string {
    const prefix = 'sk_';
    const agentId = agentName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomSuffix = crypto.randomBytes(16).toString('hex');
    return `${prefix}${agentId}_${randomSuffix}`;
  }
}
