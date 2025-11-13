import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Purchase, getProducts, getCompanies } from '@/lib/api';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Purchase>) => void;
  purchase?: Purchase | null;
}

export default function PurchaseModal({ isOpen, onClose, onSave, purchase }: PurchaseModalProps) {
  const [formData, setFormData] = useState({
    productId: '',
    companyId: '',
    price: 0,
    quantity: 1,
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    enabled: isOpen,
  });

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
    enabled: isOpen,
  });

  useEffect(() => {
    if (purchase) {
      setFormData({
        productId: purchase.productId || '',
        companyId: purchase.companyId || '',
        price: purchase.price || 0,
        quantity: purchase.quantity || 1,
        purchaseDate: purchase.purchaseDate ? new Date(purchase.purchaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: purchase.notes || '',
      });
    } else {
      setFormData({
        productId: '',
        companyId: '',
        price: 0,
        quantity: 1,
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [purchase, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      purchaseDate: new Date(formData.purchaseDate).toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            {purchase ? 'Edit Purchase' : 'Add Purchase'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Product *</label>
            <select
              required
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="input"
            >
              <option value="">Select a product</option>
              {products?.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} {product.sku ? `(${product.sku})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Company *</label>
            <select
              required
              value={formData.companyId}
              onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
              className="input"
            >
              <option value="">Select a company</option>
              {companies?.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Price (USD) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="input"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="label">Quantity *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="input"
              />
            </div>

            <div>
              <label className="label">Purchase Date *</label>
              <input
                type="date"
                required
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Total Cost:</span>
              <span className="text-2xl font-bold text-slate-900">
                ${(formData.price * formData.quantity).toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input"
              rows={2}
              placeholder="Additional notes about this purchase..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {purchase ? 'Update Purchase' : 'Add Purchase'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
