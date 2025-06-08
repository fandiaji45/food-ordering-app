import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PaymentMethodData {
  name: string;
  details?: string;
  isActive?: boolean;
}

export async function createPaymentMethod(data: PaymentMethodData) {
  return prisma.paymentMethod.create({ data });
}

export async function updatePaymentMethod(id: number, data: Partial<PaymentMethodData>) {
  return prisma.paymentMethod.update({
    where: { id },
    data,
  });
}
