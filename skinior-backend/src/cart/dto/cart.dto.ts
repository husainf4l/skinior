import { IsString, IsNumber, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  quantity: number;
}

export class CreateCartDto {
  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  sessionId?: string;
}

export class MigrateCartDto {
  @IsString()
  sessionId: string;

  @IsString()
  userId: string;
}
