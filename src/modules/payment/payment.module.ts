import { UserModule } from '../user/user.module';
import { PaymentModelAction } from './model-actions';
import { PaystackHttpClient } from './clients';

import { Module } from '@nestjs/common';
import { PaystackController } from './controllers';
import { PaymentService, PaystackService } from './services';
import { PaymentController } from './controllers/payment.controller';

@Module({
  imports: [UserModule],
  controllers: [PaymentController, PaystackController],
  providers: [
    PaymentModelAction,
    PaymentService,
    PaystackService,
    PaystackHttpClient,
  ],
})
export class PaymentModule {}
