import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Star,
  Check,
  RotateCcw,
  IndianRupee,
  LayoutGrid,
  ArrowDownAZ,
  ArrowUpAZ,
  Percent,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { SortOption } from '../types';

export const ProductListingScreen: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    sortBy,
    setSortBy,
  } = useApp();

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showSortDrawer, setShowSortDrawer] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [minRating, setMinRating] = useState<number>(0);

  // Compute dynamic price range bounds from current products
  const { minBound, maxBound } = useMemo(() => {
    const prices = products.map((p) => p.price);
    if (prices.length === 0) return { minBound: 0, maxBound: 5000 };
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    return {
      minBound: Math.max(0, Math.floor(minP / 100) * 100),
      maxBound: Math.max(1000, Math.ceil(maxP / 500) * 500),
    };
  }, [products]);

  // Dynamic price filter states
  const [priceMin, setPriceMin] = useState<number>(minBound);
  const [priceMax, setPriceMax] = useState<number>(maxBound);

  // Categories list with "All" option
  const categoryList = ['All', 'Women', 'Men', 'Footwear', 'Bags', 'Home', 'Electronics', 'Beauty'];

  // Quick budget presets
  const budgetPresets = [
    { label: 'All Budgets', min: minBound, max: maxBound },
    { label: 'Under ₹999', min: minBound, max: 999 },
    { label: '₹1,000 - ₹2,499', min: 1000, max: 2499 },
    { label: '₹2,500 - ₹4,999', min: 2500, max: 4999 },
    { label: '₹5,000+', min: 5000, max: maxBound },
  ];

  // Subcategories for current category
  const subcategoryList = ['All', 'Dresses', 'Tops', 'Jeans', 'Kurti', 'Saree', 'Outerwear', 'Shoes', 'Handbags'];

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter: if 'All' or not set, show all products
        if (selectedCategory && selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }
        // Subcategory filter
        if (selectedSubcategory && selectedSubcategory !== 'All' && p.subcategory !== selectedSubcategory) {
          return false;
        }
        // Dynamic price range filter
        if (p.price < priceMin || p.price > priceMax) {
          return false;
        }
        // Rating filter
        if (minRating > 0 && p.rating < minRating) {
          return false;
        }
        // Local search
        if (localSearch.trim()) {
          const q = localSearch.toLowerCase();
          return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        // Price: Low to High
        if (sortBy === 'price-asc') return a.price - b.price;
        // Price: High to Low
        if (sortBy === 'price-desc') return b.price - a.price;
        // Alphabetical: A to Z
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        // Alphabetical: Z to A
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name, undefined, { sensitivity: 'base' });
        // Rating: High to Low
        if (sortBy === 'rating') return b.rating - a.rating;
        // Discount: Highest Discount First
        if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
        // Featured default
        return 0;
      });
  }, [products, selectedCategory, selectedSubcategory, priceMin, priceMax, minRating, localSearch, sortBy]);

  const isPriceFiltered = priceMin > minBound || priceMax < maxBound;
  const isFilterActive = isPriceFiltered || minRating > 0 || (selectedCategory && selectedCategory !== 'All');

  const handleResetFilters = () => {
    setPriceMin(minBound);
    setPriceMax(maxBound);
    setMinRating(0);
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSortBy('featured');
    setLocalSearch('');
  };

  // Slider track percentages for visual gradient
  const totalRange = maxBound - minBound || 1;
  const minPercent = Math.max(0, Math.min(100, ((priceMin - minBound) / totalRange) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((priceMax - minBound) / totalRange) * 100));

  // Sort labels map for UI display
  const sortLabels: Record<SortOption, string> = {
    featured: 'Featured',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'name-asc': 'Name: A to Z',
    'name-desc': 'Name: Z to A',
    rating: 'Top Rated',
    discount: 'Biggest Discounts',
  };

  return (
    <div className="pb-28 flex flex-col gap-3">
      {/* Category Header Badge */}
      <div className="px-4 pt-1 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            {selectedCategory === 'All' ? (
              <>
                <LayoutGrid className="w-5 h-5 text-[#DF1951]" />
                <span>All Products</span>
              </>
            ) : (
              <span>{selectedCategory} Collection</span>
            )}
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {selectedCategory !== 'All' && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSelectedSubcategory('All');
            }}
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-[#DF1951] hover:bg-rose-50 transition-colors"
          >
            View All Categories
          </button>
        )}
      </div>

      {/* Sub-header controls (Search toggle, Sort, Filter) */}
      <div className="px-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowSearchInput(!showSearchInput)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
              showSearchInput
                ? 'bg-rose-50 dark:bg-rose-950/40 border-[#DF1951] text-[#DF1951]'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>

          {/* Sort By Button with active indicator */}
          <button
            type="button"
            onClick={() => setShowSortDrawer(true)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              sortBy !== 'featured'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-[#DF1951] text-[#DF1951]'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-pink-500'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortLabels[sortBy] || 'Sort'}</span>
          </button>
        </div>

        {/* Filter Button */}
        <button
          type="button"
          onClick={() => setShowFilterDrawer(true)}
          className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            isFilterActive
              ? 'bg-rose-50 dark:bg-rose-950/40 border-[#DF1951] text-[#DF1951] font-bold shadow-xs'
              : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter</span>
          {isFilterActive && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#DF1951] text-white text-[10px] font-black">
              {isPriceFiltered ? `₹${priceMin}-₹${priceMax}` : 'Active'}
            </span>
          )}
        </button>
      </div>

      {/* Horizontal Category Filter Pills (All Products, Women, Men, Footwear, etc.) */}
      <div className="px-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categoryList.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedSubcategory('All');
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-[#DF1951] text-white shadow-xs scale-105'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'All' ? '🌟 All Products' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Chips Bar (if price, category or ratings active) */}
      {isFilterActive && (
        <div className="px-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 shrink-0">
              <span>Category: {selectedCategory}</span>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="hover:opacity-75"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {isPriceFiltered && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-[11px] font-bold text-[#DF1951] shrink-0">
              <span>₹{priceMin.toLocaleString('en-IN')} – ₹{priceMax.toLocaleString('en-IN')}</span>
              <button
                type="button"
                onClick={() => {
                  setPriceMin(minBound);
                  setPriceMax(maxBound);
                }}
                className="hover:opacity-75"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {sortBy !== 'featured' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
              <span>Sort: {sortLabels[sortBy]}</span>
              <button
                type="button"
                onClick={() => setSortBy('featured')}
                className="hover:opacity-75"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-[11px] font-bold text-amber-700 dark:text-amber-400 shrink-0">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{minRating}+ Stars</span>
              <button
                type="button"
                onClick={() => setMinRating(0)}
                className="hover:opacity-75"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[11px] text-slate-400 hover:text-slate-600 underline font-semibold shrink-0"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Expandable Search Input */}
      {showSearchInput && (
        <div className="px-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              autoFocus
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={`Search in ${selectedCategory === 'All' ? 'All Products' : selectedCategory}...`}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => setLocalSearch('')}
                className="absolute right-2.5 p-1 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Horizontal Subcategory Filter Tabs (if applicable) */}
      {selectedCategory !== 'All' && (
        <div className="px-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {subcategoryList.map((sub) => {
              const isSelected = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="px-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 mt-2">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No matching products found
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              No products found in the selected price range or filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-[#DF1951] hover:bg-[#C91345] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Reset All Filters & View All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} compact />
            ))}
          </div>
        )}
      </div>

      {/* Sort Drawer Modal with Comprehensive Sorting Options */}
      {showSortDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-xs rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-[#DF1951]" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Sort Products</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSortDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1 py-3 text-xs">
              {[
                { label: 'Featured & Popular', val: 'featured', icon: Star },
                { label: 'Price: Low to High (₹ ↑)', val: 'price-asc', icon: IndianRupee },
                { label: 'Price: High to Low (₹ ↓)', val: 'price-desc', icon: IndianRupee },
                { label: 'Alphabetical: A to Z', val: 'name-asc', icon: ArrowDownAZ },
                { label: 'Alphabetical: Z to A', val: 'name-desc', icon: ArrowUpAZ },
                { label: 'Customer Rating (High to Low)', val: 'rating', icon: Star },
                { label: 'Biggest Discount (%)', val: 'discount', icon: Percent },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = sortBy === opt.val;

                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => {
                      setSortBy(opt.val as SortOption);
                      setShowSortDrawer(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-[#DF1951] font-bold shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#DF1951]' : 'text-slate-400'}`} />
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#DF1951] stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Filter Drawer Modal with Price Range Slider */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#DF1951]" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Filter Products & Budget
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFilterDrawer(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-5 text-xs">
              {/* DYNAMIC PRICE RANGE SLIDER SECTION */}
              <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-[#DF1951]" />
                    <span>Price Range / Budget</span>
                  </span>
                  <span className="text-[11px] font-bold text-[#DF1951] bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-200/60 dark:border-rose-900/40">
                    ₹{priceMin.toLocaleString('en-IN')} – ₹{priceMax.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Dual Thumb Price Slider Visual Container */}
                <div className="pt-2 px-1">
                  <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                    {/* Active highlight fill between Min and Max */}
                    <div
                      className="absolute top-0 bottom-0 bg-[#DF1951] rounded-full transition-all duration-75"
                      style={{
                        left: `${minPercent}%`,
                        width: `${Math.max(0, maxPercent - minPercent)}%`,
                      }}
                    />

                    {/* Min Range Input */}
                    <input
                      type="range"
                      min={minBound}
                      max={maxBound}
                      step={50}
                      value={priceMin}
                      onChange={(e) => {
                        const val = Math.min(Number(e.target.value), priceMax - 50);
                        setPriceMin(val);
                      }}
                      className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer pointer-events-auto z-10"
                    />

                    {/* Max Range Input */}
                    <input
                      type="range"
                      min={minBound}
                      max={maxBound}
                      step={50}
                      value={priceMax}
                      onChange={(e) => {
                        const val = Math.max(Number(e.target.value), priceMin + 50);
                        setPriceMax(val);
                      }}
                      className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer pointer-events-auto z-20"
                    />
                  </div>

                  {/* Dynamic Boundary Labels */}
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-2.5">
                    <span>₹{minBound.toLocaleString('en-IN')}</span>
                    <span className="text-[#DF1951] font-bold">
                      {filteredProducts.length} items found
                    </span>
                    <span>₹{maxBound.toLocaleString('en-IN')}+</span>
                  </div>
                </div>

                {/* Min & Max Interactive Number Badges */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      Min Price (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        min={minBound}
                        max={priceMax - 50}
                        value={priceMin}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= minBound && val <= priceMax) {
                            setPriceMin(val);
                          }
                        }}
                        className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      Max Price (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        min={priceMin + 50}
                        max={maxBound}
                        value={priceMax}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= priceMin && val <= maxBound) {
                            setPriceMax(val);
                          }
                        }}
                        className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Budget Presets */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Quick Budget Picks
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {budgetPresets.map((preset) => {
                      const isActive =
                        priceMin === preset.min &&
                        (preset.max === maxBound ? priceMax >= maxBound : priceMax === preset.max);

                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setPriceMin(preset.min);
                            setPriceMax(preset.max);
                          }}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#DF1951] text-white shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-pink-400'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Department Category selector */}
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                  Department Category
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {categoryList.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedSubcategory('All');
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'border-[#DF1951] bg-rose-50 dark:bg-rose-950/40 text-[#DF1951] font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cat === 'All' ? 'All Products' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                  Customer Rating
                </span>
                <div className="flex gap-2">
                  {[0, 4.0, 4.5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setMinRating(r)}
                      className={`flex-1 py-1.5 rounded-xl border flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer transition-all ${
                        minRating === r
                          ? 'border-[#DF1951] bg-rose-50 dark:bg-rose-950/40 text-[#DF1951] font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {r === 0 ? (
                        'All'
                      ) : (
                        <>
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{r}+ Stars</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
              <button
                type="button"
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 py-2.5 rounded-2xl bg-[#DF1951] hover:bg-[#C91345] text-white text-xs font-bold shadow-md shadow-rose-900/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Apply ({filteredProducts.length} items)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
