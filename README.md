# Dental Product Pricing System

A professional web application to help dental clinics track and compare product prices from different suppliers.

## Features

- **Product Management**: Add, edit, and organize dental products with categories, SKUs, and descriptions
- **Supplier Management**: Maintain detailed records of supplier companies with contact information
- **Purchase Tracking**: Record every purchase with price, quantity, date, and notes
- **Price Comparison**: Automatically compare prices across different suppliers for each product
- **Analytics Dashboard**: View statistics, recent purchases, and spending trends
- **Modern UI**: Clean, professional interface built with React and Tailwind CSS

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for modern styling
- **React Query** for data fetching and caching
- **React Router** for navigation
- **Lucide Icons** for beautiful icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma ORM** for database operations
- **Zod** for validation

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** (comes with Node.js)

## Installation

### 1. Clone or Navigate to the Project

```bash
cd "/Users/mousbah/Documents/programming/msdc/product pricing"
```

### 2. Install Dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Set Up PostgreSQL Database

First, create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE dental_pricing;

# Exit psql
\q
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update the DATABASE_URL with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/dental_pricing?schema=public"
PORT=3001
NODE_ENV=development
```

Replace `USERNAME` and `PASSWORD` with your PostgreSQL credentials.

### 5. Initialize the Database

```bash
cd backend
npm run db:push
npm run db:generate
```

### 6. Start the Application

From the root directory, you can start both frontend and backend simultaneously:

```bash
npm run dev
```

Or start them separately:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## Usage Guide

### 1. Add Companies (Suppliers)

First, add your supplier companies:
1. Navigate to **Companies** page
2. Click **Add Company**
3. Fill in company details (name, contact info, etc.)
4. Save

### 2. Add Products

Add products to your catalog:
1. Navigate to **Products** page
2. Click **Add Product**
3. Enter product details:
   - Name (required)
   - Category (e.g., "Restorative Materials")
   - Description
   - SKU
   - Unit (piece, box, bottle, etc.)
   - Minimum stock level
4. Save

### 3. Record Purchases

Track purchases from suppliers:
1. Navigate to **Purchases** page
2. Click **Add Purchase**
3. Select product and company
4. Enter price, quantity, and date
5. Add notes if needed
6. Save

### 4. Compare Prices

View price comparisons:
1. Navigate to **Products** page
2. Click **View** on any product
3. See the **Price Comparison** section showing:
   - Best price highlighted in green
   - All suppliers with their latest and average prices
   - Purchase history

### 5. View Dashboard

The dashboard shows:
- Total products, companies, and purchases
- Total amount spent
- Recent purchase activity

## Database Schema

### Products Table
- Product information (name, category, description)
- SKU and unit of measurement
- Minimum stock levels

### Companies Table
- Company/supplier information
- Contact details (email, phone, address)
- Contact person name

### Purchases Table
- Links products to companies
- Price and quantity information
- Purchase date and notes
- Automatic total cost calculation

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company by ID
- `POST /api/companies` - Create company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

### Purchases
- `GET /api/purchases` - Get all purchases
- `GET /api/purchases/:id` - Get purchase by ID
- `POST /api/purchases` - Create purchase
- `PUT /api/purchases/:id` - Update purchase
- `DELETE /api/purchases/:id` - Delete purchase

### Analytics
- `GET /api/analytics/stats` - Get overall statistics
- `GET /api/analytics/product/:id/price-comparison` - Get price comparison for product
- `GET /api/analytics/top-products` - Get top products by spending

## Development

### Backend Development

```bash
cd backend

# Run in development mode with auto-reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Open Prisma Studio (Database GUI)
npm run db:studio
```

### Frontend Development

```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Verify PostgreSQL is running:
   ```bash
   # macOS
   brew services list

   # Start PostgreSQL if needed
   brew services start postgresql@14
   ```

2. Check your DATABASE_URL in `backend/.env`
3. Ensure the database exists:
   ```bash
   psql -U postgres -l
   ```

### Port Already in Use

If ports 3000 or 3001 are already in use:

1. Change the port in `backend/.env` (for backend)
2. Change the port in `frontend/vite.config.ts` (for frontend)

### Module Not Found Errors

If you see "module not found" errors:

```bash
# Reinstall all dependencies
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Production Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Run database migrations: `npm run db:push`
3. Build the application: `npm run build`
4. Start the server: `npm start`

### Frontend Deployment

1. Update the API URL in the frontend if needed
2. Build for production: `npm run build`
3. Deploy the `dist` folder to your hosting platform (Vercel, Netlify, etc.)

## Future Enhancements

Potential features to add:
- User authentication and multi-user support
- Export data to Excel/CSV
- Product inventory tracking
- Automated price alerts
- Purchase order generation
- Charts and graphs for price trends
- Mobile app version

## License

This project is created for dental clinic use.

## Support

For issues or questions, please refer to the documentation or contact your system administrator.
