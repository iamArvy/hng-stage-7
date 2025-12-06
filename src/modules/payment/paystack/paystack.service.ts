import { Injectable } from '@nestjs/common';

@Injectable()
export class PaystackPaymentService {
  initializePayment() {
    /*
      Body JSON (example):
        {
          "amount": 5000,  // amount in Kobo (lowest currency unit)
        }
      Steps:
        Validate user and amount.
        Call Paystack Initialize Transaction API with secret key.
        Persist transaction with reference and initial status pending.
      Response: 201
        { 
          "reference": "...", 
          "authorization_url": "https://paystack.co/checkout/...." 
        }
      Errors: 400 invalid input, 402 payment initiation failed by Paystack, 500
    */
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

  statusCheck() {
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
  }
}
