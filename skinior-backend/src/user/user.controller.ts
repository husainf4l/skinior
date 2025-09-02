import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, UserResponseDto, DeleteAccountDto } from './user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req: any): Promise<UserResponseDto> {
    const userId = req.user?.id;
    if (!userId || typeof userId !== 'string') {
      throw new Error('User not authenticated');
    }
    return this.userService.findUserById(userId);
  }

  @Put('profile')
  async updateProfile(
    @Request() req: any,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const userId = req.user?.id;
    if (!userId || typeof userId !== 'string') {
      throw new Error('User not authenticated');
    }
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete('account')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(
    @Request() req: any,
    @Body(ValidationPipe) deleteAccountDto: DeleteAccountDto,
  ): Promise<{ success: boolean; message: string }> {
    const userId = req.user?.id;
    if (!userId || typeof userId !== 'string') {
      throw new Error('User not authenticated');
    }
    return this.userService.deleteAccount(userId, deleteAccountDto);
  }
}
