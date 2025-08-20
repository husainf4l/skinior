import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2022-11-15',
    });
  }

  async handleStripeWebhook(body: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new BadRequestException('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException('Invalid signature');
    }

    this.logger.log(`Received Stripe webhook: ${event.type}`);

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        case 'charge.dispute.created':
          await this.handleChargeDispute(event.data.object as Stripe.Charge);
          break;

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error}`);
      throw new BadRequestException('Webhook processing failed');
    }

    return { received: true };
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) {
      this.logger.error('Order ID not found in payment intent metadata');
      return;
    }

    try {
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'confirmed',
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Order ${orderId} confirmed after successful payment`);
    } catch (error) {
      this.logger.error(`Failed to update order ${orderId}: ${error}`);
    }
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) {
      this.logger.error('Order ID not found in payment intent metadata');
      return;
    }

    try {
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'cancelled',
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Order ${orderId} cancelled after failed payment`);
    } catch (error) {
      this.logger.error(`Failed to update order ${orderId}: ${error}`);
    }
  }

  private async handleChargeDispute(charge: Stripe.Charge) {
    // Handle dispute logic here
    this.logger.log(`Charge dispute created for charge: ${charge.id}`);
    // You could update order status, notify admins, etc.
  }
}
