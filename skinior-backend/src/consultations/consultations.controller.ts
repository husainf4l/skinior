import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ConsultationsService } from './consultations.service';
import {
  ConsultationQueryDto,
  ConsultationsResponseDto,
  ConsultationDetailResponseDto,
  ErrorResponseDto,
} from './dto';

@ApiTags('Consultations')
@Controller('consultations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get my consultations',
    description: 'Get paginated list of user\'s AI consultations with filtering options',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of consultations to return (1-100)', example: 20 })
  @ApiQuery({ name: 'cursor', required: false, type: String, description: 'Pagination cursor' })
  @ApiQuery({ name: 'status', required: false, enum: ['completed', 'in_progress', 'pending', 'cancelled', 'all'], description: 'Filter by status' })
  @ApiQuery({ name: 'from', required: false, type: String, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'End date (ISO format)' })
  @ApiResponse({
    status: 200,
    description: 'Consultations retrieved successfully',
    type: ConsultationsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token',
    type: ErrorResponseDto,
  })
  async getMyConsultations(
    @Query() query: ConsultationQueryDto,
    @GetUser() user: any,
  ): Promise<ConsultationsResponseDto> {
    try {
      // Validate query parameters
      this.validateQueryParameters(query);

      const result = await this.consultationsService.getConsultations(
        user.userId,
        query,
      );

      return {
        success: true,
        data: result,
        message: 'Consultations retrieved successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch consultations',
        },
      });
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get consultation details',
    description: 'Get full details of a specific consultation',
  })
  @ApiParam({ name: 'id', type: String, description: 'Consultation ID' })
  @ApiResponse({
    status: 200,
    description: 'Consultation details retrieved successfully',
    type: ConsultationDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Consultation not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token',
    type: ErrorResponseDto,
  })
  async getMyConsultationDetails(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<ConsultationDetailResponseDto> {
    try {
      const consultation = await this.consultationsService.getConsultationById(
        user.userId,
        id,
      );

      return {
        success: true,
        data: { consultation },
        message: 'Consultation details retrieved successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new BadRequestException({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch consultation details',
        },
      });
    }
  }

  private validateQueryParameters(query: ConsultationQueryDto): void {
    const errors: any = {};

    // Validate limit
    if (query.limit !== undefined) {
      const limit = Number(query.limit);
      if (isNaN(limit) || limit < 1 || limit > 100) {
        errors.limit = 'Limit must be between 1 and 100';
      }
    }

    // Validate status
    if (query.status !== undefined) {
      const validStatuses = ['completed', 'in_progress', 'pending', 'cancelled', 'all'];
      if (!validStatuses.includes(query.status)) {
        errors.status = 'Invalid status value. Must be one of: ' + validStatuses.join(', ');
      }
    }

    // Validate date formats
    if (query.from !== undefined) {
      const fromDate = new Date(query.from);
      if (isNaN(fromDate.getTime())) {
        errors.from = 'Invalid from date format. Use ISO date format (YYYY-MM-DDTHH:mm:ss.sssZ)';
      }
    }

    if (query.to !== undefined) {
      const toDate = new Date(query.to);
      if (isNaN(toDate.getTime())) {
        errors.to = 'Invalid to date format. Use ISO date format (YYYY-MM-DDTHH:mm:ss.sssZ)';
      }
    }

    // Validate date range
    if (query.from && query.to) {
      const fromDate = new Date(query.from);
      const toDate = new Date(query.to);
      if (fromDate > toDate) {
        errors.dateRange = 'From date cannot be later than to date';
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({
        success: false,
        error: {
          code: 'INVALID_PARAMETERS',
          message: 'Invalid query parameters',
          details: errors,
        },
      });
    }
  }
}
