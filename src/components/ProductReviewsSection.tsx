import React, { useState, useRef } from 'react';
import {
  Star,
  ThumbsUp,
  CheckCircle,
  MessageSquarePlus,
  X,
  Filter,
  Sparkles,
  User,
  Camera,
  Image as ImageIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  UploadCloud,
  Link as LinkIcon,
} from 'lucide-react';
import { ProductReview, Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductReviewsSectionProps {
  product: Product;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product }) => {
  const {
    user,
    getProductReviews,
    submitProductReview,
    toggleReviewHelpful,
    showToast,
  } = useApp();

  const productReviews = getProductReviews(product.id);

  // Form states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter & Sort states
  const [filterStar, setFilterStar] = useState<number | 'all'>('all');
  const [filterWithPhotosOnly, setFilterWithPhotosOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');

  // Lightbox Modal state for full-screen customer photo viewing
  const [lightboxData, setLightboxData] = useState<{
    imageUrl: string;
    review: ProductReview;
    index: number;
    total: number;
  } | null>(null);

  const ratingLabels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent!',
  };

  // Sample customer photos for fast 1-tap testing
  const sampleCustomerPhotos = [
    {
      label: 'Fitting Photo',
      url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Fabric Close-up',
      url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Unboxing & Tag',
      url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Outdoor Light',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Calculate breakdown counts
  const totalCount = productReviews.length;
  const starCounts = {
    5: productReviews.filter((r) => r.rating === 5).length,
    4: productReviews.filter((r) => r.rating === 4).length,
    3: productReviews.filter((r) => r.rating === 3).length,
    2: productReviews.filter((r) => r.rating === 2).length,
    1: productReviews.filter((r) => r.rating === 1).length,
  };

  // All customer photos gathered from reviews
  const allCustomerPhotos = productReviews.flatMap((r) =>
    (r.images || []).map((img) => ({ img, review: r }))
  );

  const reviewsWithPhotosCount = productReviews.filter(
    (r) => r.images && r.images.length > 0
  ).length;

  // Average rating
  const averageRating =
    totalCount > 0
      ? (
          productReviews.reduce((acc, r) => acc + r.rating, 0) / totalCount
        ).toFixed(1)
      : product.rating.toFixed(1);

  // Handle Image File Upload (device camera / gallery)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (reviewImages.length + files.length > 5) {
      showToast('Maximum 5 images allowed per review.', 'error');
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        showToast('Please upload valid image files.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setReviewImages((prev) => (prev.length < 5 ? [...prev, result] : prev));
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input so re-selecting same file triggers event
    e.target.value = '';
    showToast('Customer image(s) attached!');
  };

  // Handle adding image via URL
  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (reviewImages.length >= 5) {
      showToast('Maximum 5 images allowed per review.', 'error');
      return;
    }
    setReviewImages((prev) => [...prev, trimmed]);
    setImageUrlInput('');
    setShowUrlInput(false);
    showToast('Customer photo link added!');
  };

  const handleAddSamplePhoto = (url: string) => {
    if (reviewImages.includes(url)) {
      showToast('Photo already attached!');
      return;
    }
    if (reviewImages.length >= 5) {
      showToast('Maximum 5 images allowed per review.', 'error');
      return;
    }
    setReviewImages((prev) => [...prev, url]);
    showToast('Sample customer photo attached!');
  };

  const handleRemoveImage = (index: number) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Review Submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please write a short review comment before submitting.', 'error');
      return;
    }

    if (selectedRating < 1 || selectedRating > 5) {
      showToast('Please select a star rating between 1 and 5.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitProductReview(
        product.id,
        selectedRating,
        reviewComment.trim(),
        reviewTitle.trim() || undefined,
        reviewImages.length > 0 ? reviewImages : undefined
      );
      setReviewComment('');
      setReviewTitle('');
      setReviewImages([]);
      setSelectedRating(5);
      setShowReviewForm(false);
      setIsSubmitting(false);
    }, 300);
  };

  // Filtered & Sorted Reviews
  const filteredReviews = productReviews
    .filter((r) => {
      if (filterWithPhotosOnly && (!r.images || r.images.length === 0)) {
        return false;
      }
      if (filterStar !== 'all' && r.rating !== filterStar) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0; // Default recent
    });

  return (
    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>Customer Ratings & Reviews</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400">
              {productReviews.length}
            </span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Real customer feedback with photos & ratings
          </p>
        </div>

        {!showReviewForm && (
          <button
            type="button"
            onClick={() => setShowReviewForm(true)}
            className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Write Review</span>
          </button>
        )}
      </div>

      {/* Review Submission Form Card */}
      {showReviewForm && (
        <form
          onSubmit={handleSubmitReview}
          className="p-4 rounded-2xl bg-pink-50/50 dark:bg-slate-800/60 border border-pink-200 dark:border-pink-900/30 flex flex-col gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Share Your Review & Photos
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Star Rating Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Overall Rating <span className="text-pink-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || selectedRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setSelectedRating(star)}
                      className="p-1 text-slate-300 hover:scale-125 transition-transform cursor-pointer"
                      title={`${star} star`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-1">
                {ratingLabels[hoverRating || selectedRating]}
              </span>
            </div>
          </div>

          {/* Customer Product Image Uploading Section */}
          <div className="flex flex-col gap-2 pt-1 border-t border-pink-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                <Camera className="w-3.5 h-3.5 text-pink-500" />
                <span>Add Product Photos</span>
                <span className="text-[10px] font-normal text-slate-500">
                  ({reviewImages.length}/5)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-[10px] font-semibold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>{showUrlInput ? 'Hide URL' : 'Paste Image URL'}</span>
                </button>
              </div>
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Image URL manual input row */}
            {showUrlInput && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 animate-in fade-in duration-150">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/customer-photo.jpg"
                  className="flex-1 text-xs bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  disabled={!imageUrlInput.trim()}
                  className="px-2.5 py-1 rounded-lg bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white text-[11px] font-bold"
                >
                  Add
                </button>
              </div>
            )}

            {/* Image preview cards and Add Photo button */}
            <div className="flex flex-wrap items-center gap-2">
              {reviewImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs"
                >
                  <img
                    src={imgUrl}
                    alt={`Customer uploaded ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    title="Remove photo"
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {reviewImages.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-xl border-2 border-dashed border-pink-300 dark:border-pink-800/60 hover:border-pink-500 bg-white/80 dark:bg-slate-900/60 hover:bg-pink-50/50 flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4 text-pink-500" />
                  <span className="text-[9px] font-bold">Upload</span>
                </button>
              )}
            </div>

            {/* Quick 1-tap sample photos to test */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Try 1-tap photos:
              </span>
              {sampleCustomerPhotos.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => handleAddSamplePhoto(sample.url)}
                  className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:border-pink-400 hover:text-pink-600 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-2.5 h-2.5 text-pink-500" />
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Review Title Input */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Review Title (Optional)
            </label>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="e.g. Stunning color & comfortable fit"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Review Comment Textarea */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Your Review <span className="text-pink-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="What did you like or dislike? How does the size fit? Mention material quality..."
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-pink-500 resize-none"
            />
          </div>

          {/* Reviewer Note & Submit Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <User className="w-3 h-3 text-slate-400" />
              <span>
                Posting as{' '}
                <strong className="text-slate-700 dark:text-slate-300">
                  {user.name || 'Verified Buyer'}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !reviewComment.trim()}
                className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Ratings Summary Card */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Big Score Block */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center text-center sm:border-r sm:border-slate-200 dark:sm:border-slate-800 sm:pr-4">
          <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {averageRating}
          </span>
          <div className="flex items-center gap-1 my-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  Number(averageRating) >= star
                    ? 'fill-amber-400 text-amber-400'
                    : Number(averageRating) >= star - 0.5
                    ? 'fill-amber-300 text-amber-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Based on {productReviews.length}{' '}
            {productReviews.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        {/* Breakdown Bars */}
        <div className="sm:col-span-8 flex flex-col gap-1.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = starCounts[stars as keyof typeof starCounts];
            const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            return (
              <div
                key={stars}
                onClick={() => setFilterStar(filterStar === stars ? 'all' : stars)}
                className="flex items-center gap-2 text-xs cursor-pointer group"
                title={`Filter by ${stars} stars`}
              >
                <span className="w-6 text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-0.5">
                  {stars} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stars >= 4
                        ? 'bg-emerald-500'
                        : stars === 3
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[10px] text-slate-400 font-medium group-hover:text-pink-500">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Photos Gallery Strip */}
      {allCustomerPhotos.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-pink-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Photos from Customers ({allCustomerPhotos.length})
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setFilterWithPhotosOnly(!filterWithPhotosOnly)}
              className={`text-[11px] font-semibold transition-colors cursor-pointer ${
                filterWithPhotosOnly
                  ? 'text-pink-600 dark:text-pink-400 underline'
                  : 'text-slate-500 hover:text-pink-600'
              }`}
            >
              {filterWithPhotosOnly ? 'Show all reviews' : 'Filter reviews with photos'}
            </button>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
            {allCustomerPhotos.map((item, idx) => (
              <div
                key={idx}
                onClick={() =>
                  setLightboxData({
                    imageUrl: item.img,
                    review: item.review,
                    index: idx,
                    total: allCustomerPhotos.length,
                  })
                }
                className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer group hover:opacity-95 transition-all shadow-xs"
              >
                <img
                  src={item.img}
                  alt={`Customer photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Maximize2 className="w-4 h-4 text-white drop-shadow-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Sort Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <button
            type="button"
            onClick={() => {
              setFilterStar('all');
              setFilterWithPhotosOnly(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterStar === 'all' && !filterWithPhotosOnly
                ? 'bg-pink-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All ({totalCount})
          </button>

          {/* With Photos Filter Button */}
          {reviewsWithPhotosCount > 0 && (
            <button
              type="button"
              onClick={() => setFilterWithPhotosOnly(!filterWithPhotosOnly)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                filterWithPhotosOnly
                  ? 'bg-pink-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>With Photos ({reviewsWithPhotosCount})</span>
            </button>
          )}

          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStar(s)}
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                filterStar === s
                  ? 'bg-pink-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>{s}</span>
              <Star className="w-2.5 h-2.5 fill-current" />
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          aria-label="Sort reviews"
          className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1 border-none focus:outline-none shrink-0 cursor-pointer"
        >
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
          <Star className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            No reviews match this filter
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Be the first to share your rating and customer photos for this product!
          </p>
          <button
            type="button"
            onClick={() => setShowReviewForm(true)}
            className="mt-3 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Write a Review
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col gap-2.5 transition-all hover:border-slate-200 dark:hover:border-slate-700"
            >
              {/* User Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {rev.userAvatar ? (
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-black text-xs flex items-center justify-center">
                      {rev.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{rev.userName}</span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded-full">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>Verified</span>
                        </span>
                      )}
                    </h5>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{rev.rating}.0</span>
                </div>
              </div>

              {/* Review Title */}
              {rev.title && (
                <h6 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {rev.title}
                </h6>
              )}

              {/* Review Text */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {rev.comment}
              </p>

              {/* Customer Uploaded Review Photos */}
              {rev.images && rev.images.length > 0 && (
                <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
                  {rev.images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        setLightboxData({
                          imageUrl: img,
                          review: rev,
                          index: i,
                          total: rev.images?.length || 1,
                        })
                      }
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer group shadow-xs hover:scale-105 transition-transform"
                    >
                      <img
                        src={img}
                        alt={`Customer photo from ${rev.userName}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5 text-white drop-shadow-md" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Review Footer / Helpful Counter */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400">
                  Was this review helpful?
                </span>
                <button
                  type="button"
                  onClick={() => toggleReviewHelpful(rev.id)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-pink-600 active:scale-95 transition-all p-1 cursor-pointer"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({rev.helpfulCount || 0})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Photo Lightbox / Modal */}
      {lightboxData && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxData(null)}
        >
          <div
            className="relative bg-slate-900 text-white rounded-3xl overflow-hidden max-w-sm w-full border border-slate-800 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="p-3.5 flex items-center justify-between border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center">
                  {lightboxData.review.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h5 className="text-xs font-bold leading-tight">
                    {lightboxData.review.userName}
                  </h5>
                  <div className="flex items-center gap-1 text-[10px] text-amber-400">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>{lightboxData.review.rating}.0 • {lightboxData.review.date}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLightboxData(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High-res Image Preview */}
            <div className="relative aspect-square w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={lightboxData.imageUrl}
                alt="Customer review photo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Review Comment Snippet in Lightbox */}
            <div className="p-3.5 bg-slate-950/70 border-t border-slate-800 flex flex-col gap-1 text-xs">
              {lightboxData.review.title && (
                <span className="font-bold text-white">
                  "{lightboxData.review.title}"
                </span>
              )}
              <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3">
                {lightboxData.review.comment}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
