import { Module } from '@nestjs/common';
import { PaymentService } from './services';
import { PaymentController } from './controllers/payment.controller';
import { PaystackHttpClient } from 'src/integrations/paystack';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaystackHttpClient],
})
export class PaymentModule {}
