import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaystackService } from '../services/paystack.service';
import { InitializePaymentRequestDto } from '../dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { IJwtUser, IRequestWithUser } from 'src/common/types';
import { AuthGuard } from '@nestjs/passport';

@Controller('payments/paystack')
export class PaystackController {
  constructor(private readonly service: PaystackService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('initialize')
  initializePayment(
    @Req() req: IRequestWithUser<IJwtUser>,
    @Body() { amount }: InitializePaymentRequestDto,
  ) {
    return this.service.initializePayment(req.user, amount);
  }

  @Post('webhook')
  webhookHandler() {
    return this.service.webhookHandler();
  }
}
