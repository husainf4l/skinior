import { IsString, IsOptional } from 'class-validator';

export class CreateBlogTagDto {
  @IsString()
  nameEn: string;

  @IsString()
  nameAr: string;
}

export class UpdateBlogTagDto {
  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  nameAr?: string;
}