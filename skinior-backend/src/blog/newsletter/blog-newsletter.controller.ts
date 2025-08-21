import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BlogNewsletterService } from './blog-newsletter.service';
import { SubscribeNewsletterDto } from './dto/newsletter.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('blog/newsletter')
export class BlogNewsletterController {
  constructor(private readonly blogNewsletterService: BlogNewsletterService) {}

  @Public()
  @Post('subscribe')
  async subscribe(@Body() subscribeNewsletterDto: SubscribeNewsletterDto) {
    try {
      return this.blogNewsletterService.subscribe(subscribeNewsletterDto);
    } catch (error) {
      if (error.message === 'EMAIL_ALREADY_SUBSCRIBED') {
        throw new HttpException(
          {
            error: 'EMAIL_ALREADY_SUBSCRIBED',
            message: 'This email is already subscribed to our newsletter',
          },
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  @Public()
  @Post('unsubscribe')
  unsubscribe(@Body('email') email: string) {
    return this.blogNewsletterService.unsubscribe(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('subscribers')
  getSubscribers(
    @Query('locale') locale?: 'en' | 'ar',
    @Query('active') active?: string,
  ) {
    const isActive = active !== 'false';
    return {
      data: this.blogNewsletterService.getSubscribers(locale, isActive),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() {
    return {
      data: this.blogNewsletterService.getSubscriberStats(),
    };
  }
}