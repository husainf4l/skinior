import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiKeyAuthGuard } from './api-key-auth.guard';

@Injectable()
export class CombinedAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly apiKeyAuthGuard: ApiKeyAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }

    // Try JWT authentication first
    const jwtResult = await this.tryAuthentication(this.jwtAuthGuard, context);
    if (jwtResult) {
      return true;
    }

    // If JWT fails, try API key authentication
    const apiKeyResult = await this.tryAuthentication(this.apiKeyAuthGuard, context);
    if (apiKeyResult) {
      return true;
    }

    return false;
  }

  private async tryAuthentication(guard: CanActivate, context: ExecutionContext): Promise<boolean> {
    try {
      const result = await guard.canActivate(context);
      return typeof result === 'boolean' ? result : true;
    } catch (error) {
      return false;
    }
  }
}
