import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JoinWaitlistDto, WaitlistResponseDto } from './waitlist.dto';

@Injectable()
export class WaitlistService {
  constructor(private prisma: PrismaService) {}

  async joinWaitlist(
    joinWaitlistDto: JoinWaitlistDto,
  ): Promise<WaitlistResponseDto> {
    const { email, firstName, lastName } = joinWaitlistDto;

    // Check if email already exists in waitlist
    const existingEntry = await this.prisma.waitlist.findUnique({
      where: { email },
    });

    if (existingEntry) {
      throw new ConflictException('Email already exists in waitlist');
    }

    // Create new waitlist entry
    const waitlistEntry = await this.prisma.waitlist.create({
      data: {
        email,
        firstName,
        lastName,
      },
    });

    return this.formatWaitlistResponse(waitlistEntry);
  }

  private formatWaitlistResponse(waitlist: any): WaitlistResponseDto {
    if (!waitlist || typeof waitlist !== 'object') {
      throw new Error('Invalid waitlist entry');
    }

    return {
      id: waitlist.id,
      email: waitlist.email,
      firstName: waitlist.firstName,
      lastName: waitlist.lastName,
      createdAt: waitlist.createdAt,
      updatedAt: waitlist.updatedAt,
    };
  }
}
