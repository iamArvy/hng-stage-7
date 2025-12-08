import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { IJwtUser } from 'src/common/types';
import { PaystackHttpClient } from 'src/integrations/paystack';
import { InitializePaymentResponse, PaymentStatusDto } from '../dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paystackClient: PaystackHttpClient,
    private readonly prisma: PrismaService,
  ) {}

  getPayments() {
    return this.prisma.payment.findMany();
  }

  async initializePayment(rUser: IJwtUser, amount: number) {
    const user = await this.prisma.user.findUnique({ where: { id: rUser.id } });
    if (!user) throw new NotFoundException('User not found');

    const payment = await this.prisma.payment.create({
      data: {
        amount,
        user: { connect: { id: user.id } },
      },
    });

    const response = await this.paystackClient.initializePayment(
      user.email,
      amount,
      payment.id,
    );

    return new InitializePaymentResponse(response);
  }

  async statusCheck(id: string, refresh: boolean) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    if (payment.status === 'pending' || refresh) {
      const { status, paid_at } = await this.paystackClient.verifyPayment(
        payment.id,
      );
      const updatedPayment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status, paid_at },
      });
      return new PaymentStatusDto(updatedPayment);
    }
    return new PaymentStatusDto(payment);
  }

  webhookHandler(signature: string, body: any) {
    console.log(signature, body);
    /*
        Purpose: Receive transaction updates from Paystack.
        Security: Validate Paystack signature header (e.g. x-paystack-signature) using configured webhook secret.
        Steps:
          Verify signature.
          Parse event payload; find transaction reference.
          Update transaction status in DB (success, failed, pending, etc.).
        Response: 200
          {"status": true}
        Errors: 400 invalid signature, 500 server error
      */
  }
}
