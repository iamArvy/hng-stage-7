import { UserModelAction } from 'src/modules/user/model-actions/user.model-action';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaystackHttpClient } from '../clients';
import { PaymentModelAction } from '../model-actions';
import { InitializePaymentResponseDto, VerifyPaymentResponseDto } from '../dto';
import { IJwtUser } from 'src/common/types';

@Injectable()
export class PaystackService {
  constructor(
    private readonly client: PaystackHttpClient,
    private readonly modelAction: PaymentModelAction,
    private readonly UserModelAction: UserModelAction,
  ) {}

  async initializePayment(rUser: IJwtUser, amount: number) {
    const user = await this.UserModelAction.findOne({ id: rUser.id });
    if (!user) throw new NotFoundException('User not found');

    const payment = await this.modelAction.create({
      amount,
      user: { connect: { id: user.id } },
    });

    const response = await this.client.request<InitializePaymentResponseDto>({
      method: 'POST',
      url: '/transaction/initialize',
      data: { email: user.email, amount, reference: payment.id },
    });

    return response.data;
  }

  webhookHandler() {
    /*
      Purpose: Receive transaction updates from Paystack.
      Security: Validate Paystack signature header (e.g. x-paystack-signature) using configured webhook secret.
      Steps:
        Verify signature.
        Parse event payload; find transaction reference.
        Update transaction status in DB (success, failed, pending, etc.).
      Response: 200
        {"status": true}
      Errors: 400 invalid signature, 500 server error
    */
  }

  async statusCheck(reference: string) {
    /*
      Purpose: Return the latest status for reference.
      Behavior: Return DB status. If missing or caller requests refresh=true, call Paystack verify endpoint to fetch live status and update DB.
      Response: 200
        { 
          "reference": "...", 
          "status": "success|failed|pending", 
          "amount": 5000, 
          "paid_at": "..." 
        }
    */
    const response = await this.client.request<VerifyPaymentResponseDto>({
      method: 'GET',
      url: 'transaction/verify/' + reference,
    });

    return response.data;
  }
}
