import { Router } from 'express';
import prisma from '../db';
import { z } from 'zod';

export const productsRouter = Router();

const productSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  description: z.string().optional(),
  unit: z.string().default('piece'),
  sku: z.string().optional(),
  minStock: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

// Get all products
productsRouter.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        purchases: {
          include: {
            company: true,
          },
          orderBy: {
            purchaseDate: 'desc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
productsRouter.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        purchases: {
          include: {
            company: true,
          },
          orderBy: {
            purchaseDate: 'desc',
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
productsRouter.post('/', async (req, res) => {
  try {
    const data = productSchema.parse(req.body);
    const product = await prisma.product.create({
      data,
    });
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
productsRouter.put('/:id', async (req, res) => {
  try {
    const data = productSchema.partial().parse(req.body);
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
    });
    res.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
productsRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});
