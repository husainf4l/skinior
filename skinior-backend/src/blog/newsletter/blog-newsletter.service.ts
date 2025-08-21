import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscribeNewsletterDto } from './dto/newsletter.dto';

@Injectable()
export class BlogNewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(subscribeNewsletterDto: SubscribeNewsletterDto) {
    // Check if email is already subscribed
    const existingSubscriber = await this.prisma.blogNewsletterSubscriber.findUnique({
      where: {
        email: subscribeNewsletterDto.email,
      },
    });

    if (existingSubscriber) {
      if (existingSubscriber.active) {
        throw new ConflictException('EMAIL_ALREADY_SUBSCRIBED');
      } else {
        // Reactivate subscription
        await this.prisma.blogNewsletterSubscriber.update({
          where: {
            email: subscribeNewsletterDto.email,
          },
          data: {
            active: true,
            locale: subscribeNewsletterDto.locale,
            subscribedAt: new Date(),
          },
        });

        return { success: true };
      }
    }

    // Create new subscription
    await this.prisma.blogNewsletterSubscriber.create({
      data: subscribeNewsletterDto,
    });

    return { success: true };
  }

  async unsubscribe(email: string) {
    const subscriber = await this.prisma.blogNewsletterSubscriber.findUnique({
      where: { email },
    });

    if (subscriber) {
      await this.prisma.blogNewsletterSubscriber.update({
        where: { email },
        data: { active: false },
      });
    }

    return { success: true };
  }

  async getSubscribers(locale?: 'en' | 'ar', active: boolean = true) {
    const where: any = { active };
    
    if (locale) {
      where.locale = locale;
    }

    return this.prisma.blogNewsletterSubscriber.findMany({
      where,
      select: {
        id: true,
        email: true,
        locale: true,
        subscribedAt: true,
      },
      orderBy: {
        subscribedAt: 'desc',
      },
    });
  }

  async getSubscriberStats() {
    const [total, active, english, arabic] = await Promise.all([
      this.prisma.blogNewsletterSubscriber.count(),
      this.prisma.blogNewsletterSubscriber.count({ where: { active: true } }),
      this.prisma.blogNewsletterSubscriber.count({ where: { active: true, locale: 'en' } }),
      this.prisma.blogNewsletterSubscriber.count({ where: { active: true, locale: 'ar' } }),
    ]);

    return {
      total,
      active,
      byLocale: {
        en: english,
        ar: arabic,
      },
    };
  }
}