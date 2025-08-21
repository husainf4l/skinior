import { Module } from '@nestjs/common';
import { BlogCommentsService } from './blog-comments.service';
import { BlogCommentsController } from './blog-comments.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BlogCommentsController],
  providers: [BlogCommentsService],
  exports: [BlogCommentsService],
})
export class BlogCommentsModule {}