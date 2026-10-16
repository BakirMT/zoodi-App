import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  Heart,
  Share2,
  Check,
  ShoppingBag,
  Sparkles,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Scale,
  X,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductImage } from '../components/ProductImage';
import { ProductCard } from '../components/ProductCard';
import { ProductReviewsSection } from '../components/ProductReviewsSection';
import { SizeGuideModal } from '../components/SizeGuideModal';

export const ProductDetailScreen: React.FC = () => {
  const {
    selectedProduct,
    products,
    setSelectedProduct,
    setSelectedCategory,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    compareIds,
    showToast,
    navigate,
  } = useApp();

  const product = selectedProduct;

  const [selectedColor, setSelectedColor] = useState<string>(product?.color || 'Yellow');
  const [selectedSize, setSelectedSize] = useState<string>(product?.size || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  // Synchronize state when selected product switches
  useEffect(() => {
    if (product) {
      setSelectedColor(product.color || 'Yellow');
      setSelectedSize(product.size || (product.sizes && product.sizes[0]) || 'M');
      setActiveImageIdx(0);
      setQuantity(1);
    }
  }, [product?.id]);

  // Compute related items based on category, subcategory, and popularity
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    // 1. Same category and same subcategory
    const sameSub = products.filter(
      (p) =>
        p.id !== product.id &&
        p.category === product.category &&
        p.subcategory === product.subcategory
    );
    // 2. Same category
    const sameCat = products.filter(
      (p) =>
        p.id !== product.id &&
        p.category === product.category &&
        p.subcategory !== product.subcategory
    );
    // 3. Other popular items
    const others = products.filter(
      (p) => p.id !== product.id && p.category !== product.category
    );

    return [...sameSub, ...sameCat, ...others].slice(0, 6);
  }, [products, product]);

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">No product selected.</p>
        <button
          onClick={() => navigate('home')}
          className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-xl text-xs"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const gallery =
    product.images && product.images.length > 0 ? product.images : [product.image];

  const wishlisted = isInWishlist(product.id);
  const isCompared = compareIds.includes(product.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    } else {
      showToast('Link ready to share!');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const handleOrderNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    navigate('cart');
  };

  return (
    <div className="pb-40 flex flex-col">
      {/* Product Image Stage */}
      <div className="relative aspect-4/5 w-full bg-slate-100 dark:bg-slate-800">
        <ProductImage
          src={gallery[activeImageIdx % gallery.length] || product.image}
          alt={product.name}
          category={product.category}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Multi-image photo count badge */}
        {gallery.length > 1 && (
          <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold z-10">
            {activeImageIdx + 1} / {gallery.length}
          </span>
        )}

        {/* Top Floating Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share product"
            className="w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm active:scale-90 transition-transform"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label="Toggle wishlist"
            className="w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm active:scale-90 transition-transform"
          >
            <Heart
              className={`w-4 h-4 ${
                wishlisted ? 'fill-pink-500 text-pink-500' : 'text-slate-700 dark:text-slate-300'
              }`}
            />
          </button>
        </div>

        {/* Discount badge */}
        {product.discountPercent > 0 && (
          <span className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-pink-500 text-white text-xs font-bold shadow-md z-10">
            {product.discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Multi-Image Gallery Thumbnails Strip */}
      {gallery.length > 1 && (
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIdx(idx)}
              className={`relative w-14 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                activeImageIdx === idx
                  ? 'border-[#DF1951] ring-2 ring-rose-500/20 scale-105'
                  : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main Info */}
      <div className="p-4 flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold">
              ZOODI {product.category}
            </span>

            {/* Compare Button */}
            <button
              type="button"
              onClick={() => toggleCompare(product.id)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                isCompared
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Scale className="w-3 h-3" />
              <span>{isCompared ? 'In Compare' : 'Compare'}</span>
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {product.name}
          </h1>

          {/* Rating */}
          <div
            onClick={() => {
              document.getElementById('product-reviews-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 mt-1.5 cursor-pointer group"
            title="Click to view customer ratings & reviews"
          >
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-bold group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition-colors">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors underline decoration-dotted">
              ({product.reviewsCount.toLocaleString()} reviews)
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold ml-auto">
              In Stock
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 px-2 py-0.5 rounded-md">
              {product.discountPercent}% OFF
            </span>
          </div>
        </div>

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Color: <span className="font-normal text-slate-500">{selectedColor}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((c) => {
                const isSelected = selectedColor === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'ring-2 ring-pink-500 ring-offset-2 dark:ring-offset-slate-900 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {isSelected && (
                      <Check
                        className={`w-4 h-4 stroke-[3] ${
                          c.hex.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Size: <span className="font-normal text-slate-500">{selectedSize}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-pink-600 dark:text-pink-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-10 h-10 px-3 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-pink-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white">Quantity</span>
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white active:scale-90"
            >
              -
            </button>
            <span className="text-xs font-bold w-4 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white active:scale-90"
            >
              +
            </button>
          </div>
        </div>

        {/* Product Details Section (Matching Screenshot 7) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            Product Details
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {Object.entries(product.specs || {}).map(([key, val]) => (
              <li key={key} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-slate-900 dark:text-white">{key}:</strong> {val}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 py-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-3 text-center border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center">
            <Truck className="w-4 h-4 text-teal-500 mb-1" />
            <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
              Free Delivery
            </span>
            <span className="text-[9px] text-slate-400">On ₹999+</span>
          </div>
          <div className="flex flex-col items-center">
            <RotateCcw className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
              7 Days Return
            </span>
            <span className="text-[9px] text-slate-400">Easy refund</span>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
              100% Genuine
            </span>
            <span className="text-[9px] text-slate-400">Verified seller</span>
          </div>
        </div>

        {/* Instant Order Button requested by user */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleOrderNow}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-700 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Now • Add to Cart & Proceed</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
          <div className="flex items-center justify-center gap-3 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>⚡ Instant Checkout</span>
            <span>•</span>
            <span>🔒 Secure Payment</span>
            <span>•</span>
            <span>📦 Fast Dispatch</span>
          </div>
        </div>

        {/* Customer Ratings & Reviews Section */}
        <div id="product-reviews-section">
          <ProductReviewsSection product={product} />
        </div>

        {/* Related Products Section below Product Review */}
        {relatedProducts.length > 0 && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>Related Products</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400">
                    {product.category}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Customers who viewed this item also loved these
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(product.category);
                  navigate('category_listing', { category: product.category });
                }}
                className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 flex items-center gap-0.5 transition-colors cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  onSelect={() => {
                    setSelectedProduct(relProduct);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar above BottomNav */}
      <div className="fixed bottom-[60px] left-0 right-0 max-w-md mx-auto z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 flex items-center gap-3 shadow-lg">
        <button
          type="button"
          aria-label="Wishlist"
          onClick={() => toggleWishlist(product.id)}
          className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
            wishlisted
              ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-500'
              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${wishlisted ? 'fill-pink-500' : ''}`} />
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 h-12 rounded-2xl bg-pink-500 hover:bg-pink-600 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <SizeGuideModal
          product={product}
          selectedSize={selectedSize}
          onSelectSize={(newSize) => setSelectedSize(newSize)}
          onClose={() => setShowSizeGuide(false)}
        />
      )}
    </div>
  );
};
