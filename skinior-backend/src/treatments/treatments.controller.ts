import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

// DTOs for treatments
export class CreateTreatmentDto {
  name: string;
  startDate: Date;
  durationWeeks: number;
  milestones?: string[];
}

export class UpdateTreatmentDto {
  progressPercent?: number;
  status?: 'active' | 'paused' | 'completed' | 'cancelled';
  completeMilestoneId?: string;
}

export class TreatmentMilestone {
  id: string;
  title: string;
  description: string;
  targetWeek: number;
  completed: boolean;
  completedAt?: Date;
}

@ApiTags('Treatments')
@Controller('treatments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TreatmentsController {
  @Get()
  @ApiOperation({
    summary: 'Get user treatments',
    description: 'Get list of user treatment plans and routines',
  })
  @ApiResponse({
    status: 200,
    description: 'Treatments retrieved successfully',
  })
  async getTreatments(@GetUser() user: any) {
    // Mock implementation - replace with actual service
    const treatments = [
      {
        id: '1',
        name: 'Acne Treatment Plan',
        startDate: new Date('2024-01-01'),
        durationWeeks: 12,
        progressPercent: 65,
        status: 'active',
        currentWeek: 8,
        milestonesCompleted: 3,
        totalMilestones: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Anti-aging Routine',
        startDate: new Date('2024-02-01'),
        durationWeeks: 16,
        progressPercent: 40,
        status: 'active',
        currentWeek: 6,
        milestonesCompleted: 2,
        totalMilestones: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return {
      success: true,
      data: { treatments },
      message: 'Treatments retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Create new treatment plan',
    description: 'Create a new treatment plan with milestones',
  })
  @ApiResponse({
    status: 201,
    description: 'Treatment created successfully',
  })
  async createTreatment(
    @Body() createTreatmentDto: CreateTreatmentDto,
    @GetUser() user: any,
  ) {
    // Mock implementation - replace with actual service
    const treatment = {
      id: 'new-treatment-id',
      userId: user.id,
      ...createTreatmentDto,
      progressPercent: 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      success: true,
      data: { treatment },
      message: 'Treatment created successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update treatment progress',
    description: 'Update treatment progress percentage, status, or complete milestones',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Treatment updated successfully',
  })
  async updateTreatment(
    @Param('id') id: string,
    @Body() updateTreatmentDto: UpdateTreatmentDto,
    @GetUser() user: any,
  ) {
    // Mock implementation - replace with actual service
    const treatment = {
      id,
      userId: user.id,
      ...updateTreatmentDto,
      updatedAt: new Date(),
    };

    // If milestone is completed, you could trigger notifications here
    if (updateTreatmentDto.completeMilestoneId) {
      // Logic to mark milestone as completed and possibly send notification
    }

    return {
      success: true,
      data: { treatment },
      message: 'Treatment updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id/milestones')
  @ApiOperation({
    summary: 'Get treatment milestones',
    description: 'Get all milestones for a specific treatment',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Milestones retrieved successfully',
  })
  async getTreatmentMilestones(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<any> {
    // Mock implementation - replace with actual service
    const milestones: TreatmentMilestone[] = [
      {
        id: '1',
        title: 'Initial Assessment',
        description: 'Complete skin analysis and set baseline',
        targetWeek: 1,
        completed: true,
        completedAt: new Date('2024-01-07'),
      },
      {
        id: '2',
        title: 'First Progress Check',
        description: 'Review initial treatment response',
        targetWeek: 4,
        completed: true,
        completedAt: new Date('2024-01-28'),
      },
      {
        id: '3',
        title: 'Mid-Treatment Evaluation',
        description: 'Assess treatment effectiveness and adjust if needed',
        targetWeek: 8,
        completed: true,
        completedAt: new Date('2024-02-25'),
      },
      {
        id: '4',
        title: 'Three-Quarter Mark',
        description: 'Evaluate near-completion status',
        targetWeek: 10,
        completed: false,
      },
      {
        id: '5',
        title: 'Final Assessment',
        description: 'Complete treatment evaluation',
        targetWeek: 12,
        completed: false,
      },
    ];

    return {
      success: true,
      data: { milestones },
      message: 'Milestones retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
