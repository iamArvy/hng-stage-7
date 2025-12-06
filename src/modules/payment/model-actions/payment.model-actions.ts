import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class PaymentModelAction {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.PaymentCreateInput) {
    return this.prisma.payment.create({ data });
  }

  findAll() {
    return this.prisma.payment.findMany();
  }

  findOne(where: Prisma.PaymentWhereUniqueInput) {
    return this.prisma.payment.findUnique({ where });
  }

  update(
    where: Prisma.PaymentWhereUniqueInput,
    data: Prisma.PaymentUpdateInput,
  ) {
    return this.prisma.payment.update({ where, data });
  }

  delete(where: Prisma.PaymentWhereUniqueInput) {
    return this.prisma.payment.delete({ where });
  }
  // Define payment model actions here
}
