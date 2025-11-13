import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { productsRouter } from './routes/products';
import { companiesRouter } from './routes/companies';
import { purchasesRouter } from './routes/purchases';
import { analyticsRouter } from './routes/analytics';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Check if origin is allowed or if it's a Railway/Vercel deployment
    if (allowedOrigins.includes(origin) ||
        origin.includes('.railway.app') ||
        origin.includes('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now, restrict later if needed
    }
  },
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/purchases', purchasesRouter);
app.use('/api/analytics', analyticsRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at /api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
