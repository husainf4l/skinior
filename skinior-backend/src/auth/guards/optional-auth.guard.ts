import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Always return true - this guard doesn't block access
    // It just populates user if a valid token exists
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Don't throw error if no user, just return null
    // This allows endpoints to work for both authenticated and anonymous users
    return user || null;
  }
}
