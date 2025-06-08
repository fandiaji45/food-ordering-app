import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (userId: number, items: { menuId: number, quantity: number }[]) => {
  let total = 0;

  const orderItemsData = await Promise.all(items.map(async (item) => {
    const menu = await prisma.menu.findUnique({ where: { id: item.menuId } });
    if (!menu) throw new Error(`Menu with ID ${item.menuId} not found`);

    total += menu.price * item.quantity;

    return {
      menuId: item.menuId,
      quantity: item.quantity,
    };
  }));

  const order = await prisma.order.create({
    data: {
      userId,
      status: 'PENDING', // ← Tambahkan status default, misalnya 'PENDING'
      total,             // ← Tambahkan total hasil hitungan
      items: {
        create: orderItemsData,
      },
    },
    include: {
      items: true,
    },
  });

  return order;
};
