import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AgentAuthService } from '../agent-auth.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly agentAuthService: AgentAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      return false;
    }

    try {
      const user = await this.agentAuthService.validateApiKey(apiKey);
      if (!user) {
        throw new UnauthorizedException('Invalid API key');
      }

      request.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }

  private extractApiKey(request: any): string | undefined {
    // Check for API key in headers
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('ApiKey ')) {
      return authHeader.substring(7);
    }

    // Check for API key in x-api-key header
    const apiKeyHeader = request.headers['x-api-key'];
    if (apiKeyHeader) {
      return apiKeyHeader;
    }

    // Check for API key in query parameter
    const apiKeyQuery = request.query['api_key'];
    if (apiKeyQuery) {
      return apiKeyQuery;
    }

    return undefined;
  }
}
