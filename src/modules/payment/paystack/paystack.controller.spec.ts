import { Test, TestingModule } from '@nestjs/testing';
import { PaystackPaymentController } from './paystack.controller';
import { PaystackPaymentService } from './paystack.service';

describe('PaystackPaymentController', () => {
  let controller: PaystackPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaystackPaymentController],
      providers: [PaystackPaymentService],
    }).compile();

    controller = module.get<PaystackPaymentController>(
      PaystackPaymentController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
