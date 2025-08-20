import { Controller, Post, Body, UseGuards, Request, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      message: 'User registered successfully',
      data: result,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Login successful',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return {
      message: 'Token is valid',
      data: {
        user: req.user,
        tokenValid: true,
        timestamp: new Date().toISOString()
      }
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    // Generate a new token for the current user
    const result = await this.authService.generateNewToken(req.user);
    
    return {
      message: 'Token refreshed successfully',
      data: result,
    };
  }
}
