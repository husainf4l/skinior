import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto, LoginDto, UserResponseDto } from '../user/user.dto';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserResponseDto;
  tokens: AuthTokens;
}

@Injectable()
export class AuthService {
  private oauth2Client: OAuth2Client;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user = await this.userService.createUser(registerDto);
    const tokens = await this.generateTokens(user);
    
    // Save refresh token
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    
    return {
      user,
      tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;
    
    // Find user by email
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has a password (not OAuth only)
    if (!user.password) {
      throw new BadRequestException('Please login with Google or reset your password');
    }

    // Validate password
    const isPasswordValid = await this.userService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);
    
    // Save refresh token
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    
    // Format user response
    const userResponse = await this.userService.findUserById(user.id);
    
    return {
      user: userResponse,
      tokens,
    };
  }

  async googleLogin(user: any): Promise<AuthResponse> {
    // Generate tokens
    const tokens = await this.generateTokens(user);
    
    // Save refresh token
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    
    // Format user response
    const userResponse = await this.userService.findUserById(user.id);
    
    return {
      user: userResponse,
      tokens,
    };
  }

  async verifyGoogleToken(accessToken: string): Promise<AuthResponse> {
    try {
      // Verify the token with Google
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: accessToken, // Note: for access tokens, it's different, but assuming it's id token for simplicity
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }
      
      // Extract user info
      const googleId = payload.sub;
      const email = payload.email;
      const name = payload.name;
      const picture = payload.picture;
      
      // Find or create user
      let user = await this.userService.findUserByGoogleId(googleId);
      
      if (!user) {
        user = await this.userService.createGoogleUser({
          id: googleId,
          emails: [{ value: email }],
          displayName: name,
          photos: [{ value: picture }],
        });
      }
      
      if (!user) {
        throw new UnauthorizedException('Failed to create user');
      }
      
      // Generate tokens
      const tokens = await this.generateTokens(user);
      
      // Save refresh token
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
      
      // Format user response
      const userResponse = await this.userService.findUserById(user.id);
      
      return {
        user: userResponse,
        tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async verifyAppleToken(identityToken: string): Promise<AuthResponse> {
    try {
      // Decode the Apple identity token (it's a JWT)
      const decoded = jwt.decode(identityToken, { complete: true });
      
      if (!decoded || !decoded.payload) {
        throw new UnauthorizedException('Invalid Apple token');
      }
      
      const payload = decoded.payload as any;
      
      // Verify the token is from Apple (basic validation)
      if (payload.iss !== 'https://appleid.apple.com') {
        throw new UnauthorizedException('Invalid token issuer');
      }
      
      // Extract user info
      const appleId = payload.sub;
      const email = payload.email;
      const firstName = payload.given_name || '';
      const lastName = payload.family_name || '';
      
      // Find or create user
      let user = await this.userService.findUserByAppleId(appleId);
      
      if (!user) {
        user = await this.userService.createAppleUser({
          sub: appleId,
          email,
          given_name: firstName,
          family_name: lastName,
        });
      }
      
      if (!user) {
        throw new UnauthorizedException('Failed to create user');
      }
      
      // Generate tokens
      const tokens = await this.generateTokens(user);
      
      // Save refresh token
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
      
      // Format user response
      const userResponse = await this.userService.findUserById(user.id);
      
      return {
        user: userResponse,
        tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Apple token');
    }
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      });
      
      // Find user and verify refresh token
      const user = await this.userService.findUserByEmail(payload.email);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      // Generate new tokens
      const tokens = await this.generateTokens(user);
      
      // Update refresh token
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
      
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
  }

  private async generateTokens(user: any): Promise<AuthTokens> {
    const payload = { email: user.email, sub: user.id };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'fallback-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
