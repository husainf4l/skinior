import { Body, Controller, Param, Post, Get, Query, BadRequestException } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { Public } from '../auth/decorators/public.decorator';
import { 
  CreateOrderDto, 
  ProcessPaymentDto, 
  ApplyDiscountDto, 
  CalculateShippingDto,
  GetPaymentMethodsDto,
  LinkAccountDto,
  GetOrderHistoryDto
} from './dto/checkout.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Public()
  @Post('shipping')
  async calculateShipping(@Body() body: CalculateShippingDto) {
    return this.checkoutService.getShippingOptions(body.shippingAddress);
  }

  @Public()
  @Post('payment-methods')
  async getPaymentMethods(@Body() body: GetPaymentMethodsDto) {
    return this.checkoutService.getAvailablePaymentMethods(body.country);
  }

  @Public()
  @Post('discount')
  async applyDiscount(@Body() body: ApplyDiscountDto) {
    return this.checkoutService.applyDiscount(body.cartTotal, body.discountCode);
  }

  @Public()
  @Post('orders')
  async createOrder(@Body() body: CreateOrderDto) {
    return this.checkoutService.createOrder(body);
  }

  @Public()
  @Post('order')
  async createOrderAlias(@Body() body: CreateOrderDto) {
    return this.checkoutService.createOrder(body);
  }

  @Public()
  @Post('payment')
  async processPayment(
    @Body() processPaymentDto: ProcessPaymentDto,
    @Query('orderId') orderId: string,
  ) {
    return this.checkoutService.processPayment(
      orderId,
      processPaymentDto.paymentMethodId,
      processPaymentDto.savePaymentMethod,
      processPaymentDto.paymentType,
    );
  }

  @Public()
  @Post('link-account')
  async linkGuestAccount(@Body() linkAccountDto: LinkAccountDto) {
    return this.checkoutService.linkGuestAccountWithPassword(
      linkAccountDto.email,
      linkAccountDto.password,
    );
  }

  @Public()
  @Get('order-history')
  async getOrderHistory(@Query('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email parameter is required');
    }
    return this.checkoutService.getOrderHistory(email);
  }
}
