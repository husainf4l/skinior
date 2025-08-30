import {
  Controller,
  Post,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { JoinWaitlistDto, WaitlistResponseDto } from './waitlist.dto';

@Controller('waitlist')
export class WaitlistController {
  constructor(private waitlistService: WaitlistService) {}

  @Post('join')
  async joinWaitlist(
    @Body(ValidationPipe) joinWaitlistDto: JoinWaitlistDto,
  ): Promise<WaitlistResponseDto> {
    return this.waitlistService.joinWaitlist(joinWaitlistDto);
  }
}
