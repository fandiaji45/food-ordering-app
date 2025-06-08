import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { User } from '../types/User';

const prisma = new PrismaClient();

export interface RequestWithUser extends Request {
  user?: User;
}

export const createOrder = async (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: user not found' });
  }

  const userId = req.user.id;
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order items are required' });
  }

  try {
    let total = 0;

    // Hitung total dan siapkan data orderItem
    const orderItemsData = await Promise.all(
      items.map(async (item: { menuId: number; quantity: number }) => {
        const menu = await prisma.menu.findUnique({
          where: { id: item.menuId },
        });

        if (!menu) {
          throw new Error(`Menu with ID ${item.menuId} not found`);
        }

        const subtotal = menu.price * item.quantity;
        total += subtotal;

        return {
          menuId: item.menuId,
          quantity: item.quantity,
        };
      })
    );

    // Buat order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING', // Optional: tambahkan status awal
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return res.status(201).json(order);
  } catch (error: any) {
    console.error('Order creation error:', error);
    return res.status(500).json({ error: error.message });
  }
};
