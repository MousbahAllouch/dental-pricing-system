import { Router } from 'express';
import prisma from '../db';
import { z } from 'zod';

export const purchasesRouter = Router();

const purchaseSchema = z.object({
  productId: z.string(),
  companyId: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive().default(1),
  purchaseDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

// Get all purchases
purchasesRouter.get('/', async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        product: true,
        company: true,
      },
      orderBy: {
        purchaseDate: 'desc',
      },
    });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

// Get purchase by ID
purchasesRouter.get('/:id', async (req, res) => {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id: req.params.id },
      include: {
        product: true,
        company: true,
      },
    });

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    res.json(purchase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase' });
  }
});

// Create purchase
purchasesRouter.post('/', async (req, res) => {
  try {
    const data = purchaseSchema.parse(req.body);
    const totalCost = data.price * data.quantity;

    const purchase = await prisma.purchase.create({
      data: {
        ...data,
        totalCost,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : new Date(),
      },
      include: {
        product: true,
        company: true,
      },
    });
    res.status(201).json(purchase);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create purchase' });
  }
});

// Update purchase
purchasesRouter.put('/:id', async (req, res) => {
  try {
    const data = purchaseSchema.partial().parse(req.body);

    // Recalculate totalCost if price or quantity changed
    let totalCost: number | undefined;
    if (data.price !== undefined || data.quantity !== undefined) {
      const existing = await prisma.purchase.findUnique({
        where: { id: req.params.id },
      });
      if (!existing) {
        return res.status(404).json({ error: 'Purchase not found' });
      }
      const price = data.price ?? existing.price;
      const quantity = data.quantity ?? existing.quantity;
      totalCost = price * quantity;
    }

    const purchase = await prisma.purchase.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(totalCost !== undefined && { totalCost }),
        ...(data.purchaseDate && { purchaseDate: new Date(data.purchaseDate) }),
      },
      include: {
        product: true,
        company: true,
      },
    });
    res.json(purchase);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update purchase' });
  }
});

// Delete purchase
purchasesRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.purchase.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete purchase' });
  }
});
