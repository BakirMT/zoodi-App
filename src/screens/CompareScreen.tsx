import React, { useState } from 'react';
import { Trash2, Plus, Star, ShoppingBag, Eye, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductImage } from '../components/ProductImage';

export const CompareScreen: React.FC = () => {
  const {
    products,
    compareIds,
    removeFromCompare,
    clearCompare,
    toggleCompare,
    addToCart,
    navigate,
    setSelectedProduct,
  } = useApp();

  const [showAddPicker, setShowAddPicker] = useState(false);

  const comparedProducts = products.filter((p) => compareIds.includes(p.id));

  return (
    <div className="pb-28 p-4 flex flex-col gap-4">
      {/* Header action: Remove All & Add */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Comparing {comparedProducts.length} of 3 items
        </span>
        <div className="flex items-center gap-2">
          {comparedProducts.length < 3 && (
            <button
              type="button"
              onClick={() => setShowAddPicker(true)}
              className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          )}

          {comparedProducts.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1 ml-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove All</span>
            </button>
          )}
        </div>
      </div>

      {comparedProducts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No products in comparison
          </p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Select products from the catalog to compare features, specs, and prices side-by-side.
          </p>
          <button
            type="button"
            onClick={() => setShowAddPicker(true)}
            className="px-4 py-2 rounded-xl bg-pink-500 text-white text-xs font-bold"
          >
            Choose Products
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[320px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
            {/* Products Header Row */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/30">
              {comparedProducts.map((p) => (
                <div key={p.id} className="p-2 flex flex-col items-center text-center relative">
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeFromCompare(p.id)}
                    className="absolute top-1 right-1 p-1 rounded-full text-slate-400 hover:text-rose-500"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="w-24 h-24 rounded-2xl overflow-hidden mb-2 bg-slate-100 dark:bg-slate-800">
                    <ProductImage
                      src={p.image}
                      alt={p.name}
                      category={p.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {p.name}
                  </h3>

                  <span className="text-xs font-extrabold text-pink-600 dark:text-pink-400 mt-0.5">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>

                  <button
                    type="button"
                    onClick={() => addToCart(p)}
                    className="mt-2 w-full py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            {/* Comparison Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {/* Rating */}
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="font-semibold text-slate-400">Rating</span>
                {comparedProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{p.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({p.reviewsCount})
                    </span>
                  </div>
                ))}
              </div>

              {/* Category */}
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="font-semibold text-slate-400">Category</span>
                {comparedProducts.map((p) => (
                  <span key={p.id} className="text-slate-800 dark:text-slate-200 font-medium">
                    {p.category} • {p.subcategory}
                  </span>
                ))}
              </div>

              {/* Material / Fabric */}
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="font-semibold text-slate-400">Material</span>
                {comparedProducts.map((p) => (
                  <span key={p.id} className="text-slate-800 dark:text-slate-200">
                    {p.specs?.Fabric || p.specs?.Material || p.specs?.Upper || 'Premium Cotton / Blend'}
                  </span>
                ))}
              </div>

              {/* Sizes */}
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="font-semibold text-slate-400">Sizes Available</span>
                {comparedProducts.map((p) => (
                  <span key={p.id} className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                    {p.sizes?.join(', ') || 'Standard'}
                  </span>
                ))}
              </div>

              {/* Colors */}
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="font-semibold text-slate-400">Colors</span>
                {comparedProducts.map((p) => (
                  <span key={p.id} className="text-slate-800 dark:text-slate-200">
                    {p.colors?.map((c) => c.name).join(', ') || p.color}
                  </span>
                ))}
              </div>

              {/* Stock */}
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="font-semibold text-slate-400">Availability</span>
                {comparedProducts.map((p) => (
                  <span key={p.id} className="text-emerald-600 dark:text-emerald-400 font-bold">
                    In Stock (Ready to dispatch)
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Details Action */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800">
              {comparedProducts.map((p) => (
                <div key={p.id} className="p-1 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(p);
                      navigate('product_detail', { productId: p.id });
                    }}
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-pink-500 hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Product to Compare Modal */}
      {showAddPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Choose Product to Compare
              </h3>
              <button
                type="button"
                onClick={() => setShowAddPicker(false)}
                className="p-1 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-3 flex flex-col gap-2">
              {products
                .filter((p) => !compareIds.includes(p.id))
                .map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      toggleCompare(prod.id);
                      setShowAddPicker(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-pink-500 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <ProductImage
                          src={prod.image}
                          alt={prod.name}
                          category={prod.category}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {prod.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {prod.category} • ₹{prod.price}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-pink-500">+ Compare</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
