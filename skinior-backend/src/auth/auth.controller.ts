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
import { RegisterDto, LoginDto } from '../user/user.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {
    // Guard will redirect to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Response() res) {
    try {
      const authResponse = await this.authService.googleLogin(req.user);
      
      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      const redirectUrl = `${frontendUrl}/auth/callback?token=${authResponse.tokens.accessToken}&refreshToken=${authResponse.tokens.refreshToken}`;
      
      res.redirect(redirectUrl);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      res.redirect(`${frontendUrl}/auth/error`);
    }
  }

  @Post('google/token')
  async googleTokenAuth(@Body() body: { token: string }): Promise<AuthResponse> {
    if (!body.token) {
      throw new UnauthorizedException('Google token is required');
    }
    
    return this.authService.verifyGoogleToken(body.token);
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
  async logout(@Request() req) {
    await this.authService.logout(req.user.id);
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }
}
