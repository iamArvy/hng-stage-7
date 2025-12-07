import { ApiProperty } from '@nestjs/swagger';

export class PaymentStatusDto {
  @ApiProperty({ description: 'Payment status', example: 'success' })
  status: string;
}
