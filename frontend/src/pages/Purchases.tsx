import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { getPurchases, createPurchase, updatePurchase, deletePurchase, Purchase } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import PurchaseModal from '@/components/PurchaseModal';

export default function Purchases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const queryClient = useQueryClient();

  const { data: purchases, isLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: getPurchases,
  });

  const createMutation = useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Purchase> }) =>
      updatePurchase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setIsModalOpen(false);
      setEditingPurchase(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const filteredPurchases = purchases?.filter((purchase) =>
    purchase.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (data: Partial<Purchase>) => {
    if (editingPurchase) {
      updateMutation.mutate({ id: editingPurchase.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this purchase?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Purchases</h1>
          <p className="text-slate-600 mt-1">Track all product purchases</p>
        </div>
        <button
          onClick={() => {
            setEditingPurchase(null);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 inline mr-2" />
          Add Purchase
        </button>
      </div>

      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search purchases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filteredPurchases && filteredPurchases.length > 0 ? (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Company</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Quantity</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Price</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Total</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {formatDate(purchase.purchaseDate)}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-900">
                      {purchase.product?.name}
                      {purchase.notes && (
                        <p className="text-xs text-slate-500 mt-1">{purchase.notes}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-900">{purchase.company?.name}</td>
                    <td className="py-3 px-4 text-sm text-slate-900 text-right">{purchase.quantity}</td>
                    <td className="py-3 px-4 text-sm text-slate-900 text-right">
                      {formatCurrency(purchase.price)}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-slate-900 text-right">
                      {formatCurrency(purchase.totalCost)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(purchase)} className="text-primary-600 hover:text-primary-700">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(purchase.id)} className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-slate-500">No purchases found. Add your first purchase to start tracking prices!</p>
        </div>
      )}

      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPurchase(null);
        }}
        onSave={handleSave}
        purchase={editingPurchase}
      />
    </div>
  );
}
