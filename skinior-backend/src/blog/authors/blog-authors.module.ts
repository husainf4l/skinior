import { Module } from '@nestjs/common';
import { BlogAuthorsService } from './blog-authors.service';
import { BlogAuthorsController } from './blog-authors.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BlogAuthorsController],
  providers: [BlogAuthorsService],
  exports: [BlogAuthorsService],
})
export class BlogAuthorsModule {}