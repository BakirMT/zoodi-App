import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Clock,
  Trash2,
  TrendingUp,
  SlidersHorizontal,
  ArrowUpLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SearchBarWithHistoryProps {
  onOpenFilter?: () => void;
  placeholder?: string;
}

export const SearchBarWithHistory: React.FC<SearchBarWithHistoryProps> = ({
  onOpenFilter,
  placeholder = 'Search for products, brands and more...',
}) => {
  const {
    searchQuery,
    setSearchQuery,
    searchHistory,
    addToSearchHistory,
    removeFromSearchHistory,
    clearSearchHistory,
    products,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Trending recommendations when history is short or user is exploring
  const trendingSearches = [
    'Silk Saree',
    'Running Shoes',
    'Leather Handbag',
    'Denim Jacket',
    'Casual Kurti',
    'Sneakers',
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearchSubmit = (queryToSubmit?: string) => {
    const finalQuery = (queryToSubmit !== undefined ? queryToSubmit : searchQuery).trim();
    if (finalQuery) {
      setSearchQuery(finalQuery);
      addToSearchHistory(finalQuery);
    }
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectQuery = (query: string) => {
    setSearchQuery(query);
    addToSearchHistory(query);
    setIsOpen(false);
  };

  // Filter history if user has started typing
  const filteredHistory = searchQuery.trim()
    ? searchHistory.filter((item) =>
        item.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : searchHistory;

  // Matching product suggestions based on live input
  const quickProductMatches = searchQuery.trim()
    ? products
        .filter((p) =>
          p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.trim().toLowerCase())
        )
        .slice(0, 3)
    : [];

  return (
    <div ref={containerRef} className="relative w-full z-20">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-transparent focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 transition-all focus:outline-none shadow-xs"
        />

        {searchQuery ? (
          <button
            type="button"
            aria-label="Clear search input"
            onClick={() => {
              setSearchQuery('');
              setIsOpen(true);
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          onOpenFilter && (
            <button
              type="button"
              aria-label="Open filter modal"
              onClick={onOpenFilter}
              className="absolute right-3 p-1 text-slate-400 hover:text-pink-500 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>

      {/* Suggestion & History Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Recent Searches Section */}
          {filteredHistory.length > 0 && (
            <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-pink-500" />
                  <span>Recent Searches</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSearchHistory();
                  }}
                  className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>

              <div className="flex flex-col gap-0.5">
                {filteredHistory.map((item) => (
                  <div
                    key={item}
                    onClick={() => handleSelectQuery(item)}
                    className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-pink-500 transition-colors" />
                      <span className="text-xs text-slate-800 dark:text-slate-200 truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 font-medium">
                        {item}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        title="Remove from history"
                        aria-label={`Remove ${item} from search history`}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromSearchHistory(item);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <ArrowUpLeft className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Product Matches (when typing) */}
          {searchQuery.trim() && quickProductMatches.length > 0 && (
            <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                Suggested Products
              </span>
              <div className="flex flex-col gap-1.5">
                {quickProductMatches.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectQuery(product.name)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-8 h-8 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {product.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        in {product.category} • ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches Section */}
          <div className="p-3 bg-slate-50/30 dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 px-1">
              <TrendingUp className="w-3.5 h-3.5 text-pink-500" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap gap-1.5 px-1">
              {trendingSearches.map((trend) => (
                <button
                  key={trend}
                  type="button"
                  onClick={() => handleSelectQuery(trend)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-pink-950/40 hover:text-pink-600 dark:hover:text-pink-400 transition-all border border-slate-200/60 dark:border-slate-700/60"
                >
                  {trend}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
