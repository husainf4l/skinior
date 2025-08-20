import { IsEmail, IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class AddressDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress: AddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  shippingMethod: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  discountCode?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: 'stripe' | 'cod'; // Payment method type
}

export class ProcessPaymentDto {
  @IsString()
  paymentMethodId: string;

  @IsString()
  @IsOptional()
  paymentType?: 'stripe' | 'cod'; // Cash on Delivery option

  @IsBoolean()
  @IsOptional()
  savePaymentMethod?: boolean;
}

export class ApplyDiscountDto {
  @IsNumber()
  cartTotal: number;

  @IsString()
  discountCode: string;
}

export class CalculateShippingDto {
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;
}

export class GetPaymentMethodsDto {
  @IsString()
  country: string;
}
