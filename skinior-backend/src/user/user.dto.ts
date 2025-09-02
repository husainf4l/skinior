import { IsEmail, IsOptional, IsString, IsBoolean, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  googleId?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UserResponseDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class DeleteAccountDto {
  @IsString()
  @MinLength(3, { message: 'Confirmation text must be at least 3 characters long' })
  confirmationText: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsBoolean()
  deleteData?: boolean; // Option to delete all user data vs anonymize
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  newPassword: string;
}

// Mobile Google Sign-In DTO
export class GoogleMobileAuthDto {
  @IsString()
  idToken: string;

  @IsOptional()
  @IsString()
  serverAuthCode?: string;

  @IsOptional()
  user?: {
    email: string;
    name: string;
    picture?: string;
    id: string;
  };
}

// Mobile Apple Sign-In DTO
export class AppleMobileAuthDto {
  @IsString()
  identityToken: string;

  @IsString()
  authorizationCode: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  user?: {
    email?: string;
    name?: {
      firstName: string;
      lastName: string;
    };
  };
}
