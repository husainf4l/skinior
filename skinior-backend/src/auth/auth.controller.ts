import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Response,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService, AuthResponse } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  GoogleMobileAuthDto,
  AppleMobileAuthDto,
} from '../user/user.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user?: {
    id: string;
    email: string;
    [key: string]: any;
  };
}

interface AuthenticatedResponse {
  redirect: (url: string) => void;
  [key: string]: any;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Guard will redirect to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Request() req: AuthenticatedRequest,
    @Response() res: AuthenticatedResponse,
  ) {
    try {
      if (!req.user) {
        throw new UnauthorizedException('No user data from Google');
      }
      const authResponse = await this.authService.googleLogin(req.user);

      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      const redirectUrl = `${frontendUrl}/auth/callback?token=${authResponse.tokens.accessToken}&refreshToken=${authResponse.tokens.refreshToken}`;

      res.redirect(redirectUrl);
    } catch {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      res.redirect(`${frontendUrl}/auth/error`);
    }
  }

  @Post('google/mobile')
  async googleMobileAuth(
    @Body(ValidationPipe) googleMobileAuthDto: GoogleMobileAuthDto,
  ) {
    return this.authService.googleMobileAuth(googleMobileAuthDto);
  }

  @Post('apple/mobile')
  async appleMobileAuth(
    @Body(ValidationPipe) appleMobileAuthDto: AppleMobileAuthDto,
  ) {
    return this.authService.appleMobileAuth(appleMobileAuthDto);
  }

  @Post('google/token')
  async googleTokenAuth(
    @Body() body: { token: string },
  ): Promise<AuthResponse> {
    if (!body.token) {
      throw new UnauthorizedException('Google token is required');
    }

    return this.authService.verifyGoogleToken(body.token, 'web');
  }

  @Post('google/ios/token')
  async googleIOSTokenAuth(
    @Body() body: { token: string },
  ): Promise<AuthResponse> {
    if (!body.token) {
      throw new UnauthorizedException('Google token is required');
    }

    return this.authService.verifyGoogleToken(body.token, 'ios');
  }

  // Test endpoint for mobile Google token verification
  @Post('google/token/test')
  async testGoogleToken(
    @Body() body: { token: string; platform?: 'web' | 'ios' },
  ) {
    if (!body.token) {
      return { error: 'Google token is required' };
    }

    try {
      const result = await this.authService.verifyGoogleToken(
        body.token,
        body.platform,
      );
      return {
        success: true,
        message: 'Google token verification successful',
        platform: body.platform || 'auto-detected',
        user: result.user,
        hasTokens: !!result.tokens,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Google token verification failed',
        platform: body.platform || 'auto-detected',
      };
    }
  }

  @Post('apple/token')
  async appleTokenAuth(@Body() body: { token: string }): Promise<AuthResponse> {
    if (!body.token) {
      throw new UnauthorizedException('Apple token is required');
    }

    return this.authService.verifyAppleToken(body.token);
  }

  @Post('refresh')
  async refreshTokens(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    return this.authService.refreshTokens(body.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: AuthenticatedRequest) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    await this.authService.logout(req.user.id);
    return { message: 'Logged out successfully' };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await Promise.resolve(req.user);
  }
}
