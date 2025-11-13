import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { getCompanies, createCompany, updateCompany, deleteCompany, Company } from '@/lib/api';
import CompanyModal from '@/components/CompanyModal';

export default function Companies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const queryClient = useQueryClient();

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
  });

  const createMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) =>
      updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsModalOpen(false);
      setEditingCompany(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  const filteredCompanies = companies?.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (data: Partial<Company>) => {
    if (editingCompany) {
      updateMutation.mutate({ id: editingCompany.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Companies</h1>
          <p className="text-slate-600 mt-1">Manage your supplier companies</p>
        </div>
        <button
          onClick={() => {
            setEditingCompany(null);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 inline mr-2" />
          Add Company
        </button>
      </div>

      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filteredCompanies && filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{company.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(company)} className="btn btn-secondary text-sm">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(company.id)} className="btn btn-danger text-sm">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {company.contact && (
                <p className="text-sm text-slate-600 mb-3">Contact: {company.contact}</p>
              )}

              <div className="space-y-2">
                {company.email && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <a href={`mailto:${company.email}`} className="hover:text-primary-600">
                      {company.email}
                    </a>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <a href={`tel:${company.phone}`} className="hover:text-primary-600">
                      {company.phone}
                    </a>
                  </div>
                )}
                {company.address && (
                  <div className="flex items-start text-sm text-slate-600">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{company.address}</span>
                  </div>
                )}
              </div>

              {company.purchases && company.purchases.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">{company.purchases.length}</span> purchase
                    {company.purchases.length !== 1 ? 's' : ''} on record
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-slate-500">No companies found. Add your first supplier to get started!</p>
        </div>
      )}

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCompany(null);
        }}
        onSave={handleSave}
        company={editingCompany}
      />
    </div>
  );
}
