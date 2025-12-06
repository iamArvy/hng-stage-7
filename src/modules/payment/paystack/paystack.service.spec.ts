import { Test, TestingModule } from '@nestjs/testing';
import { PaystackPaymentService } from './paystack.service';

describe('PaystackPaymentService', () => {
  let service: PaystackPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaystackPaymentService],
    }).compile();

    service = module.get<PaystackPaymentService>(PaystackPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
