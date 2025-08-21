import { Module } from '@nestjs/common';
import { BlogNewsletterService } from './blog-newsletter.service';
import { BlogNewsletterController } from './blog-newsletter.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BlogNewsletterController],
  providers: [BlogNewsletterService],
  exports: [BlogNewsletterService],
})
export class BlogNewsletterModule {}