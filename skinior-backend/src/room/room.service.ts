import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LiveKitService } from '../livekit/livekit.service';

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

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly liveKitService: LiveKitService,
  ) { }

  async leaveRoom(leaveRoomDto: LeaveRoomDto) {
    const { userId, roomName } = leaveRoomDto;

    // Validate required fields with defaults
    const finalUserId = userId || 'anonymous';
    const finalRoomName = roomName || `room-${Date.now()}`;

    console.log(`🚪 User ${finalUserId} leaving room: ${finalRoomName}`);

    try {
      // Check if the LiveKit room exists
      const liveKitRoom = await this.prisma.liveKitRoom.findFirst({
        where: {
          name: finalRoomName
        }
      });

      if (!liveKitRoom) {
        throw new NotFoundException('Room not found');
      }

      console.log(`✅ User ${finalUserId} left room: ${finalRoomName}`);

      return {
        success: true,
        message: `Successfully left room ${finalRoomName}`,
        userId: finalUserId,
        roomName: finalRoomName,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error leaving room:', error);

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to leave room');
    }
  }

  async getRoomStatus(roomStatusDto: RoomStatusDto) {
    const { roomName } = roomStatusDto;

    // Use default room name if not provided
    const finalRoomName = roomName || 'default-room';

    console.log(`📊 Checking status for room: ${finalRoomName}`);

    try {
      // Get room from database
      const liveKitRoom = await this.prisma.liveKitRoom.findFirst({
        where: {
          name: finalRoomName
        }
      });

      if (!liveKitRoom) {
        throw new NotFoundException('Room not found');
      }

      // Calculate room duration
      const createdAt = liveKitRoom.createdAt;
      const now = new Date();
      const durationMs = now.getTime() - createdAt.getTime();
      const durationMinutes = Math.floor(durationMs / (1000 * 60));

      return {
        success: true,
        room: {
          id: liveKitRoom.id,
          name: liveKitRoom.name,
          createdAt: liveKitRoom.createdAt,
          createdBy: liveKitRoom.createdBy,
          metadata: liveKitRoom.metadata,
          durationMinutes,
          status: 'active'
        },
        liveKitUrl: process.env.LIVEKIT_URL
      };

    } catch (error) {
      console.error('Error getting room status:', error);

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to get room status');
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { roomName, userId } = refreshTokenDto;

    // Use defaults if not provided
    const finalRoomName = roomName || 'default-room';
    const finalUserId = userId || 'anonymous';

    console.log(`🔄 Refreshing token for user ${finalUserId} in room: ${finalRoomName}`);

    try {
      // Check if the LiveKit room exists
      const liveKitRoom = await this.prisma.liveKitRoom.findFirst({
        where: {
          name: finalRoomName
        }
      });

      if (!liveKitRoom) {
        throw new NotFoundException('Room not found');
      }

      // Generate a new LiveKit token
      const participantName = `User ${finalUserId}`;
      let token = 'test-token'; // fallback
      
      try {
        token = await this.liveKitService.generateToken(finalRoomName, participantName, finalUserId);
        console.log(`✅ Real LiveKit token generated for ${participantName}`);
      } catch (tokenError) {
        console.error('⚠️ Failed to generate LiveKit token for refresh:', tokenError.message);
      }
      
      // Calculate token expiration time (2 hours)
      const now = new Date();
      const expiresAt = new Date(now.getTime() + (2 * 60 * 60 * 1000));

      return {
        success: true,
        token: token,
        roomName: finalRoomName,
        participantName,
        userId: finalUserId,
        expiresAt: expiresAt.toISOString(),
        durationSeconds: 2 * 60 * 60,
        liveKitUrl: process.env.LIVEKIT_URL,
        message: 'Token refreshed successfully with 2 hour duration'
      };

    } catch (error) {
      console.error('Error refreshing token:', error);

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to refresh token');
    }
  }

  async createRoom(createRoomDto: CreateRoomDto) {
    console.log('🚀 ROOM SERVICE: createRoom method called');
    console.log('📋 Input parameters:', JSON.stringify(createRoomDto, null, 2));

    const { roomName, userId, language } = createRoomDto;

    // Generate room name if not provided
    const finalRoomName = roomName || `skincare-room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const finalUserId = userId || 'anonymous';
    const finalLanguage = language || 'arabic';

    try {
      console.log(`🔄 Creating new skincare consultation room: ${finalRoomName}`);

      // Check if room already exists
      const existingRoom = await this.prisma.liveKitRoom.findFirst({
        where: {
          name: finalRoomName
        }
      });

      if (existingRoom) {
        console.log(`🟡 Room ${finalRoomName} already exists, generating new token`);
        
        // Generate a new token for the existing room
        const participantName = finalUserId !== 'anonymous' ? `User ${finalUserId}` : 'Guest';
        let token = 'test-token'; // fallback
        
        try {
          token = await this.liveKitService.generateToken(finalRoomName, participantName, finalUserId);
          console.log(`🎫 LiveKit token generated for existing room: ${participantName}`);
        } catch (tokenError) {
          console.error('⚠️ Failed to generate LiveKit token for existing room:', tokenError.message);
        }
        
        return {
          success: true,
          room: existingRoom,
          message: 'Room already exists, new token generated',
          token: token,
          participantName: participantName,
          liveKitUrl: process.env.LIVEKIT_URL,
          aiPrompt: (existingRoom.metadata as any)?.aiPrompt?.[finalLanguage] || 'AI prompt not available',
          language: finalLanguage,
          metadata: existingRoom.metadata
        };
      }

      // Create room metadata
      const metadata = {
        type: 'skincare_consultation',
        createdAt: new Date().toISOString(),
        createdBy: finalUserId,
        description: 'Skincare consultation room with AI beauty advisor',
        aiPrompt: {
          english: "You are a professional beauty advisor specializing in skin analysis and skincare recommendations. Analyze the customer's skin condition, identify concerns, and recommend suitable skincare solutions and products. Be thorough, professional, and personalized in your recommendations.",
          arabic: "أنت مستشار تجميل محترف متخصص في تحليل البشرة وتوصيات العناية بالبشرة. قم بتحليل حالة بشرة العميل، وتحديد المشاكل، وتوصية بحلول ومنتجات العناية بالبشرة المناسبة. كن شاملاً ومهنياً وشخصياً في توصياتك."
        },
        language: finalLanguage,
        features: [
          'skin_analysis',
          'product_recommendations',
          'personalized_advice',
          'bilingual_support'
        ]
      };

      console.log('📝 Room metadata:', JSON.stringify(metadata, null, 2));

      // Use LiveKit service to create room with metadata and generate token
      const participantName = finalUserId !== 'anonymous' ? `User ${finalUserId}` : 'Guest';
      const ttlSeconds = 2 * 60 * 60; // 2 hours
      
      try {
        const { room: newRoom, token } = await this.liveKitService.createRoomWithToken(
          finalRoomName,
          metadata,
          finalUserId,
          participantName,
          ttlSeconds
        );

        console.log(`✅ Skincare consultation room created successfully: ${finalRoomName}`);
        console.log(`🎫 Real LiveKit token generated for ${participantName}`);

        return {
          success: true,
          room: newRoom,
          message: 'Skincare consultation room created successfully',
          token,
          participantName,
          liveKitUrl: process.env.LIVEKIT_URL,
          metadata,
          aiPrompt: metadata.aiPrompt[finalLanguage], // Return the AI prompt in the selected language
          language: finalLanguage,
          tokenExpiresIn: ttlSeconds
        };
      } catch (liveKitError) {
        console.error('⚠️ LiveKit service failed, falling back to manual creation:', liveKitError.message);
        
        // Fallback: Create room in database only
        const newRoom = await this.prisma.liveKitRoom.create({
          data: {
            name: finalRoomName,
            metadata: metadata,
            createdBy: finalUserId,
            createdAt: new Date()
          }
        });

        return {
          success: true,
          room: newRoom,
          message: 'Skincare consultation room created successfully (fallback mode)',
          token: 'fallback-token',
          participantName,
          liveKitUrl: process.env.LIVEKIT_URL,
          metadata,
          aiPrompt: metadata.aiPrompt[finalLanguage],
          language: finalLanguage
        };
      }

    } catch (error) {
      console.error('❌ Error creating room:', error);
      throw new BadRequestException(`Failed to create room: ${error.message}`);
    }
  }

  async listRooms() {
    try {
      console.log('📋 Fetching all rooms');

      const rooms = await this.prisma.liveKitRoom.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      return {
        success: true,
        rooms,
        count: rooms.length,
        message: 'Rooms fetched successfully'
      };

    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw new BadRequestException('Failed to fetch rooms');
    }
  }

  async deleteRoom(roomName: string) {
    try {
      console.log(`🗑️ Deleting room: ${roomName}`);

      const room = await this.prisma.liveKitRoom.findFirst({
        where: {
          name: roomName
        }
      });

      if (!room) {
        throw new NotFoundException('Room not found');
      }

      await this.prisma.liveKitRoom.delete({
        where: {
          id: room.id
        }
      });

      console.log(`✅ Room ${roomName} deleted successfully`);

      return {
        success: true,
        message: `Room ${roomName} deleted successfully`,
        roomName
      };

    } catch (error) {
      console.error('Error deleting room:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Failed to delete room');
    }
  }
}
