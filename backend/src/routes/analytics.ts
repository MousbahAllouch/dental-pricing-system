import { Router } from 'express';
import prisma from '../db';

export const analyticsRouter = Router();

// Get price comparison for a specific product
analyticsRouter.get('/product/:productId/price-comparison', async (req, res) => {
  try {
    const { productId } = req.params;

    const purchases = await prisma.purchase.findMany({
      where: { productId },
      include: {
        company: true,
      },
      orderBy: {
        purchaseDate: 'desc',
      },
    });

    // Group by company and get latest price
    const pricesByCompany = purchases.reduce((acc, purchase) => {
      if (!acc[purchase.companyId]) {
        acc[purchase.companyId] = {
          company: purchase.company,
          latestPrice: purchase.price,
          latestPurchaseDate: purchase.purchaseDate,
          averagePrice: purchase.price,
          totalPurchases: 1,
          prices: [purchase.price],
        };
      } else {
        acc[purchase.companyId].prices.push(purchase.price);
        acc[purchase.companyId].totalPurchases++;
        acc[purchase.companyId].averagePrice =
          acc[purchase.companyId].prices.reduce((a: number, b: number) => a + b, 0) /
          acc[purchase.companyId].prices.length;
      }
      return acc;
    }, {} as any);

    const comparison = Object.values(pricesByCompany).sort(
      (a: any, b: any) => a.latestPrice - b.latestPrice
    );

    res.json({
      productId,
      companies: comparison,
      bestPrice: comparison.length > 0 ? comparison[0] : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get price comparison' });
  }
});

// Get overall statistics
analyticsRouter.get('/stats', async (req, res) => {
  try {
    const [
      totalProducts,
      totalCompanies,
      totalPurchases,
      recentPurchases,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.company.count(),
      prisma.purchase.count(),
      prisma.purchase.findMany({
        take: 10,
        include: {
          product: true,
          company: true,
        },
        orderBy: {
          purchaseDate: 'desc',
        },
      }),
    ]);

    const totalSpent = await prisma.purchase.aggregate({
      _sum: {
        totalCost: true,
      },
    });

    res.json({
      totalProducts,
      totalCompanies,
      totalPurchases,
      totalSpent: totalSpent._sum.totalCost || 0,
      recentPurchases,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Get top products by spending
analyticsRouter.get('/top-products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const products = await prisma.product.findMany({
      include: {
        purchases: true,
      },
    });

    const productStats = products.map(product => ({
      ...product,
      totalSpent: product.purchases.reduce((sum, p) => sum + p.totalCost, 0),
      totalQuantity: product.purchases.reduce((sum, p) => sum + p.quantity, 0),
      purchaseCount: product.purchases.length,
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);

    res.json(productStats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get top products' });
  }
});
