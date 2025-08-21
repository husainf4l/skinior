import { Module } from '@nestjs/common';
import { BlogTagsService } from './blog-tags.service';
import { BlogTagsController } from './blog-tags.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BlogTagsController],
  providers: [BlogTagsService],
  exports: [BlogTagsService],
})
export class BlogTagsModule {}