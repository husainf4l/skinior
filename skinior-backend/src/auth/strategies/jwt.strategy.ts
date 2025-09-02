import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret-key',
    });
  }

  async validate(payload: any) {
    const userId = payload?.sub;
    const userEmail = payload?.email;

    if (!userId || typeof userId !== 'string') {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findUserById(userId);
    if (!user || typeof user !== 'object') {
      throw new UnauthorizedException();
    }

    // Update last active
    await this.userService.updateLastActive();

    return { id: userId, email: userEmail || '' };
  }
}
