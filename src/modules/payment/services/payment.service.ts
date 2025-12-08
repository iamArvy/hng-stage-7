import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { IJwtUser } from 'src/common/types';
import { PaystackHttpClient } from 'src/integrations/paystack';
import { InitializePaymentResponse, PaymentStatusDto } from '../dto';
import { PaymentStatus } from 'src/generated/prisma/enums';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paystackClient: PaystackHttpClient,
    private readonly prisma: PrismaService,
  ) {}

  getPayments() {
    return this.prisma.payment.findMany();
  }

  async initializePayment(
    rUser: IJwtUser,
    amount: number,
    idempotency_key: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: rUser.id } });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.prisma.payment.findUnique({
      where: { idempotency_key },
    });

    if (existing) return new InitializePaymentResponse(existing);

    const response = await this.paystackClient.initializePayment(
      user.email,
      amount,
    );

    await this.prisma.payment.create({
      data: {
        amount,
        user: { connect: { id: user.id } },
        idempotency_key,
        reference: response.reference,
        authorization_url: response.authorization_url,
      },
    });

    return new InitializePaymentResponse(response);
  }

  async statusCheck(id: string, refresh: boolean) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    if (payment.status === PaymentStatus.PENDING || refresh) {
      const { status, paid_at } = await this.paystackClient.verifyPayment(
        payment.reference,
      );
      const updatedPayment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: this.mapPaystackStatus(status), paid_at },
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

  private mapPaystackStatus = (status: string): PaymentStatus => {
    switch (status) {
      case 'success':
        return PaymentStatus.SUCCESS;
      case 'failed':
        return PaymentStatus.FAILED;
      case 'abandoned':
        return PaymentStatus.ABANDONED;
      default:
        return PaymentStatus.PENDING;
    }
  };
}
