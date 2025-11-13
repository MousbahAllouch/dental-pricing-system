import { useQuery } from '@tanstack/react-query';
import { Package, Building2, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { getStats } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Companies',
      value: stats?.totalCompanies || 0,
      icon: Building2,
      color: 'bg-green-500',
    },
    {
      title: 'Total Purchases',
      value: stats?.totalPurchases || 0,
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Spent',
      value: formatCurrency(stats?.totalSpent || 0),
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Overview of your dental product pricing system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
          <h2 className="text-xl font-bold text-slate-900">Recent Purchases</h2>
        </div>

        {stats?.recentPurchases && stats.recentPurchases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Company</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Quantity</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Price</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPurchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-900">{purchase.product?.name}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{purchase.company?.name}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{formatDate(purchase.purchaseDate)}</td>
                    <td className="py-3 px-4 text-sm text-slate-900 text-right">{purchase.quantity}</td>
                    <td className="py-3 px-4 text-sm text-slate-900 text-right">{formatCurrency(purchase.price)}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-slate-900 text-right">
                      {formatCurrency(purchase.totalCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No purchases yet. Start by adding products and companies!</p>
        )}
      </div>
    </div>
  );
}
