import React, { useState } from 'react';
import {
  Search,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight,
  FolderPlus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdmin } from '../context/AdminContext';

export const CategoriesScreen: React.FC = () => {
  const { navigate, setSelectedCategory, setSelectedSubcategory, products } = useApp();
  const { categories: adminCategories } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = adminCategories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('All');
    navigate('category_listing', { category: categoryId });
  };

  return (
    <div className="pb-28 flex flex-col gap-3">
      {/* Search Categories input */}
      <div className="px-4 pt-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories or products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-transparent focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 transition-all focus:outline-none"
          />
        </div>
      </div>

      {/* Featured "All Products" Hero Card */}
      {!searchTerm && (
        <div className="px-4">
          <div
            onClick={() => handleSelect('All')}
            className="relative rounded-3xl overflow-hidden p-4 sm:p-5 bg-gradient-to-r from-rose-600 to-[#DF1951] text-white shadow-md shadow-rose-900/15 cursor-pointer active:scale-[0.99] transition-all group flex items-center justify-between"
          >
            <div className="relative z-10 max-w-[70%] space-y-1">
              <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-black uppercase tracking-wider">
                Full Collection
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                View All Products ({products.length})
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                Browse our entire inventory with custom price filters & sorting
              </p>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      )}

      {/* Category List Items or Empty State */}
      {adminCategories.length === 0 ? (
        <div className="px-4 py-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <FolderPlus className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Categories Created Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              All categories have been cleared. Head to the Admin Panel to create your new store categories with custom photos and names.
            </p>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#super-admin';
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#DF1951] text-white text-xs font-bold shadow-md hover:bg-[#BE123C] transition-all cursor-pointer"
            >
              + Create Category in Admin
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-2 mt-1">
          {filtered.map((cat) => {
            const count = products.filter(
              (p) => p.category.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <div
                key={cat.id}
                onClick={() => handleSelect(cat.name)}
                className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-xs hover:border-[#DF1951]/40 dark:hover:border-[#DF1951]/40 cursor-pointer active:scale-[0.99] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-400">
                      {cat.subtitle || `${cat.name} collection`} {count > 0 && `• ${count} items`}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#DF1951] group-hover:translate-x-0.5 transition-all" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
