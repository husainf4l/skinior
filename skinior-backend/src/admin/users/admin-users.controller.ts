import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminGuard } from '../../dashboard/guards/admin.guard';
import { AdminOnly } from '../../dashboard/decorators/admin-only.decorator';
import { AdminUsersService } from './admin-users.service';
import { CreateUserDto, UpdateUserDto, UserFilterDto } from '../dto/user.dto';

@ApiTags('Admin - Users')
@Controller('admin/users')
@UseGuards(AdminGuard)
@AdminOnly()
@ApiBearerAuth()
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve all users with filtering and pagination',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or email' })
  @ApiQuery({ name: 'role', required: false, enum: ['customer', 'admin', 'agent'] })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'all'] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users retrieved successfully',
  })
  async getAllUsers(@Query() filters: UserFilterDto) {
    const result = await this.adminUsersService.getAllUsers(filters);
    return {
      success: true,
      data: result,
      message: 'Users retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve detailed user information',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User retrieved successfully',
  })
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.adminUsersService.getUserById(id);
    return {
      success: true,
      data: user,
      message: 'User retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Create new user',
    description: 'Create a new user account',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.adminUsersService.createUser(createUserDto);
    return {
      success: true,
      data: user,
      message: 'User created successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Update existing user information',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
  })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user = await this.adminUsersService.updateUser(id, updateUserDto);
    return {
      success: true,
      data: user,
      message: 'User updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete user account (soft delete)',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
  })
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    await this.adminUsersService.deleteUser(id);
    return {
      success: true,
      message: 'User deleted successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('analytics/overview')
  @ApiOperation({
    summary: 'Get users analytics',
    description: 'Get comprehensive analytics for users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analytics retrieved successfully',
  })
  async getUsersAnalytics() {
    const analytics = await this.adminUsersService.getUsersAnalytics();
    return {
      success: true,
      data: analytics,
      message: 'Analytics retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }
}