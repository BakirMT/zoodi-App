import React, { useState } from 'react';
import {
  Search,
  Plus,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { ProductImage } from '../../components/ProductImage';

export const AdminProducts: React.FC = () => {
  const { products, deleteProduct, showToast } = useApp();
  const { setAdminTab, setSelectedAdminProductId, categories: adminCats } = useAdmin();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const categoryOptions = [
    'All',
    ...Array.from(new Set([...adminCats.map((c) => c.name), ...products.map((p) => p.category)])),
  ];

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from store?`)) {
      deleteProduct(id);
      showToast(`Removed "${name}" from catalog.`);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your store catalog, pricing, and stock inventory
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAdminTab('add_product')}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs shadow-md shadow-rose-900/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categoryOptions.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCat(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCat === c
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-pink-500'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State vs Products Table */}
      {filtered.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <Plus className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {products.length === 0 ? 'No products in your catalog yet' : 'No products match your search'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
              {products.length === 0
                ? 'Get started by uploading your first product with multiple photos, color variants, size options, and pricing.'
                : 'Try adjusting your search query or switching categories.'}
            </p>
          </div>
          {products.length === 0 ? (
            <button
              type="button"
              onClick={() => setAdminTab('add_product')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#DF1951] text-white text-xs font-bold shadow-md hover:bg-[#BE123C] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Your First Product</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCat('All');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((prod) => (
                  <tr
                    key={prod.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <ProductImage
                          src={prod.image}
                          alt={prod.name}
                          category={prod.category}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {prod.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{prod.subcategory}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {prod.category}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-white">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      45
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAdminProductId(prod.id);
                            setAdminTab('edit_product');
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors"
                          title="Edit All Details (Colors, Sizes, Specs, Pricing)"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAdminProductId(prod.id);
                            setAdminTab('product_detail');
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar matching mockup < 1 2 3 ... 20 > */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filtered.length} products</span>
            <div className="flex items-center gap-1 font-semibold">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30"
              >
                &lt;
              </button>
              <span className="px-2.5 py-1 rounded-lg bg-pink-600 text-white font-bold">1</span>
              <button
                type="button"
                onClick={() => setCurrentPage(2)}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                2
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(3)}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                3
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button
                type="button"
                disabled
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
