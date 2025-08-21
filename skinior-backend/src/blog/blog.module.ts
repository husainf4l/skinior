import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogPostsModule } from './posts/blog-posts.module';
import { BlogCategoriesModule } from './categories/blog-categories.module';
import { BlogAuthorsModule } from './authors/blog-authors.module';
import { BlogTagsModule } from './tags/blog-tags.module';
import { BlogCommentsModule } from './comments/blog-comments.module';
import { BlogNewsletterModule } from './newsletter/blog-newsletter.module';

@Module({
  imports: [
    BlogPostsModule,
    BlogCategoriesModule,
    BlogAuthorsModule,
    BlogTagsModule,
    BlogCommentsModule,
    BlogNewsletterModule,
  ],
  controllers: [BlogController],
  exports: [
    BlogPostsModule,
    BlogCategoriesModule,
    BlogAuthorsModule,
    BlogTagsModule,
    BlogCommentsModule,
    BlogNewsletterModule,
  ],
})
export class BlogModule {}