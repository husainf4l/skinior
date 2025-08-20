import { Body, Controller, Param, Post } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { 
  CreateOrderDto, 
  ProcessPaymentDto, 
  ApplyDiscountDto, 
  CalculateShippingDto,
  GetPaymentMethodsDto
} from './dto/checkout.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('shipping')
  async calculateShipping(@Body() body: CalculateShippingDto) {
    return this.checkoutService.getShippingOptions(body.shippingAddress);
  }

  @Post('payment-methods')
  async getPaymentMethods(@Body() body: GetPaymentMethodsDto) {
    return this.checkoutService.getAvailablePaymentMethods(body.country);
  }

  @Post('discount')
  async applyDiscount(@Body() body: ApplyDiscountDto) {
    return this.checkoutService.applyDiscount(body.cartTotal, body.discountCode);
  }

  @Post('orders')
  async createOrder(@Body() body: CreateOrderDto) {
    return this.checkoutService.createOrder(body);
  }

  @Post('orders/:orderId/payment')
  async processPayment(@Param('orderId') orderId: string, @Body() body: ProcessPaymentDto) {
    return this.checkoutService.processPayment(
      orderId, 
      body.paymentMethodId, 
      !!body.savePaymentMethod,
      body.paymentType || 'stripe'
    );
  }
}
