import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AgentAuthService } from './agent-auth.service';
import { AgentAuthController } from './agent-auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiKeyAuthGuard } from './guards/api-key-auth.guard';
import { CombinedAuthGuard } from './guards/combined-auth.guard';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController, AgentAuthController],
  providers: [
    AuthService,
    AgentAuthService,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    ApiKeyAuthGuard,
    CombinedAuthGuard,
  ],
  exports: [
    AuthService,
    AgentAuthService,
    JwtAuthGuard,
    ApiKeyAuthGuard,
    CombinedAuthGuard,
  ],
})
export class AuthModule {}
