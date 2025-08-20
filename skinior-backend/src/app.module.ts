import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CheckoutModule } from './checkout/checkout.module';
import { CartModule } from './cart/cart.module';
import { WebhookModule } from './webhook/webhook.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomModule } from './room/room.module';
import { LiveKitModule } from './livekit/livekit.module';

@Module({
  imports: [PrismaModule, ProductsModule, CheckoutModule, CartModule, WebhookModule, AuthModule, UsersModule, RoomModule, LiveKitModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
