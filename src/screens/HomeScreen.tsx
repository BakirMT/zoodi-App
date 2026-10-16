import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, ChevronLeft, X, SlidersHorizontal, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdmin } from '../context/AdminContext';
import { ProductCard } from '../components/ProductCard';
import { SearchBarWithHistory } from '../components/SearchBarWithHistory';
import { Footer } from '../components/Footer';

export const HomeScreen: React.FC = () => {
  const {
    products,
    navigate,
    setSelectedCategory,
    setSelectedProduct,
    searchQuery,
    setSearchQuery,
  } = useApp();
  const { banners, bannerSettings, categories } = useAdmin();

  const [activeFilterModal, setActiveFilterModal] = useState(false);
  const [activePosterIdx, setActivePosterIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activePosters = banners.filter((b) => b.status === 'Active');

  // Auto-sliding interval effect (strictly 3 seconds)
  useEffect(() => {
    if (!bannerSettings?.autoSlide || activePosters.length <= 1) {
      return;
    }
    if (isPaused && bannerSettings.pauseOnHover) {
      return;
    }

    const intervalMs = Math.max((bannerSettings.intervalSeconds || 3) * 1000, 1500);
    const timer = setInterval(() => {
      setActivePosterIdx((prev) => (prev + 1) % activePosters.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [bannerSettings?.autoSlide, bannerSettings?.intervalSeconds, isPaused, activePosters.length]);

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActivePosterIdx((prev) => (prev + 1) % activePosters.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActivePosterIdx((prev) => (prev - 1 + activePosters.length) % activePosters.length);
  };

  // Touch swipe support for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartX;
    if (diff < -40) {
      nextSlide();
    } else if (diff > 40) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  const handleBannerClick = (poster: typeof activePosters[0]) => {
    if (!poster) return;
    if (poster.linkType === 'product' && poster.targetProductId) {
      const prod =
        products.find((p) => p.id === poster.targetProductId) || products[0];
      if (prod) {
        setSelectedProduct(prod);
        navigate('product_detail');
        return;
      }
    }

    // Default to category
    const target = (poster.targetCategory as any) || 'Women';
    setSelectedCategory(target);
    navigate('category_listing', { category: target });
  };

  // Quick categories matching the circular photo cards from Admin or empty
  const categoryChips = categories.length > 0
    ? categories.map((c) => ({
        label: c.name,
        cat: c.name,
        image: c.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80',
      }))
    : [];

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    navigate('category_listing', { category: cat });
  };

  // Filtered products if user is searching
  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  // Category sections to display on Home screen with dedicated View All options
  const homeCategorySections = [
    {
      id: 'Women',
      title: 'Women',
      subtitle: 'Dresses, Kurtis, Sarees & Denim',
      badge: 'Popular',
    },
    {
      id: 'Men',
      title: 'Men',
      subtitle: 'Jackets, Shirts & Streetwear',
      badge: 'Trending',
    },
    {
      id: 'Footwear',
      title: 'Footwear',
      subtitle: 'Sneakers, Loafers & Heels',
      badge: 'Bestseller',
    },
    {
      id: 'Bags',
      title: 'Bags',
      subtitle: 'Handbags, Backpacks & Slings',
      badge: 'Hot Picks',
    },
    {
      id: 'Home',
      title: 'Home & Living',
      subtitle: 'Bedsheets, Ceramic Vases & Decor',
      badge: 'New',
    },
    {
      id: 'Electronics',
      title: 'Electronics',
      subtitle: 'Smart Watches & Earbuds',
      badge: 'Top Tech',
    },
  ];

  const handleViewAllCategory = (catId: string) => {
    setSelectedCategory(catId);
    navigate('category_listing', { category: catId });
  };

  return (
    <div className="pb-28 flex flex-col gap-4">
      {/* Search Input Bar with persistent history and suggestion list */}
      <div className="px-4 pt-1">
        <SearchBarWithHistory onOpenFilter={() => setActiveFilterModal(true)} />
      </div>

      {/* If Search is Active */}
      {searchQuery.trim() ? (
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Search Results ({filteredProducts.length})
            </h2>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-pink-600 dark:text-pink-400 font-medium"
            >
              Clear
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No products found for "{searchQuery}"
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching with another keyword or explore categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} compact />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Hero Poster / Banner */}
          <div className="px-4">
            {activePosters.length === 0 ? (
              <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 shadow-sm min-h-[195px] flex flex-col justify-center border border-slate-800">
                <span className="text-[11px] sm:text-xs font-black tracking-wider text-pink-400 uppercase mb-1">
                  ZOODI COLLECTION • OFFICIAL STORE
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight max-w-sm">
                  Modern Elegance & Lifestyle
                </h2>
                <p className="text-xs text-slate-300 mt-1.5 max-w-sm">
                  Store data has been cleared to upload new catalog items. Visit the Admin Panel to create your new promotional posters and products.
                </p>
                <div className="mt-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.hash = '#super-admin';
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#DF1951] text-white font-bold text-xs shadow-md hover:bg-[#BE123C] transition-all cursor-pointer"
                  >
                    <span>+ Add Hero Banners in Admin</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative rounded-[28px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm group select-none min-h-[195px]"
              >
                {/* Horizontal Sliding Track */}
                <div
                  className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{
                    transform: `translateX(-${(activePosterIdx % activePosters.length) * 100}%)`,
                  }}
                >
                  {activePosters.map((poster, idx) => (
                    <div
                      key={poster.id || idx}
                      onClick={() => handleBannerClick(poster)}
                      className="w-full shrink-0 relative p-6 sm:p-7 flex items-center justify-between min-h-[195px] cursor-pointer"
                    >
                      <div className="absolute inset-y-0 right-0 w-[58%] sm:w-[50%] overflow-hidden pointer-events-none">
                        <img
                          src={poster.image}
                          alt={poster.title}
                          className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent dark:from-slate-900 dark:via-slate-900/85" />
                      </div>

                      <div className="relative z-10 max-w-[62%] flex flex-col items-start">
                        <span className="text-[11px] sm:text-xs font-black tracking-wider text-[#DF1951] uppercase mb-1">
                          {poster.tag || 'NEW SEASON 2026'}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                          {poster.title}
                        </h2>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBannerClick(poster);
                          }}
                          className="mt-3.5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#DF1951] hover:bg-[#C91345] text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/20 active:scale-95 transition-all cursor-pointer"
                        >
                          <span>{poster.buttonText || 'Shop Now →'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3-Second Visual Sliding Progress Bar indicator */}
                {bannerSettings?.autoSlide && activePosters.length > 1 && !isPaused && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-100 dark:bg-slate-800 z-20 overflow-hidden">
                    <div
                      key={`${activePosterIdx}-${bannerSettings.intervalSeconds || 3}`}
                      className="h-full bg-[#DF1951] transition-all"
                      style={{
                        animation: `bannerProgress ${bannerSettings.intervalSeconds || 3}s linear forwards`,
                      }}
                    />
                  </div>
                )}

                {/* Manual Navigation */}
                {activePosters.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => prevSlide(e)}
                      aria-label="Previous slide"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-md opacity-0 group-hover:opacity-100 sm:opacity-0 transition-opacity hover:bg-white active:scale-90"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => nextSlide(e)}
                      aria-label="Next slide"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-md opacity-0 group-hover:opacity-100 sm:opacity-0 transition-opacity hover:bg-white active:scale-90"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Carousel Indicators */}
                {activePosters.length > 1 && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2.5 right-3.5 z-20 flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-2.5 py-1 rounded-full"
                  >
                    {activePosters.map((_, i) => {
                      const isActive = activePosterIdx % activePosters.length === i;
                      return (
                        <button
                          key={i}
                          type="button"
                          aria-label={`Go to slide ${i + 1}`}
                          onClick={() => setActivePosterIdx(i)}
                          className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                            isActive ? 'w-5 bg-[#DF1951]' : 'w-1.5 bg-white/70 hover:bg-white'
                          }`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div className="px-4 mt-2">
            <div className="flex items-center justify-between mb-3 px-0.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                CATEGORIES
              </h3>
              <button
                type="button"
                onClick={() => navigate('categories')}
                className="text-xs font-bold text-[#DF1951] hover:underline"
              >
                See All
              </button>
            </div>

            {categoryChips.length === 0 ? (
              <div className="py-4 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No categories created yet.{' '}
                  <button
                    type="button"
                    onClick={() => {
                      window.location.hash = '#super-admin';
                    }}
                    className="text-[#DF1951] font-bold hover:underline ml-1"
                  >
                    + Add Category in Admin
                  </button>
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-1">
                {categoryChips.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => handleCategoryClick(c.cat)}
                    className="flex flex-col items-center shrink-0 group active:scale-95 transition-transform"
                  >
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-1 bg-white dark:bg-slate-800 border-2 border-slate-200/90 dark:border-slate-700 shadow-xs group-hover:border-[#DF1951] dark:group-hover:border-[#DF1951] transition-colors overflow-hidden flex items-center justify-center">
                      <img
                        src={c.image}
                        alt={c.label}
                        className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2">
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Products Empty State or Category Sections */}
          {products.length === 0 ? (
            <div className="px-4 py-4">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Catalog Ready For New Products
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Store products, categories, orders, customers, banners, coupons, and analytics have been cleared. Upload new catalog items from the Admin Panel to display them here!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = '#super-admin';
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-[#DF1951] text-white text-xs font-bold shadow-md hover:bg-[#BE123C] transition-all cursor-pointer"
                >
                  Open Admin Panel to Upload Products
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 mt-2">
              {homeCategorySections.map((sec, idx) => {
                const catProducts = products.filter(
                  (p) => p.category.toLowerCase() === sec.id.toLowerCase()
                );
                if (catProducts.length === 0) return null;

                const displayProducts = catProducts.slice(0, 3);

                return (
                  <React.Fragment key={sec.id}>
                    <div className="px-4">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                              {sec.title}
                            </h3>
                            {sec.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-tight bg-pink-100 dark:bg-pink-950/60 text-[#DF1951] dark:text-pink-400">
                                {sec.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] sm:text-[11px] text-slate-400">
                            {sec.subtitle}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleViewAllCategory(sec.id)}
                          className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 flex items-center gap-0.5 active:scale-95 transition-all py-1 px-2 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-950/30"
                        >
                          <span>View All</span>
                          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {displayProducts.map((prod) => (
                          <ProductCard key={prod.id} product={prod} compact />
                        ))}
                      </div>
                    </div>

                    {idx === 1 && (
                      <div className="px-4 my-1">
                        <div
                          onClick={() => handleViewAllCategory('Women')}
                          className="cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white flex items-center justify-between shadow-xs hover:shadow-md transition-shadow"
                        >
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                              Flash Offer
                            </span>
                            <h4 className="text-sm sm:text-base font-bold mt-1">Get Flat 50% OFF</h4>
                            <p className="text-[11px] text-teal-100 mt-0.5">Use code ZOODI50 at checkout</p>
                          </div>
                          <span className="px-3 py-1.5 rounded-xl bg-white text-teal-800 font-bold text-xs shadow-xs">
                            Claim Now
                          </span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}


          {/* Home Footer */}
          <Footer />
        </>
      )}

      {/* Quick Filter Modal */}
      {activeFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Quick Filters</h3>
              <button
                type="button"
                onClick={() => setActiveFilterModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 flex flex-col gap-4 text-xs">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">Category</span>
                <div className="flex flex-wrap gap-2">
                  {['Women', 'Men', 'Footwear', 'Bags', 'Home', 'Electronics'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setActiveFilterModal(false);
                        navigate('category_listing', { category: cat });
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-pink-500 hover:text-pink-500"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
