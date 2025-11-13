import { Router } from 'express';
import prisma from '../db';
import { z } from 'zod';

export const companiesRouter = Router();

const companySchema = z.object({
  name: z.string().min(1),
  contact: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

// Get all companies
companiesRouter.get('/', async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        purchases: {
          include: {
            product: true,
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
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get company by ID
companiesRouter.get('/:id', async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
      include: {
        purchases: {
          include: {
            product: true,
          },
          orderBy: {
            purchaseDate: 'desc',
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Create company
companiesRouter.post('/', async (req, res) => {
  try {
    const data = companySchema.parse(req.body);
    const company = await prisma.company.create({
      data,
    });
    res.status(201).json(company);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// Update company
companiesRouter.put('/:id', async (req, res) => {
  try {
    const data = companySchema.partial().parse(req.body);
    const company = await prisma.company.update({
      where: { id: req.params.id },
      data,
    });
    res.json(company);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// Delete company
companiesRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.company.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete company' });
  }
});
