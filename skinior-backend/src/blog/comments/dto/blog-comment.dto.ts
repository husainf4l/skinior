import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateBlogCommentDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}

export class BlogCommentResponseDto {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    email?: string;
  };
  postId: string;
  parentId?: string;
  createdAt: string;
  likes: number;
  replies?: BlogCommentResponseDto[];
}