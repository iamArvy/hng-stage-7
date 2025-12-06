import { Body, Controller, Get } from '@nestjs/common';
import { PaymentService } from '../services';

@Controller('payment')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Get('')
  getPayments() {
    return this.service.getPayments();
  }

  @Get(':id/status')
  statusCheck() {
    return this.service.statusCheck();
  }
}
