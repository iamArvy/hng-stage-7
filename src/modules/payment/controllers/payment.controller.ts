import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  // Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from '../services';
import type { IJwtUser, IRequestWithUser } from 'src/common/types';
import {
  InitializePaymentRequestDto,
  InitializePaymentResponse,
  PaymentResponseDto,
  PaymentStatusDto,
} from '../dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/modules/auth/guards';

@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all payments' })
  @ApiOkResponse({
    description: 'Returns all payments',
    type: PaymentResponseDto,
    isArray: true,
  })
  @Get()
  getPayments() {
    return this.service.getPayments();
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initialize a payment' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiCreatedResponse({
    description: 'Payment Created',
    type: InitializePaymentResponse,
  })
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

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check the status of a payment' })
  @ApiOkResponse({
    description: 'Returns the status of the payment',
    type: PaymentStatusDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @Get(':id/status')
  statusCheck(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('refresh') refresh: boolean,
  ) {
    return this.service.statusCheck(id, refresh);
  }
}
