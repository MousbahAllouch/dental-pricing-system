import axios from 'axios';

// Use environment variable for API URL in production, fallback to proxy in development
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  id: string;
  name: string;
  category?: string;
  description?: string;
  unit: string;
  sku?: string;
  minStock?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  purchases?: Purchase[];
}

export interface Company {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  purchases?: Purchase[];
}

export interface Purchase {
  id: string;
  productId: string;
  companyId: string;
  price: number;
  quantity: number;
  totalCost: number;
  purchaseDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  company?: Company;
}

export interface Stats {
  totalProducts: number;
  totalCompanies: number;
  totalPurchases: number;
  totalSpent: number;
  recentPurchases: Purchase[];
}

export interface PriceComparison {
  productId: string;
  companies: {
    company: Company;
    latestPrice: number;
    latestPurchaseDate: string;
    averagePrice: number;
    totalPurchases: number;
  }[];
  bestPrice: {
    company: Company;
    latestPrice: number;
  } | null;
}

// Products
export const getProducts = () => api.get<Product[]>('/products').then(res => res.data);
export const getProduct = (id: string) => api.get<Product>(`/products/${id}`).then(res => res.data);
export const createProduct = (data: Partial<Product>) => api.post<Product>('/products', data).then(res => res.data);
export const updateProduct = (id: string, data: Partial<Product>) => api.put<Product>(`/products/${id}`, data).then(res => res.data);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);

// Companies
export const getCompanies = () => api.get<Company[]>('/companies').then(res => res.data);
export const getCompany = (id: string) => api.get<Company>(`/companies/${id}`).then(res => res.data);
export const createCompany = (data: Partial<Company>) => api.post<Company>('/companies', data).then(res => res.data);
export const updateCompany = (id: string, data: Partial<Company>) => api.put<Company>(`/companies/${id}`, data).then(res => res.data);
export const deleteCompany = (id: string) => api.delete(`/companies/${id}`);

// Purchases
export const getPurchases = () => api.get<Purchase[]>('/purchases').then(res => res.data);
export const getPurchase = (id: string) => api.get<Purchase>(`/purchases/${id}`).then(res => res.data);
export const createPurchase = (data: Partial<Purchase>) => api.post<Purchase>('/purchases', data).then(res => res.data);
export const updatePurchase = (id: string, data: Partial<Purchase>) => api.put<Purchase>(`/purchases/${id}`, data).then(res => res.data);
export const deletePurchase = (id: string) => api.delete(`/purchases/${id}`);

// Analytics
export const getStats = () => api.get<Stats>('/analytics/stats').then(res => res.data);
export const getPriceComparison = (productId: string) =>
  api.get<PriceComparison>(`/analytics/product/${productId}/price-comparison`).then(res => res.data);
export const getTopProducts = (limit = 10) =>
  api.get(`/analytics/top-products?limit=${limit}`).then(res => res.data);

export default api;
