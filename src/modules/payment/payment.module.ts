import { UserModule } from '../user/user.module';
import { PaymentModelAction } from './model-actions';
import { PaystackHttpClient } from './clients';

import { Module } from '@nestjs/common';
import { PaystackController } from './controllers';
import { PaystackService } from './services';

@Module({
  imports: [UserModule],
  controllers: [PaystackController],
  providers: [PaymentModelAction, PaystackService, PaystackHttpClient],
})
export class PaymentModule {}
