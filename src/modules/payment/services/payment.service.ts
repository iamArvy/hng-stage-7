import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentModelAction } from '../model-actions';
import { PaystackService } from './paystack.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly modelAction: PaymentModelAction,
    private readonly paystack: PaystackService,
  ) {}

  getPayments() {
    return this.modelAction.findAll();
  }

  async statusCheck(id: string, refresh: boolean) {
    const payment = await this.modelAction.findOne({ id });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    if (payment.status === 'pending' || refresh) {
      const { status, paid_at } = await this.paystack.statusCheck(payment.id);
      const updatedPayment = await this.modelAction.update(
        { id: payment.id },
        { status, paid_at },
      );
      return updatedPayment;
    }
    return payment;
  }
}
