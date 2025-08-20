import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LiveKitService } from '../livekit/livekit.service';
import { CreateRoomDto, JoinRoomDto, LeaveRoomDto, RefreshTokenDto } from './dto/room.dto';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  isSystem?: boolean;
}

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly liveKitService: LiveKitService,
  ) { }

  private getSessionTypePrompts(sessionType: string, displayName: string) {
    const basePersonalization = `You are consulting with ${displayName}, a valued client.`;
    const basePersonalizationAr = `تستشير مع ${displayName}، عميل قيم.`;

    switch (sessionType) {
      case 'acne_analysis':
        return {
          description: 'Specialized acne analysis and treatment consultation',
          focus: ['acne', 'breakouts', 'pore_clogging', 'inflammation', 'scarring'],
          productCategories: ['cleansers', 'treatments', 'moisturizers', 'spot_treatments'],
          analysisSteps: [
            'assess_acne_severity',
            'identify_acne_type',
            'analyze_skin_texture',
            'recommend_treatment_plan',
            'suggest_maintenance_routine'
          ],
          features: ['acne_severity_detection', 'pore_analysis', 'inflammation_assessment'],
          prompts: {
            english: `You are a specialized dermatological advisor focusing on acne treatment and prevention. ${basePersonalization} Your client is seeking help with acne-related concerns. 

FOCUS AREAS:
• Identify acne type (comedonal, inflammatory, cystic)
• Assess acne severity (mild, moderate, severe)
• Analyze contributing factors (hormones, diet, products)
• Recommend targeted treatments and products
• Create a comprehensive acne management routine

Be thorough in your analysis, ask about their current routine, skin triggers, and lifestyle factors. Provide evidence-based recommendations and emphasize the importance of consistency and patience in acne treatment.`,

            arabic: `أنت مستشار جلدية متخصص في علاج ومنع حب الشباب. ${basePersonalizationAr} عميلك يبحث عن المساعدة في مشاكل حب الشباب.

مجالات التركيز:
• تحديد نوع حب الشباب (كوميدونال، التهابي، كيسي)
• تقييم شدة حب الشباب (خفيف، متوسط، شديد)
• تحليل العوامل المساهمة (الهرمونات، النظام الغذائي، المنتجات)
• توصية بالعلاجات والمنتجات المستهدفة
• إنشاء روتين شامل لإدارة حب الشباب

كن شاملاً في تحليلك، اسأل عن روتينهم الحالي، ومحفزات البشرة، وعوامل نمط الحياة. قدم توصيات قائمة على الأدلة وأكد على أهمية الاتساق والصبر في علاج حب الشباب.`
          }
        };

      case 'anti_aging':
        return {
          description: 'Anti-aging and mature skin consultation',
          focus: ['fine_lines', 'wrinkles', 'elasticity', 'firmness', 'age_spots', 'prevention'],
          productCategories: ['serums', 'retinoids', 'moisturizers', 'sunscreens', 'treatments'],
          analysisSteps: [
            'assess_aging_signs',
            'analyze_skin_elasticity',
            'identify_pigmentation',
            'recommend_active_ingredients',
            'create_anti_aging_routine'
          ],
          features: ['wrinkle_detection', 'elasticity_analysis', 'pigmentation_mapping'],
          prompts: {
            english: `You are an anti-aging skincare specialist. ${basePersonalization} Your client is concerned about signs of aging and wants to maintain youthful, healthy skin.

FOCUS AREAS:
• Assess visible signs of aging (fine lines, wrinkles, sagging)
• Analyze skin texture and firmness
• Identify sun damage and pigmentation
• Recommend proven anti-aging ingredients (retinoids, peptides, antioxidants)
• Create comprehensive prevention and treatment routine

Emphasize the importance of sun protection, consistent use of proven ingredients, and realistic expectations. Provide age-appropriate recommendations and explain how different ingredients work together for optimal results.`,

            arabic: `أنت متخصص في العناية بالبشرة المضادة للشيخوخة. ${basePersonalizationAr} عميلك قلق بشأن علامات الشيخوخة ويريد الحفاظ على بشرة شابة وصحية.

مجالات التركيز:
• تقييم علامات الشيخوخة المرئية (الخطوط الدقيقة، التجاعيد، الترهل)
• تحليل ملمس البشرة وثباتها
• تحديد أضرار الشمس والتصبغ
• توصية بمكونات مكافحة الشيخوخة المثبتة (الريتينويدات، الببتيدات، مضادات الأكسدة)
• إنشاء روتين شامل للوقاية والعلاج

أكد على أهمية الحماية من الشمس، والاستخدام المتسق للمكونات المثبتة، والتوقعات الواقعية. قدم توصيات مناسبة للعمر واشرح كيف تعمل المكونات المختلفة معاً للحصول على أفضل النتائج.`
          }
        };

      case 'sensitive_skin':
        return {
          description: 'Sensitive skin analysis and gentle care consultation',
          focus: ['sensitivity', 'irritation', 'redness', 'barrier_function', 'gentle_ingredients'],
          productCategories: ['gentle_cleansers', 'soothing_treatments', 'barrier_repair', 'fragrance_free'],
          analysisSteps: [
            'assess_sensitivity_level',
            'identify_triggers',
            'analyze_barrier_function',
            'recommend_gentle_ingredients',
            'build_minimalist_routine'
          ],
          features: ['sensitivity_detection', 'irritation_analysis', 'barrier_assessment'],
          prompts: {
            english: `You are a sensitive skin specialist. ${basePersonalization} Your client has sensitive, reactive skin that requires gentle, careful treatment.

FOCUS AREAS:
• Assess skin sensitivity level and triggers
• Identify signs of barrier damage or irritation
• Recommend gentle, fragrance-free products
• Build minimalist, effective routines
• Suggest soothing and barrier-repair ingredients

Be extra cautious with recommendations, emphasize patch testing, and focus on gentle, proven ingredients. Help them identify and avoid common irritants while building a simple, effective routine that strengthens the skin barrier.`,

            arabic: `أنت متخصص في البشرة الحساسة. ${basePersonalizationAr} عميلك لديه بشرة حساسة ومتفاعلة تتطلب علاجاً لطيفاً وحذراً.

مجالات التركيز:
• تقييم مستوى حساسية البشرة والمحفزات
• تحديد علامات تلف الحاجز أو التهيج
• توصية بمنتجات لطيفة وخالية من العطور
• بناء روتين بسيط وفعال
• اقتراح مكونات مهدئة ومصلحة للحاجز

كن حذراً جداً مع التوصيات، أكد على اختبار الرقعة، وركز على المكونات اللطيفة والمثبتة. ساعدهم في تحديد وتجنب المهيجات الشائعة بينما تبني روتيناً بسيطاً وفعالاً يقوي حاجز البشرة.`
          }
        };

      case 'general_analysis':
      default:
        return {
          description: 'Comprehensive general skin analysis and personalized consultation',
          focus: ['overall_health', 'skin_type', 'concerns', 'routine_optimization', 'prevention'],
          productCategories: ['cleansers', 'moisturizers', 'treatments', 'sunscreens', 'serums'],
          analysisSteps: [
            'determine_skin_type',
            'identify_main_concerns',
            'assess_current_routine',
            'recommend_improvements',
            'create_personalized_plan'
          ],
          features: ['comprehensive_analysis', 'skin_type_detection', 'routine_optimization'],
          prompts: {
            english: `You are a comprehensive skincare consultant. ${basePersonalization} Provide a thorough analysis of their skin and create a personalized skincare routine.

FOCUS AREAS:
• Determine accurate skin type (normal, dry, oily, combination)
• Identify primary skin concerns and goals
• Assess current skincare routine effectiveness
• Recommend suitable products and ingredients
• Create a balanced, achievable routine

Take a holistic approach, considering their lifestyle, budget, and preferences. Provide education about skincare basics and help them build sustainable habits for long-term skin health.`,

            arabic: `أنت مستشار شامل للعناية بالبشرة. ${basePersonalizationAr} قدم تحليلاً شاملاً لبشرتهم وأنشئ روتين عناية شخصي.

مجالات التركيز:
• تحديد نوع البشرة بدقة (عادية، جافة، دهنية، مختلطة)
• تحديد مشاكل البشرة الأساسية والأهداف
• تقييم فعالية روتين العناية بالبشرة الحالي
• توصية بالمنتجات والمكونات المناسبة
• إنشاء روتين متوازن وقابل للتحقيق

اتبع نهجاً شاملاً، مع مراعاة نمط حياتهم وميزانيتهم وتفضيلاتهم. قدم التعليم حول أساسيات العناية بالبشرة وساعدهم في بناء عادات مستدامة لصحة البشرة على المدى الطويل.`
          }
        };
    }
  }

  async createRoom(createRoomDto: CreateRoomDto, user: AuthenticatedUser) {
    console.log('🚀 ROOM SERVICE: createRoom method called');
    console.log('📋 Input parameters:', JSON.stringify(createRoomDto, null, 2));
    console.log('👤 Authenticated user:', user);

    const { roomName, language, sessionType } = createRoomDto;

    // Get user details from database for personalization
    const userDetails = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!userDetails) {
      throw new NotFoundException('User not found');
    }

    // Generate room name if not provided
    const finalRoomName = roomName || `skincare-${userDetails.firstName || 'user'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const finalLanguage = language || 'arabic';
    const finalSessionType = sessionType || 'general_analysis';
    
    // Create user display name
    const displayName = userDetails.firstName && userDetails.lastName 
      ? `${userDetails.firstName} ${userDetails.lastName}`
      : userDetails.firstName || userDetails.email.split('@')[0];

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
        const participantName = displayName;
        let token = 'test-token'; // fallback
        
        try {
          token = await this.liveKitService.generateToken(finalRoomName, participantName, user.id);
          console.log(`🎫 LiveKit token generated for existing room: ${participantName}`);
        } catch (tokenError) {
          console.error('⚠️ Failed to generate LiveKit token for existing room:', tokenError.message);
        }
        
        const metadata = existingRoom.metadata as any;
        return {
          room: existingRoom,
          user: metadata?.user || { displayName },
          token: token,
          participantName: participantName,
          liveKitUrl: process.env.LIVEKIT_URL,
          aiPrompt: metadata?.aiPrompt?.[finalLanguage] || 'AI prompt not available',
          language: finalLanguage,
          sessionType: metadata?.sessionType || finalSessionType,
          metadata: existingRoom.metadata
        };
      }

      // Get specialized prompts and settings for each session type
      const sessionPrompts = this.getSessionTypePrompts(finalSessionType, displayName);
      
      // Create enhanced room metadata with user information
      const metadata = {
        type: 'skincare_consultation',
        sessionType: finalSessionType,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
        user: {
          id: userDetails.id,
          email: userDetails.email,
          displayName,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          role: userDetails.role,
          memberSince: userDetails.createdAt,
        },
        description: `${sessionPrompts.description} for ${displayName}`,
        aiPrompt: sessionPrompts.prompts,
        language: finalLanguage,
        sessionSettings: {
          analysisType: finalSessionType,
          personalizedGreeting: true,
          productRecommendations: true,
          followUpReminders: true,
          specializedFocus: sessionPrompts.focus,
          recommendedProducts: sessionPrompts.productCategories,
          analysisSteps: sessionPrompts.analysisSteps,
        },
        features: [
          'skin_analysis',
          'product_recommendations',
          'personalized_advice',
          'bilingual_support',
          'user_profile_integration',
          'session_history',
          ...sessionPrompts.features
        ]
      };

      console.log('📝 Room metadata:', JSON.stringify(metadata, null, 2));

      // Use LiveKit service to create room with metadata and generate token
      const participantName = displayName;
      const ttlSeconds = 2 * 60 * 60; // 2 hours
      
      try {
        const { room: newRoom, token } = await this.liveKitService.createRoomWithToken(
          finalRoomName,
          metadata,
          user.id,
          participantName,
          ttlSeconds
        );

        console.log(`✅ Skincare consultation room created successfully: ${finalRoomName}`);
        console.log(`🎫 Real LiveKit token generated for ${participantName}`);

        return {
          room: newRoom,
          user: metadata.user,
          token,
          participantName,
          liveKitUrl: process.env.LIVEKIT_URL,
          sessionSettings: metadata.sessionSettings,
          aiPrompt: metadata.aiPrompt[finalLanguage],
          language: finalLanguage,
          sessionType: finalSessionType,
          tokenExpiresIn: ttlSeconds,
          expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
        };
      } catch (liveKitError) {
        console.error('⚠️ LiveKit service failed, falling back to manual creation:', liveKitError.message);
        
        // Fallback: Create room in database only
        const newRoom = await this.prisma.liveKitRoom.create({
          data: {
            name: finalRoomName,
            metadata: metadata,
            createdBy: user.id,
            createdAt: new Date()
          }
        });

        return {
          room: newRoom,
          user: metadata.user,
          token: 'fallback-token',
          participantName,
          liveKitUrl: process.env.LIVEKIT_URL,
          sessionSettings: metadata.sessionSettings,
          aiPrompt: metadata.aiPrompt[finalLanguage],
          language: finalLanguage,
          sessionType: finalSessionType,
          fallbackMode: true,
        };
      }

    } catch (error) {
      console.error('❌ Error creating room:', error);
      throw new BadRequestException(`Failed to create room: ${error.message}`);
    }
  }

  async leaveRoom(leaveRoomDto: LeaveRoomDto, userId: string) {
    const { roomName } = leaveRoomDto;

    console.log(`🚪 User ${userId} leaving room: ${roomName}`);

    try {
      // Check if the LiveKit room exists and user has access
      const liveKitRoom = await this.prisma.liveKitRoom.findFirst({
        where: {
          name: roomName,
          createdBy: userId, // Only allow users to leave their own rooms
        }
      });

      if (!liveKitRoom) {
        throw new NotFoundException('Room not found or access denied');
      }

      console.log(`✅ User ${userId} left room: ${roomName}`);

      return {
        message: `Successfully left room ${roomName}`,
        userId,
        roomName,
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

  async getRoomStatus(roomName: string, userId: string) {
    console.log(`📊 Checking status for room: ${roomName} by user: ${userId}`);

    try {
      // Get room from database - ensure user has access
      const liveKitRoom = await this.prisma.liveKitRoom.findFirst({
        where: {
          name: roomName,
          createdBy: userId, // Only show status for user's own rooms
        }
      });

      if (!liveKitRoom) {
        throw new NotFoundException('Room not found or access denied');
      }

      // Calculate room duration
      const createdAt = liveKitRoom.createdAt;
      const now = new Date();
      const durationMs = now.getTime() - createdAt.getTime();
      const durationMinutes = Math.floor(durationMs / (1000 * 60));

      const metadata = liveKitRoom.metadata as any;

      return {
        room: {
          id: liveKitRoom.id,
          name: liveKitRoom.name,
          createdAt: liveKitRoom.createdAt,
          createdBy: liveKitRoom.createdBy,
          metadata: liveKitRoom.metadata,
          durationMinutes,
          status: 'active',
          sessionType: metadata?.sessionType || 'general_analysis',
          language: metadata?.language || 'arabic',
          userDisplayName: metadata?.user?.displayName || 'Unknown User',
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

  async refreshToken(refreshTokenDto: RefreshTokenDto, user: AuthenticatedUser) {
    const { roomName } = refreshTokenDto;

    console.log(`🔄 Refreshing token for user ${user.id} in room: ${roomName}`);

    try {
      // Check if the LiveKit room exists and user has access
      const liveKitRoom = await this.prisma.liveKitRoom.findFirst({
        where: {
          name: roomName,
          createdBy: user.id, // Only allow token refresh for room creator
        }
      });

      if (!liveKitRoom) {
        throw new NotFoundException('Room not found or access denied');
      }

      // Get user display name from room metadata
      const roomMetadata = liveKitRoom.metadata as any;
      const participantName = roomMetadata?.user?.displayName || `User ${user.id}`;
      let token = 'test-token'; // fallback
      
      try {
        token = await this.liveKitService.generateToken(roomName, participantName, user.id);
        console.log(`✅ Real LiveKit token generated for ${participantName}`);
      } catch (tokenError) {
        console.error('⚠️ Failed to generate LiveKit token for refresh:', tokenError.message);
      }
      
      // Calculate token expiration time (2 hours)
      const now = new Date();
      const expiresAt = new Date(now.getTime() + (2 * 60 * 60 * 1000));

      return {
        token: token,
        roomName,
        participantName,
        userId: user.id,
        expiresAt: expiresAt.toISOString(),
        durationSeconds: 2 * 60 * 60,
        liveKitUrl: process.env.LIVEKIT_URL,
      };

    } catch (error) {
      console.error('Error refreshing token:', error);

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to refresh token');
    }
  }

  async listUserRooms(userId: string) {
    try {
      console.log(`📋 Fetching rooms for user: ${userId}`);

      const rooms = await this.prisma.liveKitRoom.findMany({
        where: {
          createdBy: userId, // Only show user's own rooms
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Enhanced room data with session info
      const enhancedRooms = rooms.map(room => {
        const metadata = room.metadata as any;
        const now = new Date();
        const durationMs = now.getTime() - room.createdAt.getTime();
        const durationMinutes = Math.floor(durationMs / (1000 * 60));
        
        return {
          id: room.id,
          name: room.name,
          createdAt: room.createdAt,
          durationMinutes,
          sessionType: metadata?.sessionType || 'general_analysis',
          language: metadata?.language || 'arabic',
          status: 'active',
          userDisplayName: metadata?.user?.displayName || 'Unknown User',
        };
      });

      return {
        rooms: enhancedRooms,
        count: rooms.length,
      };

    } catch (error) {
      console.error('Error fetching user rooms:', error);
      throw new BadRequestException('Failed to fetch user rooms');
    }
  }

  async deleteRoom(roomName: string, userId: string) {
    try {
      console.log(`🗑️ Deleting room: ${roomName} by user: ${userId}`);

      const room = await this.prisma.liveKitRoom.findFirst({
        where: {
          name: roomName,
          createdBy: userId, // Only allow deletion by room creator
        }
      });

      if (!room) {
        throw new NotFoundException('Room not found or you do not have permission to delete it');
      }

      await this.prisma.liveKitRoom.delete({
        where: {
          id: room.id
        }
      });

      console.log(`✅ Room ${roomName} deleted successfully`);

      return {
        message: `Room ${roomName} deleted successfully`,
        roomName,
        deletedBy: userId,
        deletedAt: new Date().toISOString(),
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
