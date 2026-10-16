import React, { useState } from 'react';
import { ArrowLeft, Edit2, Trash2, Star, Check, Sparkles, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { ProductImage } from '../../components/ProductImage';

export const AdminProductDetail: React.FC = () => {
  const { products, deleteProduct, showToast } = useApp();
  const { selectedAdminProductId, setAdminTab } = useAdmin();

  const product =
    products.find((p) => p.id === selectedAdminProductId) || products[0];

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!product) return null;

  const gallery =
    product.images && product.images.length > 0 ? product.images : [product.image];

  const handleDelete = () => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      deleteProduct(product.id);
      showToast('Product deleted.');
      setAdminTab('products');
    }
  };

  const handleEdit = () => {
    setAdminTab('edit_product');
  };

  // Safe color list
  const colorsList =
    product.colors && product.colors.length > 0
      ? product.colors
      : [
          { name: product.color || 'Yellow', hex: '#FBBF24' },
          { name: 'Navy', hex: '#1E293B' },
        ];

  // Safe size list
  const sizesList =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : ['S', 'M', 'L', 'XL'];

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
      {/* Top back & actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setAdminTab('products')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-pink-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 hover:bg-pink-100 font-bold text-xs border border-pink-200 dark:border-pink-900/40 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Product</span>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Product Card (Matching Screen 11 in mockup) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden p-5 sm:p-6 space-y-5">
        {/* Product Image & Multi-Image Gallery */}
        <div className="space-y-2">
          <div className="w-full h-72 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 relative">
            <ProductImage
              src={gallery[activeImageIdx % gallery.length] || product.image}
              alt={product.name}
              category={product.category}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.isPopular && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-pink-600 text-white font-black text-[10px] tracking-wider uppercase shadow-md">
                POPULAR
              </span>
            )}
            {gallery.length > 1 && (
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                {activeImageIdx + 1} / {gallery.length}
              </span>
            )}
          </div>

          {/* Gallery Thumbnails Strip */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {gallery.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIdx === i
                      ? 'border-pink-500 ring-2 ring-pink-500/20 scale-105'
                      : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title & Pricing */}
        <div>
          <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
            {product.category} • {product.subcategory}
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {product.name}
          </h1>

          <div className="flex items-center gap-2.5 mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm line-through text-slate-400">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold">
              -{product.discountPercent}% OFF
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
          {product.description}
        </div>

        {/* Color swatches with names */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Available Colors ({colorsList.length})
            </span>
            <span className="text-[11px] text-pink-600 font-semibold">
              Primary: {product.color || colorsList[0]?.name}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {colorsList.map((col, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <div
                  style={{ backgroundColor: col.hex }}
                  className="w-4 h-4 rounded-full border border-black/15 shadow-xs shrink-0"
                />
                <span>{col.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Size Pills */}
        <div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            Available Sizes ({sizesList.length})
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {sizesList.map((s) => (
              <span
                key={s}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Product Details Specs */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <span className="font-bold text-slate-900 dark:text-white block text-sm">
            Product Specifications
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
            {product.specs && Object.keys(product.specs).length > 0 ? (
              Object.entries(product.specs).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">{key}:</span>
                  <span className="truncate">{val}</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>100% Premium Cotton Blend</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Made in India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Casual & Festive Wear</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Button at bottom */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleEdit}
            className="w-full py-3 rounded-2xl bg-[#DF1951] hover:bg-[#C91345] text-white font-bold text-xs shadow-md shadow-rose-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit All Details (Colors, Sizes, Specs, Pricing)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
