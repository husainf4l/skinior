import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { AnalysisSessionsModule } from './analysis-sessions/analysis-sessions.module';
import { AnalysisDataModule } from './analysis-data/analysis-data.module';
import { ProductRecommendationsModule } from './product-recommendations/product-recommendations.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CheckoutModule,
    CartModule,
    WebhookModule,
    RoomModule,
    LiveKitModule,
    // Agent16 Integration Modules
    AnalysisSessionsModule,
    AnalysisDataModule,
    ProductRecommendationsModule,
    // Blog Module
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
