import { PaymentModelAction } from './model-actions';
import { PaystackHttpClient } from './clients';

import { Module } from '@nestjs/common';
import { PaymentService } from './services';
import { PaymentController } from './controllers/payment.controller';

@Module({
  controllers: [PaymentController],
  providers: [PaymentModelAction, PaymentService, PaystackHttpClient],
})
export class PaymentModule {}
