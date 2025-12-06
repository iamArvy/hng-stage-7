import { Controller, Get, Post } from '@nestjs/common';
import { PaystackPaymentService } from './paystack.service';

@Controller('payment')
export class PaystackPaymentController {
  constructor(private readonly service: PaystackPaymentService) {}

  @Post('initialize')
  initializePayment() {
    return this.service.initializePayment();
  }

  @Post('webhook')
  webhookHandler() {
    return this.service.webhookHandler();
  }

  @Get('status')
  statusCheck() {
    return this.service.statusCheck();
  }
}
