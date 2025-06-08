import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { createPaymentMethod, updatePaymentMethod } from '../services/paymentMethodService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Add payment method
router.post('/', authenticate, authorize(['ADMIN']), async (req, res) => {
  const { name, details } = req.body;

  if (!name || !details) {
     res.status(400).json({ error: 'Name and details are required' });
     return
  }

  try {
    const paymentMethod = await prisma.paymentMethod.create({
      data: { name, details },
    });
    res.status(201).json(paymentMethod);
  } catch (err: any) {
    console.error('Create Payment Method Error:', err); // <= LOG DETAIL ERROR
    res.status(500).json({ error: 'Failed to create payment method', detail: err.message }); // <= TAMBAHKAN DETAIL
  }
})

// Modify payment method
router.put('/:id', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, details, isActive } = req.body;

  try {
    const paymentMethod = await updatePaymentMethod(id, { name, details, isActive });
    res.status(200).json(paymentMethod);
  } catch (error: any) {
    console.error('Update Payment Method Error:', error);
    res.status(500).json({ error: 'Failed to update payment method' });
  }
});

export default router;
