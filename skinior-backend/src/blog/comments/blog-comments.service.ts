import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogCommentDto, BlogCommentResponseDto } from './dto/blog-comment.dto';

@Injectable()
export class BlogCommentsService {
  constructor(private prisma: PrismaService) {}

  private formatComment(comment: any): BlogCommentResponseDto {
    return {
      id: comment.id,
      content: comment.content,
      author: {
        name: comment.authorName,
        avatar: comment.authorAvatar,
        email: comment.authorEmail,
      },
      postId: comment.postId,
      parentId: comment.parentId,
      createdAt: comment.createdAt.toISOString(),
      likes: comment.likes,
      replies: comment.replies?.map((reply: any) => this.formatComment(reply)) || [],
    };
  }

  async create(postId: string, createBlogCommentDto: CreateBlogCommentDto, user: any): Promise<BlogCommentResponseDto> {
    // Verify post exists
    const post = await this.prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    // If parentId is provided, verify parent comment exists and belongs to the same post
    if (createBlogCommentDto.parentId) {
      const parentComment = await this.prisma.blogComment.findUnique({
        where: { id: createBlogCommentDto.parentId },
      });

      if (!parentComment || parentComment.postId !== postId) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const comment = await this.prisma.blogComment.create({
      data: {
        content: createBlogCommentDto.content,
        postId,
        parentId: createBlogCommentDto.parentId,
        authorName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous',
        authorEmail: user.email,
        // You could add avatar from user profile if available
      },
      include: {
        replies: true,
      },
    });

    // Update comment count on post
    await this.prisma.blogPost.update({
      where: { id: postId },
      data: {
        commentsCount: {
          increment: 1,
        },
      },
    });

    return this.formatComment(comment);
  }

  async findByPost(postId: string): Promise<BlogCommentResponseDto[]> {
    const comments = await this.prisma.blogComment.findMany({
      where: {
        postId,
        parentId: null, // Only get top-level comments
      },
      include: {
        replies: {
          include: {
            replies: true, // Support for nested replies
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments.map(comment => this.formatComment(comment));
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.prisma.blogComment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Only allow comment deletion by the author or admin
    // This is a simplified check - you might want to implement proper role-based access
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || (comment.authorEmail !== user.email && user.role !== 'admin')) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Count replies to update post comment count correctly
    const replyCount = await this.prisma.blogComment.count({
      where: { parentId: id },
    });

    await this.prisma.blogComment.delete({
      where: { id },
    });

    // Update comment count on post (subtract 1 + reply count)
    await this.prisma.blogPost.update({
      where: { id: comment.postId },
      data: {
        commentsCount: {
          decrement: 1 + replyCount,
        },
      },
    });
  }

  async likeComment(id: string): Promise<{ likes: number }> {
    const comment = await this.prisma.blogComment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const updatedComment = await this.prisma.blogComment.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    return { likes: updatedComment.likes };
  }
}