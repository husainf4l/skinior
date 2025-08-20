import { Body, Controller, Post, Get, Query, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';

interface LeaveRoomDto {
  userId?: string;
  roomName?: string;
}

interface RoomStatusDto {
  roomName?: string;
}

interface RefreshTokenDto {
  roomName?: string;
  userId?: string;
}

interface CreateRoomDto {
  roomName?: string;
  userId?: string;
  language?: 'english' | 'arabic';
}

@Controller('rooms')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
  ) {}

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    console.log('🎯 ROOM CONTROLLER: create room endpoint called');
    console.log('📦 Request data:', JSON.stringify(createRoomDto, null, 2));
    
    const result = await this.roomService.createRoom(createRoomDto);
    
    console.log('🎯 ROOM CONTROLLER: Response from service');
    
    return result;
  }

  @Get()
  async listRooms() {
    console.log('🎯 ROOM CONTROLLER: list rooms endpoint called');
    return this.roomService.listRooms();
  }

  @Get('status')
  async getRoomStatus(@Query() roomStatusDto: RoomStatusDto) {
    console.log('🎯 ROOM CONTROLLER: get room status endpoint called');
    console.log('📦 Query data:', JSON.stringify(roomStatusDto, null, 2));
    
    return this.roomService.getRoomStatus(roomStatusDto);
  }

  @Post('leave')
  async leaveRoom(@Body() leaveRoomDto: LeaveRoomDto) {
    console.log('🎯 ROOM CONTROLLER: leave room endpoint called');
    console.log('📦 Request data:', JSON.stringify(leaveRoomDto, null, 2));
    
    return this.roomService.leaveRoom(leaveRoomDto);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    console.log('🎯 ROOM CONTROLLER: refresh token endpoint called');
    console.log('📦 Request data:', JSON.stringify(refreshTokenDto, null, 2));
    
    return this.roomService.refreshToken(refreshTokenDto);
  }

  @Delete(':roomName')
  async deleteRoom(@Param('roomName') roomName: string) {
    console.log('🎯 ROOM CONTROLLER: delete room endpoint called');
    console.log('📦 Room name:', roomName);
    
    return this.roomService.deleteRoom(roomName);
  }
}
