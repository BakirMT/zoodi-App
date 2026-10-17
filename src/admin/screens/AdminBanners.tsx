import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Upload,
  Camera,
  Sparkles,
  Check,
  ArrowRight,
  Play,
  Pause,
  Timer,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import { AdminBanner } from '../../types/admin';

export const AdminBanners: React.FC = () => {
  const {
    banners,
    bannerSettings,
    updateBannerSettings,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    setSelectedBannerId,
    setAdminTab,
  } = useAdmin();
  const { showToast, products } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('Style for Every You');
  const [tag, setTag] = useState('NEW SEASON 2026');
  const [buttonText, setButtonText] = useState('Shop Now →');
  const [linkType, setLinkType] = useState<'category' | 'product'>('category');
  const [targetCategory, setTargetCategory] = useState('Women');
  const [targetProductId, setTargetProductId] = useState(products[0]?.id || 'prod_1');
  const [type, setType] = useState<AdminBanner['type']>('Main Banner');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'
  );
  const [startDate, setStartDate] = useState('02 Oct 2026');
  const [endDate, setEndDate] = useState('31 Oct 2026');

  // Preview carousel state
  const activePosters = banners.filter((b) => b.status === 'Active');
  const [previewIdx, setPreviewIdx] = useState(0);
  const [previewPaused, setPreviewPaused] = useState(false);

  // Auto sliding preview in admin panel
  useEffect(() => {
    if (!bannerSettings.autoSlide || activePosters.length <= 1 || previewPaused) {
      return;
    }

    const intervalMs = Math.max((bannerSettings.intervalSeconds || 4) * 1000, 2000);
    const timer = setInterval(() => {
      setPreviewIdx((prev) => (prev + 1) % activePosters.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [bannerSettings.autoSlide, bannerSettings.intervalSeconds, previewPaused, activePosters.length]);

  // Quick preset images
  const presetImages = [
    {
      name: 'Burgundy Coat & Sunglasses (Active)',
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Yellow Floral Shopper in Studio',
      url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'High Fashion Studio Yellow Dress',
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Festive Shopping Bags & Gifts',
      url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const openAddModal = () => {
    setEditingId(null);
    setTitle('New Festive Collection');
    setTag('LIMITED EDITION');
    setButtonText('Explore Now →');
    setLinkType('category');
    setTargetCategory('Women');
    setTargetProductId(products[0]?.id || 'prod_1');
    setType('Main Banner');
    setImageUrl('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80');
    setStartDate('02 Oct 2026');
    setEndDate('31 Oct 2026');
    setShowModal(true);
  };

  const openEditModal = (ban: AdminBanner) => {
    setEditingId(ban.id);
    setTitle(ban.title);
    setTag(ban.tag || 'NEW SEASON 2026');
    setButtonText(ban.buttonText || 'Shop Now →');
    setLinkType(ban.linkType || 'category');
    setTargetCategory(ban.targetCategory || 'Women');
    setTargetProductId(ban.targetProductId || products[0]?.id || 'prod_1');
    setType(ban.type);
    setImageUrl(ban.image);
    setStartDate(ban.startDate);
    setEndDate(ban.endDate);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      updateBanner({
        id: editingId,
        title: title.trim(),
        tag: tag.trim(),
        buttonText: buttonText.trim(),
        linkType,
        targetCategory,
        targetProductId,
        type,
        image: imageUrl,
        status: 'Active',
        startDate,
        endDate,
      });
      showToast(`Poster "${title}" updated.`);
    } else {
      addBanner({
        title: title.trim(),
        tag: tag.trim(),
        buttonText: buttonText.trim(),
        linkType,
        targetCategory,
        targetProductId,
        type,
        image: imageUrl,
        status: 'Active',
        startDate,
        endDate,
      });
      showToast(`Poster "${title}" created and published to storefront.`);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete poster "${name}"?`)) {
      deleteBanner(id);
      showToast('Poster deleted.');
    }
  };

  const activePoster = activePosters[previewIdx % (activePosters.length || 1)] || banners[0];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Posters / Hero Banners
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400">
              Live Storefront
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage storefront hero poster cards, click destination actions, and auto-slide animation
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#DF1951] hover:bg-[#C91345] text-white font-bold text-xs shadow-md shadow-rose-900/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Poster</span>
        </button>
      </div>

      {/* Auto-Slide Settings Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-[#DF1951] flex items-center justify-center shrink-0">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
              Hero Banner Auto-Slide
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Automatically rotates between active promotional posters on the customer storefront
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Auto-slide toggle button */}
          <button
            type="button"
            onClick={() => {
              const nextState = !bannerSettings.autoSlide;
              updateBannerSettings({ autoSlide: nextState });
              showToast(nextState ? 'Banner auto-sliding enabled!' : 'Banner auto-sliding paused.');
            }}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              bannerSettings.autoSlide
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {bannerSettings.autoSlide ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            <span>Auto-Slide: {bannerSettings.autoSlide ? 'ON' : 'OFF'}</span>
          </button>

          {/* Speed Preset Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {[
              { label: '⚡ 3s (Requested)', val: 3 },
              { label: '4s (Normal)', val: 4 },
              { label: '5s (Relaxed)', val: 5 },
            ].map((spd) => (
              <button
                key={spd.val}
                type="button"
                onClick={() => {
                  updateBannerSettings({ intervalSeconds: spd.val });
                  showToast(`Slide interval set to ${spd.val} seconds.`);
                }}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  bannerSettings.intervalSeconds === spd.val
                    ? 'bg-[#DF1951] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>

          {/* Pause on hover toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !bannerSettings.pauseOnHover;
              updateBannerSettings({ pauseOnHover: next });
              showToast(next ? 'Pause on hover enabled' : 'Pause on hover disabled');
            }}
            className={`px-3 py-2 rounded-xl font-bold text-[11px] border transition-all cursor-pointer ${
              bannerSettings.pauseOnHover
                ? 'border-pink-300 dark:border-pink-800 bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
          >
            Pause on Hover: {bannerSettings.pauseOnHover ? 'Yes' : 'No'}
          </button>
        </div>
      </div>

      {/* Live Storefront Preview Section */}
      {activePoster && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Live Storefront Poster Preview ({previewIdx + 1} of {activePosters.length})
              </span>
              {bannerSettings.autoSlide && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center gap-1 animate-pulse">
                  ● Auto-Sliding ({bannerSettings.intervalSeconds}s)
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => openEditModal(activePoster)}
              className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Active Poster</span>
            </button>
          </div>

          {/* Exact Card Preview with Horizontal Sliding Animation */}
          <div
            onMouseEnter={() => setPreviewPaused(true)}
            onMouseLeave={() => setPreviewPaused(false)}
            className="relative rounded-[28px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[210px] group transition-all select-none"
          >
            {/* Horizontal Sliding Track */}
            <div
              className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: `translateX(-${(previewIdx % (activePosters.length || 1)) * 100}%)`,
              }}
            >
              {activePosters.map((poster, i) => (
                <div
                  key={poster.id || i}
                  className="w-full shrink-0 relative p-6 sm:p-8 flex items-center justify-between min-h-[210px]"
                >
                  {/* Background Model Image */}
                  <div className="absolute inset-y-0 right-0 w-[58%] sm:w-[50%] overflow-hidden pointer-events-none">
                    <img
                      src={poster.image}
                      alt={poster.title}
                      className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent dark:from-slate-900 dark:via-slate-900/85" />
                  </div>

                  {/* Poster Text Content */}
                  <div className="relative z-10 max-w-[62%] flex flex-col items-start">
                    <span className="text-[11px] sm:text-xs font-black tracking-wider text-[#DF1951] uppercase mb-1">
                      {poster.tag || 'NEW SEASON 2026'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                      {poster.title}
                    </h2>
                    <div className="mt-3.5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#DF1951] text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/20">
                      <span>{poster.buttonText || 'Shop Now →'}</span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      <span>Opens:</span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 font-bold border border-slate-200 dark:border-slate-700">
                        {poster.linkType === 'product'
                          ? `🛍️ Product: ${products.find((p) => p.id === poster.targetProductId)?.name || 'Selected Product'}`
                          : `📁 Category: ${poster.targetCategory || 'Women'}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 3s Visual Sliding Progress Bar in Admin Preview */}
            {bannerSettings.autoSlide && activePosters.length > 1 && !previewPaused && (
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-100 dark:bg-slate-800 z-20 overflow-hidden">
                <div
                  key={`${previewIdx}-${bannerSettings.intervalSeconds || 3}`}
                  className="h-full bg-[#DF1951]"
                  style={{
                    animation: `bannerProgress ${bannerSettings.intervalSeconds || 3}s linear forwards`,
                  }}
                />
              </div>
            )}

            {/* Manual Slide Controls */}
            {activePosters.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setPreviewIdx((prev) => (prev - 1 + activePosters.length) % activePosters.length)}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white active:scale-90"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewIdx((prev) => (prev + 1) % activePosters.length)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white active:scale-90"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Indicator Dots */}
            {activePosters.length > 1 && (
              <div className="absolute bottom-2.5 right-3.5 z-20 flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-2.5 py-1 rounded-full">
                {activePosters.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPreviewIdx(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                      previewIdx % activePosters.length === i
                        ? 'w-5 bg-[#DF1951]'
                        : 'w-1.5 bg-white/70 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {banners.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No posters or hero banners uploaded yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
              Add promotional banners to highlight seasonal sales, new drops, or clearance discounts on your storefront.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#DF1951] text-white text-xs font-bold shadow-md hover:bg-[#BE123C] transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add First Banner / Poster</span>
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            All Poster Banners ({banners.length})
          </h3>
          <span className="text-[11px] text-slate-400">
            Active posters appear directly in the home hero section
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Preview</th>
                <th className="py-3 px-4">Headline / Tag</th>
                <th className="py-3 px-4">Click Destination</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {banners.map((ban) => (
                <tr
                  key={ban.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="w-16 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <img
                        src={ban.image}
                        alt={ban.title}
                        className="w-full h-full object-cover object-[center_20%]"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {ban.title}
                    </div>
                    <div className="text-[10px] text-[#DF1951] font-bold">
                      {ban.tag || 'NEW SEASON 2026'}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold inline-block">
                      {ban.linkType === 'product'
                        ? `🛍️ Product: ${(products.find((p) => p.id === ban.targetProductId)?.name || 'Item').slice(0, 16)}...`
                        : `📁 Category: ${ban.targetCategory || 'Women'}`}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {ban.startDate} - {ban.endDate}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => toggleBannerStatus(ban.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-transform active:scale-95 ${
                        ban.status === 'Active'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      ● {ban.status}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(ban)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Poster"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBannerId(ban.id);
                          setAdminTab('banner_detail');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ban.id, ban.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete Poster"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Add / Edit Poster Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingId ? 'Edit Storefront Poster' : 'Add Storefront Poster'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="py-4 space-y-3.5">
              {/* Headline Title */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Poster Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Style for Every You"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              {/* Subtitle Tag & Button Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Red Subtitle Tag *
                  </label>
                  <input
                    type="text"
                    required
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. NEW SEASON 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white uppercase font-bold text-pink-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    required
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="e.g. Shop Now →"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Click Action Destination (Go to Category or Product) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">
                  When customer clicks this poster, open:
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLinkType('category')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      linkType === 'category'
                        ? 'bg-[#DF1951] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>📁 Category Page</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLinkType('product')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      linkType === 'product'
                        ? 'bg-[#DF1951] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>🏷️ Specific Product</span>
                  </button>
                </div>

                {linkType === 'category' ? (
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1 text-[11px]">
                      Select Category to open:
                    </label>
                    <select
                      value={targetCategory}
                      onChange={(e) => setTargetCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                    >
                      <option value="Women">Women Collection</option>
                      <option value="Men">Men Collection</option>
                      <option value="Footwear">Footwear Collection</option>
                      <option value="Bags">Bags & Handbags</option>
                      <option value="Home">Home & Living</option>
                      <option value="Electronics">Electronics & Watches</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1 text-[11px]">
                      Select Specific Product to open:
                    </label>
                    <select
                      value={targetProductId}
                      onChange={(e) => setTargetProductId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ₹{p.price.toLocaleString('en-IN')} ({p.category})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Image Upload / URL with Presets */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Poster Image *
                </label>
                
                {/* Device File Upload Button */}
                <div className="flex items-center gap-3 mb-2">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Poster Preview"
                      className="w-14 h-10 rounded-xl object-cover ring-2 ring-pink-500/30 shrink-0"
                    />
                  )}
                  <label className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors border border-slate-200 dark:border-slate-700">
                    <Camera className="w-4 h-4 text-pink-500" />
                    <span>Upload Poster Photo from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            showToast('Image size must be under 5MB', 'error');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              setImageUrl(ev.target.result as string);
                              showToast('Poster photo loaded from device!');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <p className="text-[10px] text-slate-400 mb-1">Or paste web image URL below:</p>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                />

                {/* Preset image thumbnails */}
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Quick Preset Poster Photos:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {presetImages.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImageUrl(p.url)}
                        className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all ${
                          imageUrl === p.url
                            ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={p.url}
                          alt={p.name}
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                        <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                          {p.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#DF1951] hover:bg-[#C91345] text-white font-bold shadow-md transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Publish Poster'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
