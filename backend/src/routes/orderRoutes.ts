import express, { Request, Response } from 'express';
import { createOrder } from '../services/orderService';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { User } from '../types/User';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = express.Router();

interface RequestWithUser extends Request {
  user?: User;
}

// POST /api/orders
//PENDING
router.post('/', authenticate, authorize(['ADMIN', 'MANAGER']), async (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized: user not found' });
    return;
  }

  const userId = req.user.id;
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    res.status(400).json({ error: 'Items must be an array' });
    return;
  }

  try {
    const order = await createOrder(userId, items);
    res.status(201).json(order);
  } catch (error: any) {
    console.error('Create Order Error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

//PAID
router.post('/checkout/:orderId', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
        include: {
        items: true,
      }
    });

    if (!order) {
       res.status(404).json({ error: 'Order not found' });
       return
    }

    if (order.status === 'PAID') {
       res.status(400).json({ error: 'Order already paid' });
       return
    }

    const updated = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: 'PAID' },
      include: {
        items: true,
      },
    });

     res.status(200).json({ message: 'Order checked out successfully', order: updated });

  } catch (err: any) {
    console.error('Checkout Error:', err);
    res.status(500).json({ error: 'Failed to checkout' });
  }
});


//cancel
router.post('/cancel/:orderId', authenticate, authorize(['ADMIN', 'MANAGER']), async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
    });

    if (!order) {
       res.status(404).json({ error: 'Order not found' });
       return
    }

    if (order.status === 'CANCELED') {
       res.status(400).json({ error: 'Order already canceled' });
       return
    }

    if (order.status === 'PAID') {
       res.status(400).json({ error: 'Cannot cancel a paid order' });
       return
    }

    const canceledOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: 'CANCELED' },
    });

    res.status(200).json({ message: 'Order canceled successfully', order: canceledOrder });

  } catch (err: any) {
    console.error('Cancel Order Error:', err);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

export default router;
