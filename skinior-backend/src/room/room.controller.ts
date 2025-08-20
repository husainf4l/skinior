import { 
  Body, 
  Controller, 
  Post, 
  Get, 
  Query, 
  Param, 
  Delete, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomDto, JoinRoomDto, LeaveRoomDto, RefreshTokenDto } from './dto/room.dto';
import { SaveVideoDto, GetVideoDto } from './dto/video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CombinedAuthGuard } from '../auth/guards/combined-auth.guard';

@ApiTags('LiveKit Rooms')
@Controller('rooms')
@UseGuards(CombinedAuthGuard)
@ApiBearerAuth()
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new LiveKit room for skin analysis',
    description: 'Creates a personalized room for skin consultation with user authentication'
  })
  @ApiResponse({
    status: 201,
    description: 'Room created successfully with user data and LiveKit token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - valid token required',
  })
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @Request() req: any
  ): Promise<{
    success: boolean;
    data: any;
    message: string;
    timestamp: string;
  }> {
    console.log('🎯 ROOM CONTROLLER: create room endpoint called');
    console.log('👤 Authenticated user:', req.user);
    console.log('📦 Request data:', JSON.stringify(createRoomDto, null, 2));
    
    const result = await this.roomService.createRoom(createRoomDto, req.user);
    
    return {
      success: true,
      data: result,
      message: 'Room created successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @ApiOperation({ 
    summary: 'List user rooms',
    description: 'Get all rooms created by the authenticated user'
  })
  @ApiResponse({
    status: 200,
    description: 'Rooms retrieved successfully',
  })
  async listRooms(@Request() req: any): Promise<{
    success: boolean;
    data: any;
    message: string;
    timestamp: string;
  }> {
    console.log('🎯 ROOM CONTROLLER: list rooms endpoint called');
    console.log('👤 Authenticated user:', req.user);
    
    const result = await this.roomService.listUserRooms(req.user.id);
    
    return {
      success: true,
      data: result,
      message: 'User rooms retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':roomName/status')
  @ApiOperation({ 
    summary: 'Get room status',
    description: 'Get status and details of a specific room'
  })
  @ApiParam({
    name: 'roomName',
    description: 'Name of the room',
    example: 'skin-analysis-session-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Room status retrieved successfully',
  })
  async getRoomStatus(
    @Param('roomName') roomName: string,
    @Request() req: any
  ): Promise<{
    success: boolean;
    data: any;
    message: string;
    timestamp: string;
  }> {
    console.log('🎯 ROOM CONTROLLER: get room status endpoint called');
    console.log('👤 Authenticated user:', req.user);
    console.log('🏠 Room name:', roomName);
    
    const result = await this.roomService.getRoomStatus(roomName, req.user.id);
    
    return {
      success: true,
      data: result,
      message: 'Room status retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('leave')
  @ApiOperation({ 
    summary: 'Leave a room',
    description: 'Leave a LiveKit room and clean up user session'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully left the room',
  })
  async leaveRoom(
    @Body() leaveRoomDto: LeaveRoomDto,
    @Request() req: any
  ): Promise<{
    success: boolean;
    data: any;
    message: string;
    timestamp: string;
  }> {
    console.log('🎯 ROOM CONTROLLER: leave room endpoint called');
    console.log('👤 Authenticated user:', req.user);
    console.log('📦 Request data:', JSON.stringify(leaveRoomDto, null, 2));
    
    const result = await this.roomService.leaveRoom(leaveRoomDto, req.user.id);
    
    return {
      success: true,
      data: result,
      message: 'Successfully left the room',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('refresh-token')
  @ApiOperation({ 
    summary: 'Refresh LiveKit token',
    description: 'Generate a new LiveKit token for continued room access'
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Request() req: any
  ): Promise<{
    success: boolean;
    data: any;
    message: string;
    timestamp: string;
  }> {
    console.log('🎯 ROOM CONTROLLER: refresh token endpoint called');
    console.log('👤 Authenticated user:', req.user);
    console.log('📦 Request data:', JSON.stringify(refreshTokenDto, null, 2));
    
    const result = await this.roomService.refreshToken(refreshTokenDto, req.user);
    
    return {
      success: true,
      data: result,
      message: 'Token refreshed successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':roomName')
  @ApiOperation({ 
    summary: 'Delete a room',
    description: 'Delete a LiveKit room (only by room creator)'
  })
  @ApiParam({
    name: 'roomName',
    description: 'Name of the room to delete',
    example: 'skin-analysis-session-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Room deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only delete own rooms',
  })
  async deleteRoom(
    @Param('roomName') roomName: string,
    @Request() req: any
  ): Promise<{
    success: boolean;
    data: any;
    message: string;
    timestamp: string;
  }> {
    console.log('🎯 ROOM CONTROLLER: delete room endpoint called');
    console.log('👤 Authenticated user:', req.user);
    console.log('📦 Room name:', roomName);
    
    const result = await this.roomService.deleteRoom(roomName, req.user.id);
    
    return {
      success: true,
      data: result,
      message: 'Room deleted successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':roomName/save-video')
  @ApiOperation({ 
    summary: 'Save video recording URL',
    description: 'Save the URL of a LiveKit room recording'
  })
  @ApiParam({
    name: 'roomName',
    description: 'Name of the room where video was recorded',
    example: 'skincare-John-1737427200-abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'Video URL saved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  async saveVideoUrl(
    @Param('roomName') roomName: string,
    @Body() saveVideoDto: SaveVideoDto,
    @Request() req: any
  ): Promise<{
    success: boolean;
    data: any;
    message: string;
    timestamp: string;
  }> {
    console.log('🎥 ROOM CONTROLLER: save video URL endpoint called');
    console.log('👤 Authenticated user:', req.user);
    console.log('🏠 Room name:', roomName);
    console.log('📹 Video data:', JSON.stringify(saveVideoDto, null, 2));
    
    const result = await this.roomService.saveVideoUrl(roomName, saveVideoDto, req.user.id);
    
    return {
      success: true,
      data: result,
      message: 'Video URL saved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':roomName/videos')
  @ApiOperation({ 
    summary: 'Get room video recordings',
    description: 'Get all video recordings for a specific room'
  })
  @ApiParam({
    name: 'roomName',
    description: 'Name of the room to get videos for',
    example: 'skincare-John-1737427200-abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'Videos retrieved successfully',
  })
  async getRoomVideos(
    @Param('roomName') roomName: string,
    @Request() req: any
  ): Promise<{
    success: boolean;
    data: any;
    message: string;
    timestamp: string;
  }> {
    console.log('🎥 ROOM CONTROLLER: get room videos endpoint called');
    console.log('👤 Authenticated user:', req.user);
    console.log('🏠 Room name:', roomName);
    
    const result = await this.roomService.getRoomVideos(roomName, req.user.id);
    
    return {
      success: true,
      data: result,
      message: 'Videos retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
