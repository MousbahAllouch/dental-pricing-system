import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react';
import { getProduct, getPriceComparison } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });

  const { data: priceComparison, isLoading: comparisonLoading } = useQuery({
    queryKey: ['price-comparison', id],
    queryFn: () => getPriceComparison(id!),
    enabled: !!id,
  });

  if (productLoading || comparisonLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="card text-center py-12">
        <p className="text-slate-500">Product not found</p>
        <Link to="/products" className="btn-primary mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/products" className="inline-flex items-center text-primary-600 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Link>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
            {product.category && (
              <span className="inline-block mt-2 px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 rounded">
                {product.category}
              </span>
            )}
          </div>
        </div>

        {product.description && (
          <p className="text-slate-600 mb-4">{product.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {product.sku && (
            <div>
              <span className="text-sm text-slate-600">SKU</span>
              <p className="font-semibold text-slate-900">{product.sku}</p>
            </div>
          )}
          <div>
            <span className="text-sm text-slate-600">Unit</span>
            <p className="font-semibold text-slate-900">{product.unit}</p>
          </div>
          {product.minStock !== null && (
            <div>
              <span className="text-sm text-slate-600">Min Stock</span>
              <p className="font-semibold text-slate-900">{product.minStock}</p>
            </div>
          )}
        </div>
      </div>

      {priceComparison && priceComparison.companies.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Price Comparison</h2>

          {priceComparison.bestPrice && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <TrendingDown className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Best Price</span>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(priceComparison.bestPrice.latestPrice)}
                </p>
                <p className="text-sm text-green-700">{priceComparison.bestPrice.company.name}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {priceComparison.companies.map((item, index) => {
              const isBest = index === 0;
              const isWorst = index === priceComparison.companies.length - 1 && priceComparison.companies.length > 1;

              return (
                <div
                  key={item.company.id}
                  className={`border rounded-lg p-4 ${
                    isBest ? 'border-green-300 bg-green-50' : 'border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.company.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Last purchase: {formatDate(item.latestPurchaseDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end">
                        {isBest && <TrendingDown className="h-4 w-4 text-green-600 mr-1" />}
                        {isWorst && <TrendingUp className="h-4 w-4 text-red-600 mr-1" />}
                        <p className="text-2xl font-bold text-slate-900">
                          {formatCurrency(item.latestPrice)}
                        </p>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        Avg: {formatCurrency(item.averagePrice)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-4 text-sm text-slate-600">
                    <span>Total purchases: {item.totalPurchases}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {product.purchases && product.purchases.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Purchase History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Company</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Quantity</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Price</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Total</th>
                </tr>
              </thead>
              <tbody>
                {product.purchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-600">{formatDate(purchase.purchaseDate)}</td>
                    <td className="py-3 px-4 text-sm text-slate-900">{purchase.company?.name}</td>
                    <td className="py-3 px-4 text-sm text-slate-900 text-right">{purchase.quantity}</td>
                    <td className="py-3 px-4 text-sm text-slate-900 text-right">
                      {formatCurrency(purchase.price)}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-slate-900 text-right">
                      {formatCurrency(purchase.totalCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
