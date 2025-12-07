import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentModelAction } from '../model-actions';
import { PrismaService } from 'src/db/prisma.service';
import { PaystackHttpClient } from '../clients';
import { IJwtUser } from 'src/common/types';
import { InitializePaymentResponseDto } from '../dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly modelAction: PaymentModelAction,
    private readonly paystackClient: PaystackHttpClient,
    private readonly prisma: PrismaService,
  ) {}

  getPayments() {
    return this.modelAction.findAll();
  }

  async initializePayment(rUser: IJwtUser, amount: number) {
    const user = await this.prisma.user.findUnique({ where: { id: rUser.id } });
    if (!user) throw new NotFoundException('User not found');

    const payment = await this.modelAction.create({
      amount,
      user: { connect: { id: user.id } },
    });

    const response =
      await this.paystackClient.request<InitializePaymentResponseDto>({
        method: 'POST',
        url: '/transaction/initialize',
        data: { email: user.email, amount, reference: payment.id },
      });

    return response.data;
  }

  async statusCheck(id: string, refresh: boolean) {
    const payment = await this.modelAction.findOne({ id });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    if (payment.status === 'pending' || refresh) {
      const { status, paid_at } = await this.paystackClient.verifyPayment(
        payment.id,
      );
      const updatedPayment = await this.modelAction.update(
        { id: payment.id },
        { status, paid_at },
      );
      return updatedPayment;
    }
    return payment;
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
