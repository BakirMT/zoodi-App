import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, FolderPlus, Sparkles, Camera, Upload } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import { AdminCategory } from '../../types/admin';

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, deleteCategory, updateCategory } = useAdmin();
  const { showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80'
  );

  const PRESET_CATEGORY_IMAGES = [
    { label: 'Women', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80' },
    { label: 'Men', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
    { label: 'Footwear', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80' },
    { label: 'Bags', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80' },
    { label: 'Home', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=80' },
    { label: 'Accessories', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80' },
  ];

  const filtered = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || c.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string, catName: string) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      deleteCategory(id);
      showToast(`Category "${catName}" deleted.`);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setSubtitle('');
    setImage(PRESET_CATEGORY_IMAGES[0].url);
    setShowModal(true);
  };

  const openEditModal = (cat: AdminCategory) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSubtitle(cat.subtitle);
    setImage(cat.image);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter category name', 'error');
      return;
    }

    if (editingId) {
      updateCategory({
        id: editingId,
        name: name.trim(),
        subtitle: subtitle.trim() || `${name.trim()} collection`,
        count: categories.find((c) => c.id === editingId)?.count || 0,
        type: name.trim(),
        image: image.trim() || PRESET_CATEGORY_IMAGES[0].url,
      });
      showToast(`Category "${name}" updated.`);
    } else {
      addCategory({
        name: name.trim(),
        subtitle: subtitle.trim() || `${name.trim()} collection`,
        type: name.trim(),
        image: image.trim() || PRESET_CATEGORY_IMAGES[0].url,
      });
      showToast(`Category "${name}" created.`);
    }
    setShowModal(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Organize catalog departments and navigation sections
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs shadow-md shadow-rose-900/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search Input */}
      {categories.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-xs"
          />
        </div>
      )}

      {/* Category List */}
      {filtered.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <FolderPlus className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No categories created yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
              Add your store departments like Women, Men, Footwear, Bags, or Accessories.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#DF1951] text-white text-xs font-bold shadow-md hover:bg-[#BE123C] transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create First Category</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((cat) => (
            <div
              key={cat.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between hover:border-pink-500/40 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.subtitle}</p>
                </div>
              </div>

              {/* Edit & Delete Action Icons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="p-2 rounded-xl text-slate-400 hover:text-pink-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="py-4 space-y-3.5">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Women, Men, Footwear, Bags"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Subtitle Description
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Clothing & Ethnic Wear"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>

              {/* Category Image - Direct Upload or URL/Presets */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Category Photo / Image
                </label>
                
                {/* File Upload Button */}
                <div className="flex items-center gap-3 mb-2">
                  {image && (
                    <img
                      src={image}
                      alt="Category preview"
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-pink-500/20 shrink-0"
                    />
                  )}
                  <label className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors border border-slate-200 dark:border-slate-700">
                    <Camera className="w-4 h-4 text-pink-500" />
                    <span>Upload Image from Device</span>
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
                              setImage(ev.target.result as string);
                              showToast('Category photo uploaded from device!');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <p className="text-[10px] text-slate-400 mb-1">Or paste web image URL or select preset below:</p>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500 text-xs"
                />
              </div>

              {/* Quick image preset chips */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Quick Image Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_CATEGORY_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setImage(preset.url);
                        if (!name) setName(preset.label);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold hover:bg-pink-100 dark:hover:bg-pink-950/40 hover:text-pink-600 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#DF1951] text-white font-bold shadow-md hover:bg-[#BE123C] transition-colors mt-2"
              >
                {editingId ? 'Save Changes' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
