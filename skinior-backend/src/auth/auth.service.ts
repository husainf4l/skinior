import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  RegisterDto,
  LoginDto,
  UserResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../user/user.dto';
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

interface JwtPayload {
  iss?: string;
  sub?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  [key: string]: any;
}

interface GoogleUser {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  [key: string]: any;
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
      throw new BadRequestException(
        'Please login with Google or reset your password',
      );
    }

    // Validate password
    const isPasswordValid = await this.userService.validatePassword(
      password,
      user.password,
    );
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

  async googleLogin(user: GoogleUser): Promise<AuthResponse> {
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

  async verifyGoogleToken(
    accessToken: string,
    platform?: 'web' | 'ios',
  ): Promise<AuthResponse> {
    try {
      // Determine which client ID to use based on platform
      const audience =
        platform === 'ios'
          ? process.env.GOOGLE_IOS_CLIENT_ID
          : process.env.GOOGLE_CLIENT_ID;

      // Try to verify with the specified audience first
      let ticket;
      try {
        ticket = await this.oauth2Client.verifyIdToken({
          idToken: accessToken,
          audience: audience,
        });
      } catch (error) {
        // If verification fails and no platform specified, try the other client ID
        if (!platform) {
          const fallbackAudience =
            audience === process.env.GOOGLE_CLIENT_ID
              ? process.env.GOOGLE_IOS_CLIENT_ID
              : process.env.GOOGLE_CLIENT_ID;

          ticket = await this.oauth2Client.verifyIdToken({
            idToken: accessToken,
            audience: fallbackAudience,
          });
        } else {
          throw error;
        }
      }

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      // Extract user info
      const googleId = payload.sub;
      const email = payload.email;
      const name = payload.name;
      const picture = payload.picture;

      if (!googleId || !email) {
        throw new UnauthorizedException('Invalid Google token payload');
      }

      // Find or create user
      let user = await this.userService.findUserByGoogleId(googleId);

      if (!user) {
        user = await this.userService.createGoogleUser({
          id: googleId,
          emails: [{ value: email }],
          name: name,
          photos: [{ value: picture }],
        });
      }

      if (!user || typeof user !== 'object') {
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
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  // Mobile Google Authentication

  async verifyAppleToken(identityToken: string): Promise<AuthResponse> {
    try {
      // Decode the Apple identity token (it's a JWT)
      const decoded = jwt.decode(identityToken, { complete: true });

      if (!decoded || !decoded.payload) {
        throw new UnauthorizedException('Invalid Apple token');
      }

      const payload = decoded.payload as JwtPayload;

      // Verify the token is from Apple (basic validation)
      if (payload.iss !== 'https://appleid.apple.com') {
        throw new UnauthorizedException('Invalid token issuer');
      }

      // Extract user info
      const appleId = payload.sub;
      const email = payload.email;

      if (!appleId || !email) {
        throw new UnauthorizedException('Invalid token payload');
      }

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

      if (!user || typeof user !== 'object') {
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
    } catch {
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
      if (
        !user ||
        typeof user !== 'object' ||
        user.refreshToken !== refreshToken
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Update refresh token
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    try {
      const resetToken = await this.userService.createPasswordResetToken(email);

      // In a real application, you would send an email here
      // For now, we'll just return the token for testing purposes
      console.log(`Password reset token for ${email}: ${resetToken}`);

      return {
        message:
          'If an account with that email exists, a password reset link has been sent.',
      };
    } catch {
      // Don't reveal if email exists or not for security
      return {
        message:
          'If an account with that email exists, a password reset link has been sent.',
      };
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    await this.userService.resetPassword(token, newPassword);

    return {
      message: 'Password has been reset successfully.',
    };
  }

  // Mobile Google Authentication
  async googleMobileAuth(googleMobileAuthDto: any): Promise<any> {
    try {
      const { idToken } = googleMobileAuthDto;

      // Verify the token with both web and iOS client IDs
      const clientIds = [
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_IOS_CLIENT_ID,
      ].filter(Boolean);

      let ticket: any = null;

      // Try to verify with each client ID
      for (const clientId of clientIds) {
        try {
          ticket = await this.oauth2Client.verifyIdToken({
            idToken,
            audience: clientId,
          });
          break;
        } catch {
          // Try next client ID
          continue;
        }
      }

      if (!ticket) {
        throw new UnauthorizedException('Invalid Google ID token');
      }

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token payload');
      }

      // Extract user info
      const googleId = payload.sub;
      const email = payload.email;
      const name = payload.name;
      const picture = payload.picture;

      if (!googleId || !email) {
        throw new UnauthorizedException('Missing required user data');
      }

      // Find or create user
      let user = await this.userService.findUserByGoogleId(googleId);

      if (!user) {
        user = await this.userService.createGoogleUser({
          id: googleId,
          emails: [{ value: email }],
          name: name,
          photos: [{ value: picture }],
        });
      }

      if (!user || typeof user !== 'object') {
        throw new UnauthorizedException('Failed to create user');
      }

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Save refresh token
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

      // Format user response
      const userResponse = await this.userService.findUserById(user.id);

      return {
        success: true,
        token: tokens.accessToken,
        user: userResponse,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Invalid ID token',
        error: 'INVALID_TOKEN',
      };
    }
  }

  // Mobile Apple Authentication
  async appleMobileAuth(appleMobileAuthDto: any): Promise<any> {
    try {
      const { identityToken, authorizationCode, user: userInfo, email, firstName, lastName } = appleMobileAuthDto;

      // For now, we'll implement a basic version
      // In production, you should verify the identityToken with Apple's public keys

      // Decode the token to get user info (without verification for demo)
      const tokenParts = identityToken.split('.');
      if (tokenParts.length !== 3) {
        throw new UnauthorizedException('Invalid Apple identity token format');
      }

      const payload = JSON.parse(
        Buffer.from(tokenParts[1], 'base64').toString(),
      );

      const appleId = payload.sub;

      // Handle both data formats - nested user object or flat structure
      let userEmail, userFirstName, userLastName;

      if (userInfo) {
        // Nested format: { user: { email, name: { firstName, lastName } } }
        userEmail = payload.email || userInfo.email;
        userFirstName = userInfo.name?.firstName;
        userLastName = userInfo.name?.lastName;
      } else {
        // Flat format: { email, firstName, lastName }
        userEmail = payload.email || email;
        userFirstName = firstName;
        userLastName = lastName;
      }

      if (!appleId) {
        throw new UnauthorizedException('Missing Apple user ID');
      }

      // Find or create user
      let user = await this.userService.findUserByAppleId(appleId);

      if (!user && (userFirstName || userLastName || userEmail)) {
        // Create user only on first sign-in when user info is provided
        user = await this.userService.createAppleUser({
          id: appleId,
          email: userEmail,
          firstName: userFirstName,
          lastName: userLastName,
        });
      } else if (!user) {
        throw new UnauthorizedException(
          'User not found and no user info provided',
        );
      }

      if (!user || typeof user !== 'object') {
        throw new UnauthorizedException('Failed to create or find user');
      }

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Save refresh token
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

      // Format user response
      const userResponse = await this.userService.findUserById(user.id);

      return {
        success: true,
        message: 'Apple Sign-In successful',
        user: userResponse,
        tokens,
      };
    } catch (error) {
      console.error('Apple Mobile Auth Error:', error);
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Apple Sign-In failed',
      );
    }
  }

  private async generateTokens(user: GoogleUser | any): Promise<AuthTokens> {
    if (!user || typeof user !== 'object') {
      throw new UnauthorizedException('Invalid user');
    }

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
