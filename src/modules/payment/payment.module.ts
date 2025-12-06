import { Module } from '@nestjs/common';
import { PaystackPaymentController, PaystackPaymentService } from './paystack';

@Module({
  controllers: [PaystackPaymentController],
  providers: [PaystackPaymentService],
})
export class PaymentModule {}
