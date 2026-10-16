import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Upload,
  Sparkles,
  Palette,
  Layers,
  FileText,
  Sliders,
  DollarSign,
  Tag,
  Star,
  Image as ImageIcon,
  ArrowLeft as MoveLeft,
  ArrowRight as MoveRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { Product } from '../../types';

interface AdminProductFormProps {
  mode: 'add' | 'edit';
  productId?: string;
}

// Available standard colors
const PRESET_COLORS = [
  { name: 'Yellow', hex: '#FBBF24' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Navy', hex: '#1E293B' },
  { name: 'Rose', hex: '#F43F5E' },
  { name: 'Black', hex: '#111827' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Crimson', hex: '#E11D48' },
  { name: 'Beige', hex: '#D2B48C' },
  { name: 'Sky Blue', hex: '#0EA5E9' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Brown', hex: '#78350F' },
];

// Available standard sizes
const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];
const FOOTWEAR_SIZES = ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];

// Multi-image preset gallery packs
const GALLERY_PACKS = [
  {
    name: 'Women Dress Multi-Angle (3 Photos)',
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Men Streetwear Multi-Angle (3 Photos)',
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Sneakers Gallery (3 Photos)',
    category: 'Footwear',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Leather Handbag Gallery (3 Photos)',
    category: 'Bags',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

export const AdminProductForm: React.FC<AdminProductFormProps> = ({ mode, productId }) => {
  const { products, addProduct, updateProduct, showToast } = useApp();
  const { setAdminTab, selectedAdminProductId } = useAdmin();

  const targetId = productId || selectedAdminProductId;
  const existingProduct = mode === 'edit' ? products.find((p) => p.id === targetId) : undefined;

  // Basic Details
  const [name, setName] = useState(existingProduct?.name || '');
  const [category, setCategory] = useState<Product['category']>(existingProduct?.category || 'Women');
  const [subcategory, setSubcategory] = useState(existingProduct?.subcategory || 'Dresses');
  const [description, setDescription] = useState(
    existingProduct?.description || 'Crafted with premium materials, elegant cuts, and all-day comfort.'
  );

  // Pricing & Inventory
  const [price, setPrice] = useState(existingProduct ? String(existingProduct.price) : '1299');
  const [originalPrice, setOriginalPrice] = useState(
    existingProduct?.originalPrice ? String(existingProduct.originalPrice) : '1799'
  );
  const [stock, setStock] = useState('45');
  const [inStock, setInStock] = useState(existingProduct ? existingProduct.inStock : true);

  // Colors
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>(
    existingProduct?.colors && existingProduct.colors.length > 0
      ? existingProduct.colors
      : [
          { name: 'Yellow', hex: '#FBBF24' },
          { name: 'Navy', hex: '#1E293B' },
          { name: 'Black', hex: '#111827' },
        ]
  );
  const [primaryColor, setPrimaryColor] = useState(existingProduct?.color || 'Yellow');
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#E11D48');

  // Sizes
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    existingProduct?.sizes && existingProduct.sizes.length > 0
      ? existingProduct.sizes
      : ['S', 'M', 'L', 'XL']
  );
  const [customSize, setCustomSize] = useState('');

  // Specs
  const [fabric, setFabric] = useState(existingProduct?.specs?.['Fabric'] || '100% Cotton Blend');
  const [origin, setOrigin] = useState(existingProduct?.specs?.['Origin'] || 'Made in India');
  const [fit, setFit] = useState(existingProduct?.specs?.['Fit'] || 'Regular Fit');
  const [care, setCare] = useState(existingProduct?.specs?.['Care'] || 'Machine wash cold');
  const [occasion, setOccasion] = useState(existingProduct?.specs?.['Occasion'] || 'Casual & Party wear');

  // Badges
  const [isPopular, setIsPopular] = useState(existingProduct?.isPopular ?? true);
  const [featured, setFeatured] = useState(existingProduct?.featured ?? false);

  // Multiple Image Gallery
  const [images, setImages] = useState<string[]>(() => {
    if (existingProduct?.images && existingProduct.images.length > 0) {
      return existingProduct.images;
    }
    if (existingProduct?.image) {
      return [existingProduct.image];
    }
    return [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    ];
  });
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Auto calculate discount percentage
  const numPrice = parseFloat(price) || 0;
  const numOrig = parseFloat(originalPrice) || 0;
  const discountPct =
    numOrig > numPrice && numPrice > 0
      ? Math.round(((numOrig - numPrice) / numOrig) * 100)
      : 15;

  // Handle local file uploads (multiple images supported)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setImages((prev) => [...prev, result]);
          showToast(`Uploaded "${file.name}"`);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  // Add custom URL image
  const addImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    if (!images.includes(trimmed)) {
      setImages((prev) => [...prev, trimmed]);
      setNewImageUrl('');
      showToast('Image URL added to gallery.');
    }
  };

  // Delete image from gallery
  const removeImage = (index: number) => {
    if (images.length <= 1) {
      showToast('Product must have at least one image.', 'info');
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (primaryImageIndex >= index && primaryImageIndex > 0) {
      setPrimaryImageIndex((prev) => prev - 1);
    }
  };

  // Move image order
  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const newArr = [...images];
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setImages(newArr);

    if (primaryImageIndex === index) {
      setPrimaryImageIndex(targetIdx);
    } else if (primaryImageIndex === targetIdx) {
      setPrimaryImageIndex(index);
    }
  };

  // Add preset gallery pack
  const loadGalleryPack = (pack: typeof GALLERY_PACKS[0]) => {
    setImages(pack.images);
    setPrimaryImageIndex(0);
    setCategory(pack.category as any);
    showToast(`Loaded ${pack.name}`);
  };

  // Toggle color
  const togglePresetColor = (colorItem: { name: string; hex: string }) => {
    const exists = selectedColors.some((c) => c.name.toLowerCase() === colorItem.name.toLowerCase());
    if (exists) {
      if (selectedColors.length <= 1) {
        showToast('Please keep at least one color selected', 'info');
        return;
      }
      setSelectedColors((prev) => prev.filter((c) => c.name.toLowerCase() !== colorItem.name.toLowerCase()));
      if (primaryColor.toLowerCase() === colorItem.name.toLowerCase()) {
        const remaining = selectedColors.filter((c) => c.name.toLowerCase() !== colorItem.name.toLowerCase());
        setPrimaryColor(remaining[0]?.name || 'Yellow');
      }
    } else {
      setSelectedColors((prev) => [...prev, colorItem]);
    }
  };

  // Add custom color
  const addCustomColor = () => {
    if (!customColorName.trim()) return;
    const newC = { name: customColorName.trim(), hex: customColorHex };
    if (!selectedColors.some((c) => c.name.toLowerCase() === newC.name.toLowerCase())) {
      setSelectedColors((prev) => [...prev, newC]);
      setCustomColorName('');
      showToast(`Added color "${newC.name}"`);
    }
  };

  // Toggle size
  const toggleSize = (s: string) => {
    if (selectedSizes.includes(s)) {
      if (selectedSizes.length <= 1) {
        showToast('Please keep at least one size selected', 'info');
        return;
      }
      setSelectedSizes((prev) => prev.filter((item) => item !== s));
    } else {
      setSelectedSizes((prev) => [...prev, s]);
    }
  };

  // Add custom size
  const addCustomSize = () => {
    const trimmed = customSize.trim().toUpperCase();
    if (!trimmed) return;
    if (!selectedSizes.includes(trimmed)) {
      setSelectedSizes((prev) => [...prev, trimmed]);
      setCustomSize('');
      showToast(`Added size "${trimmed}"`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    if (numPrice <= 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }
    if (images.length === 0) {
      showToast('Please add at least one product image', 'error');
      return;
    }

    const coverImage = images[primaryImageIndex] || images[0];

    const productPayload: Omit<Product, 'id'> = {
      name: name.trim(),
      category,
      subcategory: subcategory.trim() || 'General',
      price: numPrice,
      originalPrice: numOrig > 0 ? numOrig : Math.round(numPrice * 1.3),
      discountPercent: discountPct,
      rating: existingProduct?.rating || 4.8,
      reviewsCount: existingProduct?.reviewsCount || 1,
      image: coverImage,
      images: images,
      description: description.trim(),
      color: primaryColor,
      colors: selectedColors,
      size: selectedSizes[0] || 'M',
      sizes: selectedSizes,
      inStock,
      isPopular,
      featured,
      specs: {
        Fabric: fabric.trim() || 'Premium Blend',
        Origin: origin.trim() || 'Made in India',
        Fit: fit.trim() || 'Regular Fit',
        Care: care.trim() || 'Machine wash',
        Occasion: occasion.trim() || 'Casual & Party',
      },
    };

    if (mode === 'edit' && existingProduct) {
      updateProduct({
        ...productPayload,
        id: existingProduct.id,
      });
      showToast(`Product "${name}" updated successfully!`);
      setAdminTab('products');
    } else {
      addProduct(productPayload);
      showToast(`Product "${name}" added to catalog with ${images.length} images!`);
      setAdminTab('products');
    }
  };

  const coverImage = images[primaryImageIndex] || images[0];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAdminTab('products')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-pink-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {mode === 'edit'
                ? `Update details, multi-image gallery (${images.length} photos), colors, sizes, and specs`
                : `Configure product listing, multi-image gallery (${images.length} photos), colors, sizes, and specs`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#DF1951] hover:bg-[#C91345] text-white font-bold text-xs shadow-md shadow-rose-900/20 active:scale-95 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>{mode === 'edit' ? 'Save Changes' : 'Publish Product'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Multi-Image Gallery & Upload Options */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-pink-500" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                1. Product Image Gallery ({images.length} Photos)
              </h2>
            </div>
            <span className="text-[11px] text-pink-600 font-bold">
              ★ Cover photo #{primaryImageIndex + 1}
            </span>
          </div>

          {/* Upload and Add Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Device File Upload Box */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center flex flex-col items-center justify-center space-y-2 hover:border-pink-500 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-[#DF1951] flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                  Upload Photos from Device
                </span>
                <span className="text-[11px] text-slate-400">
                  Select one or multiple images from phone/computer
                </span>
              </div>
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-xs hover:bg-[#DF1951] dark:hover:bg-[#DF1951] dark:hover:text-white transition-colors">
                <span>Browse Files</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Add via Web URL */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-2">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs mb-1">
                  Add Image by Web URL
                </span>
                <span className="text-[11px] text-slate-400 block mb-2">
                  Paste external high-res photo link (Unsplash, CDN, etc.)
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="px-3.5 py-2 rounded-xl bg-[#DF1951] text-white font-bold text-xs hover:bg-[#C91345] transition-colors shrink-0"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Multi-angle Preset Packs */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">
                  Quick Multi-Angle Gallery Packs:
                </span>
                <div className="flex flex-wrap gap-1">
                  {GALLERY_PACKS.map((pack, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => loadGalleryPack(pack)}
                      className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:border-pink-500 bg-white dark:bg-slate-800"
                    >
                      {pack.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Gallery Thumbnails Grid */}
          <div className="pt-2 space-y-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 block text-xs">
              Current Gallery Images ({images.length}):
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((imgSrc, idx) => {
                const isCover = primaryImageIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`relative rounded-2xl overflow-hidden border transition-all group bg-slate-100 dark:bg-slate-800 ${
                      isCover
                        ? 'border-pink-500 ring-2 ring-pink-500/30 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {/* Image Preview */}
                    <div className="aspect-3/4 w-full overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={`Product shot ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Cover Badge */}
                    {isCover && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#DF1951] text-white text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Cover</span>
                      </div>
                    )}

                    {/* Quick Management Overlay */}
                    <div className="p-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-[10px]">
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveImage(idx, 'left')}
                          className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-30"
                          title="Move left"
                        >
                          <MoveLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === images.length - 1}
                          onClick={() => moveImage(idx, 'right')}
                          className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-30"
                          title="Move right"
                        >
                          <MoveRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImageIndex(idx)}
                            className="p-1 rounded hover:bg-pink-50 text-slate-400 hover:text-pink-600 font-bold"
                            title="Set as Cover Photo"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 2: Basic Information */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <FileText className="w-4 h-4 text-pink-500" />
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              2. Basic Information
            </h2>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Product Title / Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Floral Printed Summer Dress"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Department Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Product['category'])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              >
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Footwear">Footwear</option>
                <option value="Bags">Bags</option>
                <option value="Home">Home</option>
                <option value="Electronics">Electronics</option>
                <option value="Beauty">Beauty</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Subcategory / Type *
              </label>
              <input
                type="text"
                required
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Dresses, Kurtis, Sneakers, Handbags"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Full Description & Material Details *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe silhouette, drape, fabric feel, occasions, and key highlights..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* SECTION 3: Pricing & Inventory */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <DollarSign className="w-4 h-4 text-pink-500" />
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              3. Pricing & Inventory
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 1299"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                MRP / Original Price (₹)
              </label>
              <input
                type="number"
                min="1"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="e.g. 1799"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              />
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">
                Calculated Discount: {discountPct}% OFF
              </span>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Stock Quantity (Units)
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g. 45"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
              />
              <span className="font-bold text-slate-700 dark:text-slate-300">
                In Stock & Available to Buy
              </span>
            </label>
          </div>
        </div>

        {/* SECTION 4: Color Selection */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-pink-500" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                4. Available Color Variants ({selectedColors.length} selected)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Click to select/deselect</span>
          </div>

          {/* Color Chips Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {PRESET_COLORS.map((col) => {
              const isSelected = selectedColors.some(
                (c) => c.name.toLowerCase() === col.name.toLowerCase()
              );

              return (
                <div
                  key={col.name}
                  onClick={() => togglePresetColor(col)}
                  className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50/40 dark:bg-pink-950/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: col.hex }}
                      className="w-5 h-5 rounded-full border border-black/15 shadow-xs shrink-0"
                    />
                    <span className="font-bold text-[11px] text-slate-900 dark:text-white">
                      {col.name}
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 stroke-[3]" />}
                </div>
              );
            })}
          </div>

          {/* Primary Color Selector */}
          <div className="pt-2">
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Primary / Default Color Shown on Storefront:
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedColors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setPrimaryColor(c.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    primaryColor.toLowerCase() === c.name.toLowerCase()
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span
                    style={{ backgroundColor: c.hex }}
                    className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add Custom Color Input */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Add Custom Color:
            </span>
            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={customColorName}
                onChange={(e) => setCustomColorName(e.target.value)}
                placeholder="Color Name (e.g. Lavender, Mint)"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold"
              />
              <input
                type="color"
                value={customColorHex}
                onChange={(e) => setCustomColorHex(e.target.value)}
                className="w-10 h-9 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5"
                title="Choose Hex Color"
              />
              <button
                type="button"
                onClick={addCustomColor}
                className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-pink-600 text-white font-bold text-xs transition-colors shrink-0"
              >
                + Add Color
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 5: Size Run Selection */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-500" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                5. Available Sizes ({selectedSizes.length} selected)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Click to toggle sizes</span>
          </div>

          {/* Standard Apparel Sizes */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Apparel Standard Sizes
            </span>
            <div className="flex flex-wrap gap-2">
              {APPAREL_SIZES.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                      isSelected
                        ? 'bg-[#DF1951] text-white shadow-xs scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footwear UK Sizes */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Footwear / Shoe Sizes
            </span>
            <div className="flex flex-wrap gap-2">
              {FOOTWEAR_SIZES.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Size Addition */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 max-w-sm">
            <input
              type="text"
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              placeholder="Custom size (e.g. 32, 34, 40)"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold uppercase"
            />
            <button
              type="button"
              onClick={addCustomSize}
              className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-pink-600 text-white font-bold text-xs transition-colors shrink-0"
            >
              + Add Size
            </button>
          </div>
        </div>

        {/* SECTION 6: Specifications & Attributes */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-pink-500" />
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              6. Product Specifications & Material Specs
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Fabric / Material
              </label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g. 100% Pure Cotton Blend, Rayon"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Origin / Made In
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Made in India"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Fit Type
              </label>
              <input
                type="text"
                value={fit}
                onChange={(e) => setFit(e.target.value)}
                placeholder="e.g. Regular Fit, Slim Fit, Oversized"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Wash & Care Instructions
              </label>
              <input
                type="text"
                value={care}
                onChange={(e) => setCare(e.target.value)}
                placeholder="e.g. Machine wash cold, dry in shade"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Occasion / Wear Style
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="e.g. Casual, Festive, Evening & Party wear"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              />
            </div>
          </div>
        </div>

        {/* SECTION 7: Badges & Merchandising */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Star className="w-4 h-4 text-pink-500" />
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              7. Storefront Badges & Visibility
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Popular / Trending Item
                </span>
                <span className="text-[11px] text-slate-400">
                  Displays in "POPULAR" section on homepage
                </span>
              </div>
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="w-5 h-5 rounded text-pink-600 focus:ring-pink-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Featured Product
                </span>
                <span className="text-[11px] text-slate-400">
                  Featured highlights & top promotional ranking
                </span>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5 rounded text-pink-600 focus:ring-pink-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={() => setAdminTab('products')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-[#DF1951] hover:bg-[#C91345] text-white font-bold shadow-md shadow-rose-900/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{mode === 'edit' ? 'Update Product Details' : 'Publish Product to Store'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
