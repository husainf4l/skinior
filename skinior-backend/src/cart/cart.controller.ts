import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, CreateCartDto, MigrateCartDto } from './dto/cart.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';

@Controller('cart')
@Public()
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly jwtService: JwtService,
  ) {}

  private extractUserFromRequest(req: any): string | undefined {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const payload = this.jwtService.verify(token);
        return payload.sub; // User ID is typically stored in 'sub' field
      }
    } catch (error) {
      // Token is invalid or expired, ignore silently
    }
    return undefined;
  }

  @Post()
  async createCart(@Body() body: CreateCartDto, @Req() req: any) {
    const userId = this.extractUserFromRequest(req);
    const sessionId = body.sessionId;
    
    const cart = await this.cartService.createCart(userId, sessionId);
    return { data: cart };
  }

  @Get('current')
  async getCurrentCart(@Query('sessionId') sessionId: string, @Req() req: any) {
    const userId = this.extractUserFromRequest(req);
    
    // Try to find existing cart for user or session
    let cart = await this.cartService.findCartByUserOrSession(userId, sessionId);
    
    // If no cart found, create a new one
    if (!cart) {
      cart = await this.cartService.createCart(userId, sessionId);
    }
    
    return { data: cart };
  }

  @Get(':cartId')
  async getCart(@Param('cartId') cartId: string, @Query('sessionId') sessionId: string, @Req() req: any) {
    const userId = this.extractUserFromRequest(req);
    const cart = await this.cartService.getCart(cartId, userId, sessionId);
    return { data: cart };
  }

  @Post('migrate')
  async migrateCart(@Body() body: MigrateCartDto, @Req() req: any) {
    const userId = this.extractUserFromRequest(req);
    
    if (!userId) {
      return { error: 'User must be authenticated to migrate cart' };
    }
    
    const cart = await this.cartService.migrateSessionCartToUser(body.sessionId, userId);
    return { data: cart };
  }

  @Post(':cartId/items')
  async addItemToCart(
    @Param('cartId') cartId: string,
    @Body() body: AddToCartDto,
    @Query('sessionId') sessionId: string,
    @Req() req: any
  ) {
    const userId = this.extractUserFromRequest(req);
    const cart = await this.cartService.addItemToCart(cartId, body.productId, body.quantity, userId, sessionId);
    return { data: cart };
  }

  @Put(':cartId/items/:itemId')
  async updateCartItem(
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
    @Body() body: UpdateCartItemDto,
    @Query('sessionId') sessionId: string,
    @Req() req: any
  ) {
    const userId = this.extractUserFromRequest(req);
    const cart = await this.cartService.updateCartItem(cartId, itemId, body.quantity, userId, sessionId);
    return { data: cart };
  }

  @Delete(':cartId/items/:itemId')
  async removeCartItem(
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
    @Query('sessionId') sessionId: string,
    @Req() req: any
  ) {
    const userId = this.extractUserFromRequest(req);
    const cart = await this.cartService.removeCartItem(cartId, itemId, userId, sessionId);
    return { data: cart };
  }

  @Delete(':cartId')
  async clearCart(
    @Param('cartId') cartId: string,
    @Query('sessionId') sessionId: string,
    @Req() req: any
  ) {
    const userId = this.extractUserFromRequest(req);
    await this.cartService.clearCart(cartId, userId, sessionId);
    return { message: 'Cart cleared successfully' };
  }
}
