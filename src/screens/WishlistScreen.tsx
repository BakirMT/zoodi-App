import React from 'react';
import { Heart, ShoppingBag, Trash2, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductImage } from '../components/ProductImage';

export const WishlistScreen: React.FC = () => {
  const {
    products,
    wishlistIds,
    toggleWishlist,
    moveToCartFromWishlist,
    navigate,
    setSelectedProduct,
  } = useApp();

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="pb-20 p-6 flex flex-col items-center justify-center min-h-[460px] text-center">
        <div className="w-20 h-20 rounded-full bg-pink-50 dark:bg-pink-950/40 flex items-center justify-center text-pink-500 mb-4">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1 mb-6">
          Save items that you like and want to buy later by tapping the heart icon on any product.
        </p>
        <button
          type="button"
          onClick={() => navigate('category_listing', { category: 'Women' })}
          className="px-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs shadow-md shadow-pink-500/20 active:scale-95 transition-all"
        >
          Explore Trending Styles
        </button>
      </div>
    );
  }

  return (
    <div className="pb-28 p-4 flex flex-col gap-3">
      {/* Items count summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>{wishlistedProducts.length} items saved</span>
      </div>

      {/* Grid of Wishlist Products (Matching Screenshot 17) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {wishlistedProducts.map((product) => (
          <div
            key={product.id}
            className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
          >
            {/* Image */}
            <div
              onClick={() => {
                setSelectedProduct(product);
                navigate('product_detail', { productId: product.id });
              }}
              className="relative aspect-3/4 w-full bg-slate-50 dark:bg-slate-800 cursor-pointer overflow-hidden"
            >
              <ProductImage
                src={product.image}
                alt={product.name}
                category={product.category}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Heart remove button */}
              <button
                type="button"
                aria-label="Remove from wishlist"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center justify-center text-pink-500 shadow-xs"
              >
                <Heart className="w-4 h-4 fill-pink-500" />
              </button>

              {product.discountPercent > 0 && (
                <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-pink-500 text-white">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-2.5 flex flex-col gap-1">
              <h3
                onClick={() => {
                  setSelectedProduct(product);
                  navigate('product_detail', { productId: product.id });
                }}
                className="text-xs font-semibold text-slate-900 dark:text-white truncate cursor-pointer hover:underline"
              >
                {product.name}
              </h3>

              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-[10px] text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Move to Cart Button */}
              <button
                type="button"
                onClick={() => moveToCartFromWishlist(product.id)}
                className="mt-1.5 w-full py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-500 text-pink-600 dark:text-pink-400 hover:text-white dark:hover:text-white border border-pink-200 dark:border-pink-900/40 hover:border-transparent text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Move to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
