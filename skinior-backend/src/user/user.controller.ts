import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, UserResponseDto } from './user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return this.userService.findUserById(req.user.id);
  }

  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(req.user.id, updateUserDto);
  }
}
