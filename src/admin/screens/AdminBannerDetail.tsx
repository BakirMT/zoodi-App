import React, { useState } from 'react';
import { ArrowLeft, Trash2, Edit2, Calendar, X, Sparkles } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';

export const AdminBannerDetail: React.FC = () => {
  const { banners, selectedBannerId, setAdminTab, deleteBanner, toggleBannerStatus, updateBanner } = useAdmin();
  const { showToast, products } = useApp();

  const banner =
    banners.find((b) => b.id === selectedBannerId) || banners[0];

  const [showEditModal, setShowEditModal] = useState(false);
  const [title, setTitle] = useState(banner?.title || '');
  const [tag, setTag] = useState(banner?.tag || 'NEW SEASON 2026');
  const [buttonText, setButtonText] = useState(banner?.buttonText || 'Shop Now →');
  const [linkType, setLinkType] = useState<'category' | 'product'>(banner?.linkType || 'category');
  const [targetCategory, setTargetCategory] = useState(banner?.targetCategory || 'Women');
  const [targetProductId, setTargetProductId] = useState(banner?.targetProductId || products[0]?.id || 'prod_1');
  const [imageUrl, setImageUrl] = useState(banner?.image || '');

  if (!banner) return null;

  const handleDelete = () => {
    if (window.confirm(`Delete poster "${banner.title}"?`)) {
      deleteBanner(banner.id);
      showToast('Poster deleted.');
      setAdminTab('banners');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBanner({
      ...banner,
      title: title.trim(),
      tag: tag.trim(),
      buttonText: buttonText.trim(),
      linkType,
      targetCategory,
      targetProductId,
      image: imageUrl.trim() || banner.image,
    });
    showToast('Poster click action and details updated.');
    setShowEditModal(false);
  };

  const linkedProduct = products.find((p) => p.id === banner.targetProductId);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
      {/* Top back */}
      <button
        type="button"
        onClick={() => setAdminTab('banners')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-pink-600"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Posters</span>
      </button>

      {/* Main Banner Card (Matching Screen 13 in mockup) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-4">
        {/* Exact Poster Graphic Preview matching Screenshot */}
        <div className="relative rounded-[28px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-7 flex items-center justify-between min-h-[195px]">
          <div className="absolute inset-y-0 right-0 w-[58%] sm:w-[50%] overflow-hidden pointer-events-none">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover object-[center_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent dark:from-slate-900 dark:via-slate-900/85" />
          </div>

          <div className="relative z-10 max-w-[62%] flex flex-col items-start">
            <span className="text-[11px] sm:text-xs font-black tracking-wider text-[#DF1951] uppercase mb-1">
              {banner.tag || 'NEW SEASON 2026'}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
              {banner.title}
            </h2>
            <div className="mt-3.5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#DF1951] text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/20">
              <span>{banner.buttonText || 'Shop Now →'}</span>
            </div>
          </div>
        </div>

        {/* Title, Type, Status */}
        <div className="space-y-3 pt-2 text-xs">
          <div>
            <span className="text-slate-400 font-bold block mb-0.5">Poster Title</span>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {banner.title}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 font-bold block mb-0.5">Category Tag</span>
              <span className="font-bold text-[#DF1951]">
                {banner.tag || 'NEW SEASON 2026'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-0.5">Target Destination Type</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {banner.linkType === 'product' ? '🏷️ Single Product Page' : '📁 Category Listing Page'}
              </span>
            </div>
          </div>

          {/* Active Click Destination Info */}
          <div className="p-3 rounded-2xl bg-pink-50/50 dark:bg-pink-950/30 border border-pink-200/60 dark:border-pink-900/50 space-y-1">
            <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider block">
              When clicked by customer:
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {banner.linkType === 'product' ? (
                <>
                  <span className="text-base">🛍️</span>
                  <span>
                    Opens Product: {linkedProduct?.name || 'Selected Item'} (₹{linkedProduct?.price})
                  </span>
                </>
              ) : (
                <>
                  <span className="text-base">📁</span>
                  <span>
                    Opens Category: {banner.targetCategory || 'Women'} Collection
                  </span>
                </>
              )}
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-bold block mb-0.5">Live Storefront Status</span>
            <button
              type="button"
              onClick={() => toggleBannerStatus(banner.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                banner.status === 'Active'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
              }`}
            >
              ● {banner.status} (Click to toggle)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400 font-bold block mb-0.5">Start Date</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-pink-500" />
                <span>{banner.startDate}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-bold block mb-0.5">End Date</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-pink-500" />
                <span>{banner.endDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setTitle(banner.title);
              setTag(banner.tag || 'NEW SEASON 2026');
              setButtonText(banner.buttonText || 'Shop Now →');
              setLinkType(banner.linkType || 'category');
              setTargetCategory(banner.targetCategory || 'Women');
              setTargetProductId(banner.targetProductId || products[0]?.id || 'prod_1');
              setImageUrl(banner.image);
              setShowEditModal(true);
            }}
            className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Poster Destination</span>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-bold text-xs border border-rose-200 dark:border-rose-900/50 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Poster & Click Destination
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="py-4 space-y-3.5">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Poster Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Red Tag Subtitle
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-pink-600 font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Destination selector: Category or Product */}
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

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Poster Image URL
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#DF1951] hover:bg-[#C91345] text-white font-bold shadow-md transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
