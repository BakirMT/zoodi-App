import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Shirt, Footprints, Watch, Heart } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  category?: string;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  category = 'Women',
  className = 'w-full h-full object-cover',
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const getCategoryIcon = () => {
    switch (category) {
      case 'Footwear':
        return <Footprints className="w-10 h-10 text-amber-500" />;
      case 'Bags':
        return <ShoppingBag className="w-10 h-10 text-pink-500" />;
      case 'Men':
      case 'Women':
        return <Shirt className="w-10 h-10 text-teal-500" />;
      case 'Electronics':
        return <Watch className="w-10 h-10 text-blue-500" />;
      default:
        return <Sparkles className="w-10 h-10 text-pink-500" />;
    }
  };

  if (error || !src) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center p-4 text-center select-none ${className}`}
      >
        <div className="p-3 bg-white dark:bg-slate-700/60 rounded-2xl shadow-sm mb-2">
          {getCategoryIcon()}
        </div>
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-1 max-w-[120px]">
          {alt}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">
          ZOODI • {category}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-slate-400 animate-bounce opacity-40" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`${className} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
