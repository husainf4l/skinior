import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { NotificationModule } from './notifications/notification.module';
import { SubscriptionModule } from './subscriptions/subscription.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    WaitlistModule,
    NotificationModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
