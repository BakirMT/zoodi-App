import React from 'react';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  onSelect?: () => void;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, compact = false }) => {
  const { isInWishlist, toggleWishlist, addToCart, navigate, setSelectedProduct } = useApp();
  const wishlisted = isInWishlist(product.id);

  const handleCardClick = () => {
    setSelectedProduct(product);
    if (onSelect) {
      onSelect();
    } else {
      navigate('product_detail', { productId: product.id });
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      {/* Image container */}
      <div className="relative aspect-3/4 w-full bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
        <ProductImage
          src={product.image}
          alt={product.name}
          category={product.category}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <span className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 px-1 py-0.5 text-[8px] sm:text-[9px] font-extrabold tracking-tight rounded bg-pink-500 text-white shadow-xs">
            {product.discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          type="button"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={handleWishlistClick}
          className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-pink-500 dark:hover:text-pink-400 shadow-xs transition-colors active:scale-90"
        >
          <Heart
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
              wishlisted ? 'fill-pink-500 text-pink-500' : 'text-slate-600 dark:text-slate-300'
            }`}
          />
        </button>

        {/* Quick Add to Cart Button (Mobile & Desktop) */}
        <button
          type="button"
          aria-label="Quick add to cart"
          onClick={handleQuickAdd}
          className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-xs text-slate-800 dark:text-slate-100 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-500 transition-colors flex items-center justify-center active:scale-95"
        >
          <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Content info */}
      <div className="p-1.5 sm:p-2 flex flex-col gap-0.5">
        <h3 className="text-[11px] sm:text-xs font-semibold text-slate-900 dark:text-white truncate">
          {product.name}
        </h3>

        {/* Rating and review count */}
        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center text-amber-500">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span className="font-bold ml-0.5 text-slate-800 dark:text-slate-200">
              {product.rating}
            </span>
          </div>
          <span className="truncate">
            ({product.reviewsCount > 999 ? `${(product.reviewsCount / 1000).toFixed(1)}k` : product.reviewsCount})
          </span>
        </div>

        {/* Price display with INR symbol */}
        <div className="flex items-baseline gap-1 mt-0.5 flex-wrap">
          <span className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
