import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PaymentStatusDto {
  @Expose()
  @ApiProperty({ description: 'Payment status', example: 'success' })
  status: string;

  constructor(partial: Partial<PaymentStatusDto>) {
    Object.assign(this, partial);
  }
}
