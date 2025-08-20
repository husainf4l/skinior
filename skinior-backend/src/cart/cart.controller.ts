import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, CreateCartDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async createCart(@Body() body: CreateCartDto) {
    const cart = await this.cartService.createCart(body.customerId);
    return { data: cart };
  }

  @Get(':cartId')
  async getCart(@Param('cartId') cartId: string) {
    const cart = await this.cartService.getCart(cartId);
    return { data: cart };
  }

  @Post(':cartId/items')
  async addItemToCart(
    @Param('cartId') cartId: string,
    @Body() body: AddToCartDto
  ) {
    const cart = await this.cartService.addItemToCart(cartId, body.productId, body.quantity);
    return { data: cart };
  }

  @Put(':cartId/items/:itemId')
  async updateCartItem(
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
    @Body() body: UpdateCartItemDto
  ) {
    const cart = await this.cartService.updateCartItem(cartId, itemId, body.quantity);
    return { data: cart };
  }

  @Delete(':cartId/items/:itemId')
  async removeCartItem(
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string
  ) {
    const cart = await this.cartService.removeCartItem(cartId, itemId);
    return { data: cart };
  }

  @Delete(':cartId')
  async clearCart(@Param('cartId') cartId: string) {
    await this.cartService.clearCart(cartId);
    return { message: 'Cart cleared successfully' };
  }
}
