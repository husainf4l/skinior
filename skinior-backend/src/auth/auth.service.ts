import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.createUser({
      email: registerDto.email,
      password: registerDto.password,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phone: registerDto.phone,
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      user,
      accessToken,
      expiresIn: '24h',
      tokenType: 'Bearer',
      issuedAt: new Date().toISOString()
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      return null;
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      user,
      accessToken,
      expiresIn: '24h',
      tokenType: 'Bearer',
      issuedAt: new Date().toISOString()
    };
  }

  async validateUser(email: string, password: string) {
    return this.usersService.validateUser(email, password);
  }

  async findUserById(id: string) {
    return this.usersService.findById(id);
  }

  async generateNewToken(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      user,
      accessToken,
      expiresIn: '24h', // Token expiration info
      tokenType: 'Bearer',
      issuedAt: new Date().toISOString()
    };
  }
}
