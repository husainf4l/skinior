import { IsString, IsOptional, IsEmail, IsObject } from 'class-validator';

export class CreateBlogAuthorDto {
  @IsString()
  nameEn: string;

  @IsString()
  nameAr: string;

  @IsString()
  avatar: string;

  @IsString()
  bioEn: string;

  @IsString()
  bioAr: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsObject()
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export class UpdateBlogAuthorDto {
  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  bioEn?: string;

  @IsOptional()
  @IsString()
  bioAr?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsObject()
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}