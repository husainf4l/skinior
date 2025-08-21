import { IsEmail, IsString, IsIn } from 'class-validator';

export class SubscribeNewsletterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsIn(['en', 'ar'])
  locale: 'en' | 'ar';
}