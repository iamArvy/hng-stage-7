import { Body, Controller, Get, Param } from '@nestjs/common';
import { PaymentService } from '../services';

@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Get()
  getPayments() {
    return this.service.getPayments();
  }

  @Get(':id/status')
  statusCheck(@Param('id') id: string, @Body('refresh') refresh: boolean) {
    return this.service.statusCheck(id, refresh);
  }
}
