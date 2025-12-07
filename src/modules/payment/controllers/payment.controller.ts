import {
  Body,
  Controller,
  Get,
  // Headers,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from '../services';
import type { IJwtUser, IRequestWithUser } from 'src/common/types';
import { InitializePaymentRequestDto } from '../dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/modules/auth/guards';

@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Get()
  getPayments() {
    return this.service.getPayments();
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Post('paystack/initialize')
  initializePayment(
    @Req() req: IRequestWithUser<IJwtUser>,
    @Body() { amount }: InitializePaymentRequestDto,
  ) {
    return this.service.initializePayment(req.user, amount);
  }

  // @Post('webhook')
  // paystackWebhookHandler(
  //   @Headers('x-paystack-signature') signature: string,
  //   @Body() body: any,
  // ) {
  //   return this.service.webhookHandler(signature, body);
  // }

  @Get(':id/status')
  statusCheck(@Param('id') id: string, @Body('refresh') refresh: boolean) {
    return this.service.statusCheck(id, refresh);
  }
}
