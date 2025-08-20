import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  oldPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateUser(req.user.id, updateProfileDto);
  }

  @Put('change-password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(
      req.user.id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
}
