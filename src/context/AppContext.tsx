import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Address,
  Order,
  NotificationItem,
  UserProfile,
  ScreenId,
  SortOption,
  Coupon,
  ProductReview,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_ADDRESSES,
  INITIAL_PRODUCTS,
  INITIAL_CART,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COUPONS,
} from '../data/mockData';
import { INITIAL_REVIEWS } from '../data/reviewsData';
import {
  auth,
  signInWithGoogle,
  subscribeCollection,
  saveDocument,
  deleteDocument,
  testFirestoreConnection,
} from '../lib/firebase';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';

interface AppContextType {
  // Navigation
  currentScreen: ScreenId;
  screenParams: any;
  navigationHistory: { screen: ScreenId; params?: any }[];
  navigate: (screen: ScreenId, params?: any) => void;
  goBack: () => void;
  
  // View & Theme
  isDarkMode: boolean;
  toggleDarkMode: (value?: boolean) => void;
  viewMode: 'mobile' | 'responsive';
  setViewMode: (mode: 'mobile' | 'responsive') => void;
  
  // User & Auth
  user: UserProfile;
  isAuthenticated: boolean;
  login: (email: string, pass: string, customProfile?: Partial<UserProfile>) => boolean;
  register: (name: string, email: string, phone: string, pass: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  topUpWallet: (amount: number) => void;
  signInWithGoogleAuth: () => Promise<void>;

  // Products
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
  removeFromSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (sub: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Reviews & Ratings
  reviews: ProductReview[];
  getProductReviews: (productId: string) => ProductReview[];
  submitProductReview: (
    productId: string,
    rating: number,
    comment: string,
    title?: string,
    images?: string[]
  ) => void;
  toggleReviewHelpful: (reviewId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, color?: string, size?: string, quantity?: number) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryCharge: number;
  cartTotal: number;
  couponCode: string;
  appliedCouponDiscount: number;
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (productId: string) => void;

  // Addresses
  addresses: Address[];
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  updateAddress: (addr: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (options: {
    address: Address;
    deliveryOption: 'Standard' | 'Express';
    paymentMethod: string;
  }) => Order;
  cancelOrder: (orderId: string) => void;

  // Compare
  compareIds: string[];
  toggleCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  // Settings
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
  clearCache: () => void;
  cacheSizeMB: string;

  // Toast
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Open Animation
  isOpenAnimationActive: boolean;
  replayOpenAnimation: () => void;
  dismissOpenAnimation: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & History
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [screenParams, setScreenParams] = useState<any>({});
  const [navigationHistory, setNavigationHistory] = useState<{ screen: ScreenId; params?: any }[]>([
    { screen: 'home' },
  ]);

  // View mode and Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('zoodi_dark') === 'true';
  });
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('mobile');

  // Open Animation state - runs every time the app opens or reloads
  const [isOpenAnimationActive, setIsOpenAnimationActive] = useState<boolean>(true);
  const replayOpenAnimation = () => {
    setIsOpenAnimationActive(true);
  };
  const dismissOpenAnimation = () => {
    setIsOpenAnimationActive(false);
  };

  // Sync dark class on html root & body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDarkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('zoodi_dark', 'true');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('zoodi_dark', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = (val?: boolean) => {
    setIsDarkMode((prev) => {
      const next = val !== undefined ? val : !prev;
      showToast(next ? 'Dark Mode enabled' : 'White / Light Mode enabled', 'info');
      return next;
    });
  };

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(
    null
  );
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 2800);
  };

  // User & Auth State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('zoodi_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('zoodi_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((p) => !p.id.startsWith('prod_') || p.id.length > 10);
        }
      }
    } catch {}
    return INITIAL_PRODUCTS;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zoodi_search_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse search history from localStorage', e);
    }
    return [];
  });

  // Test Firebase Firestore Connection on boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Firebase Realtime Products Subscription
  useEffect(() => {
    const unsub = subscribeCollection<Product>('products', (fsProducts) => {
      if (fsProducts && fsProducts.length > 0) {
        setProducts(fsProducts);
      }
    });
    return () => unsub();
  }, []);

  // Firebase Realtime Orders Subscription
  useEffect(() => {
    const unsub = subscribeCollection<Order>('orders', (fsOrders) => {
      if (fsOrders && fsOrders.length > 0) {
        setOrders(fsOrders);
      }
    });
    return () => unsub();
  }, []);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setIsAuthenticated(true);
        const name = fbUser.displayName || fbUser.email?.split('@')[0] || 'Valued Shopper';
        const userProf: UserProfile = {
          name,
          email: fbUser.email || 'user@zoodi.com',
          phone: fbUser.phoneNumber || '+91 98765 00000',
          avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
          walletBalance: 100,
        };
        setUser((prev) => ({ ...prev, ...userProf }));
        saveDocument('customers', fbUser.uid, {
          id: fbUser.uid,
          name,
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '',
          avatar: userProf.avatar,
        });
      }
    });
    return () => unsub();
  }, []);

  const signInWithGoogleAuth = async () => {
    try {
      const fbUser = await signInWithGoogle();
      if (fbUser) {
        showToast(`Signed in with Google as ${fbUser.displayName || fbUser.email}!`);
        navigate('home');
      }
    } catch (err: any) {
      showToast('Google sign-in failed. Please try again.', 'error');
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('zoodi_search_history', JSON.stringify(searchHistory));
    } catch (e) {
      console.warn('Failed to save search history', e);
    }
  }, [searchHistory]);

  const addToSearchHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 10);
    });
  };

  const removeFromSearchHistory = (query: string) => {
    setSearchHistory((prev) => prev.filter((item) => item.toLowerCase() !== query.toLowerCase()));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.setItem('zoodi_search_history', JSON.stringify([]));
    } catch (e) {
      // ignore
    }
  };

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Reviews state with localStorage persistence
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem('zoodi_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load reviews from localStorage', e);
    }
    return INITIAL_REVIEWS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('zoodi_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to persist reviews to localStorage', e);
    }
  }, [reviews]);

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  const submitProductReview = (
    productId: string,
    rating: number,
    comment: string,
    title?: string,
    images?: string[]
  ) => {
    const newRev: ProductReview = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      productId,
      userName: user.name || 'Zoodi Shopper',
      userAvatar: user.avatar,
      rating,
      title: title?.trim() || (rating === 5 ? 'Excellent product!' : rating >= 4 ? 'Good purchase' : 'Product review'),
      comment: comment.trim(),
      date: 'Just now',
      verifiedPurchase: true,
      helpfulCount: 0,
      images: images && images.length > 0 ? images : undefined,
    };

    const updatedReviews = [newRev, ...reviews];
    setReviews(updatedReviews);

    // Calculate new average rating & count for this product
    const productReviews = updatedReviews.filter((r) => r.productId === productId);
    const avgRating = Number(
      (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    );
    const count = productReviews.length;

    // Update in products list
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              rating: avgRating,
              reviewsCount: Math.max(p.reviewsCount + 1, count),
            }
          : p
      )
    );

    // Update in selectedProduct if matching
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) =>
        prev
          ? {
              ...prev,
              rating: avgRating,
              reviewsCount: Math.max(prev.reviewsCount + 1, count),
            }
          : null
      );
    }

    showToast('Review submitted successfully! Thank you for your feedback.', 'success');
  };

  const toggleReviewHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
    );
    showToast('Marked review as helpful!');
  };

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zoodi_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((id) => !id.startsWith('prod_') || id.length > 10);
        }
      }
    } catch {}
    return [];
  });

  // Cart persistent state with safe localStorage initialization
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zoodi_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((c) => !c.productId?.startsWith('prod_') || c.productId?.length > 10);
        }
      }
    } catch (e) {
      console.warn('Failed to load persistent cart from localStorage', e);
    }
    return INITIAL_CART;
  });
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCouponDiscount, setAppliedCouponDiscount] = useState<number>(0);
  const appliedCoupon =
    coupons.find((c) => c.code.toUpperCase() === couponCode.toUpperCase()) || null;

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('zoodi_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('zoodi_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((o) => !o.id?.includes('ZC256784521') && !o.id?.includes('ZC256784520') && !o.id?.includes('ZC256784519'));
        }
      }
    } catch {}
    return INITIAL_ORDERS;
  });
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Compare
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('zoodi_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Settings
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('English');
  const [cacheSizeMB, setCacheSizeMB] = useState<string>('12.4 MB');

  // Save to localStorage automatically
  useEffect(() => {
    localStorage.setItem('zoodi_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('zoodi_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('zoodi_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to persist cart to localStorage', e);
    }
  }, [cart]);

  // Synchronize cart state across browser tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'zoodi_cart' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCart(parsed);
          }
        } catch (err) {
          console.warn('Failed to parse cart update from storage event', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('zoodi_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('zoodi_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('zoodi_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('zoodi_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Navigation handlers
  const navigate = (screen: ScreenId, params: any = {}) => {
    setScreenParams(params);
    setCurrentScreen(screen);
    setNavigationHistory((prev) => [...prev, { screen, params }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // remove current
      const previous = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentScreen(previous.screen);
      setScreenParams(previous.params || {});
    } else {
      setCurrentScreen('home');
      setNavigationHistory([{ screen: 'home' }]);
    }
  };

  // Auth operations
  const login = (emailOrPhone: string, _pass: string, customProfile?: Partial<UserProfile>) => {
    setIsAuthenticated(true);
    let finalDisplayName = customProfile?.name || 'Afneel';

    // Look for existing account in saved customers list to avoid duplicate creation
    let existingCust: any = null;
    try {
      const savedCusts = localStorage.getItem('zoodi_admin_customers');
      if (savedCusts) {
        const parsed = JSON.parse(savedCusts);
        if (Array.isArray(parsed)) {
          existingCust = parsed.find(
            (c: any) =>
              (c.email && emailOrPhone && c.email.toLowerCase() === emailOrPhone.toLowerCase()) ||
              (c.phone && emailOrPhone && c.phone === emailOrPhone)
          );
        }
      }
    } catch {}

    setUser((prev) => {
      const updated: UserProfile = {
        ...prev,
        name: existingCust?.name || customProfile?.name || prev.name || 'Afneel',
        email: existingCust?.email || customProfile?.email || (emailOrPhone.includes('@') ? emailOrPhone : prev.email),
        phone: existingCust?.phone || customProfile?.phone || (!emailOrPhone.includes('@') && emailOrPhone ? emailOrPhone : prev.phone),
        avatar: existingCust?.avatar || customProfile?.avatar || prev.avatar,
        walletBalance: existingCust?.walletBalance !== undefined ? existingCust.walletBalance : prev.walletBalance,
      };
      finalDisplayName = updated.name;
      try {
        localStorage.setItem('zoodi_user', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Ensure customer entry exists in admin customer registry without creating duplicates
    try {
      const saved = localStorage.getItem('zoodi_admin_customers');
      const list = saved ? JSON.parse(saved) : [];
      const cleanEmail = customProfile?.email || (emailOrPhone.includes('@') ? emailOrPhone : '');
      const cleanPhone = customProfile?.phone || (!emailOrPhone.includes('@') ? emailOrPhone : '');
      if (
        !list.some(
          (c: any) =>
            (cleanEmail && c.email && c.email.toLowerCase() === cleanEmail.toLowerCase()) ||
            (cleanPhone && c.phone && c.phone === cleanPhone)
        )
      ) {
        list.unshift({
          id: `cust_${Date.now()}`,
          name: finalDisplayName,
          email: cleanEmail || 'user@zoodi.com',
          phone: cleanPhone || '+91 98765 00000',
          avatar: customProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          totalOrders: 0,
          totalSpent: 0,
          walletBalance: 0,
        });
        localStorage.setItem('zoodi_admin_customers', JSON.stringify(list));
      }
    } catch {}

    showToast(`Welcome back, ${finalDisplayName}! Logged in successfully.`);
    navigate('home');
    return true;
  };

  const register = (name: string, email: string, phone: string, _pass: string) => {
    setIsAuthenticated(true);
    const newProfile: UserProfile = {
      name: name || 'Valued Shopper',
      email: email || 'user@zoodi.com',
      phone: phone || '+91 98765 00000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      walletBalance: 100, // bonus welcome credits
    };
    setUser(newProfile);

    // Sync to Admin Customers list
    try {
      const saved = localStorage.getItem('zoodi_admin_customers');
      const list = saved ? JSON.parse(saved) : [];
      if (!list.some((c: any) => c.email === newProfile.email || c.phone === newProfile.phone)) {
        list.unshift({
          id: `cust_${Date.now()}`,
          name: newProfile.name,
          email: newProfile.email,
          phone: newProfile.phone,
          avatar: newProfile.avatar,
          joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          totalOrders: 0,
          totalSpent: 0,
          walletBalance: newProfile.walletBalance,
        });
        localStorage.setItem('zoodi_admin_customers', JSON.stringify(list));
      }
    } catch {}

    showToast('Account created! Welcome to ZOODI Collection.');
    navigate('home');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Logged out successfully.', 'info');
    navigate('login');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
    showToast('Profile updated successfully.');
  };

  const topUpWallet = (amount: number) => {
    setUser((prev) => ({ ...prev, walletBalance: prev.walletBalance + amount }));
    showToast(`Added ₹${amount} to ZOODI Wallet!`);
  };

  // Product operations
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const productId = `prod_${Date.now()}`;
    const newProduct: Product = {
      ...prodData,
      id: productId,
    };
    setProducts((prev) => [newProduct, ...prev]);
    saveDocument('products', productId, newProduct);
    showToast(`Added "${newProduct.name}" to catalog.`);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProduct?.id === updated.id) {
      setSelectedProduct(updated);
    }
    saveDocument('products', updated.id, updated);
    showToast(`Product "${updated.name}" updated.`);
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.productId !== id));
    setWishlistIds((prev) => prev.filter((wId) => wId !== id));
    deleteDocument('products', id);
    showToast(`Deleted "${target?.name || 'Product'}" from catalog.`, 'info');
  };

  // Cart operations
  const addToCart = (
    product: Product,
    color?: string,
    size?: string,
    quantity: number = 1
  ) => {
    const selectedColor = color || product.color;
    const selectedSize = size || product.size;
    const existingIndex = cart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.color === selectedColor &&
        item.size === selectedSize
    );

    if (existingIndex > -1) {
      setCart((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        color: selectedColor,
        size: selectedSize,
        quantity,
        image: product.image,
      };
      setCart((prev) => [...prev, newItem]);
    }
    showToast(`Added "${product.name}" to cart!`);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    const item = cart.find((c) => c.id === id);
    setCart((prev) => prev.filter((c) => c.id !== id));
    showToast(`Removed "${item?.name || 'Item'}" from cart.`, 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart totals calculation
  // Subtotal is the sum of product prices in the cart
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Discount ONLY comes when coupon is added; if no coupon added, exactly 0 rupee!
  const cartDiscount = couponCode ? appliedCouponDiscount : 0;

  const isFreeShipCoupon = couponCode.toUpperCase() === 'FREESHIP';
  const cartDeliveryCharge =
    cart.length === 0 || cartSubtotal > 999 || isFreeShipCoupon ? 0 : 49;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryCharge);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      showToast('Please enter a coupon code.', 'error');
      return { success: false, message: 'Please enter a coupon code' };
    }
    const matched = coupons.find((c) => c.code.toUpperCase() === trimmed);
    if (matched) {
      if (cartSubtotal > 0 && cartSubtotal < matched.minOrderValue) {
        showToast(
          `Minimum order of ₹${matched.minOrderValue} required for ${matched.code}`,
          'error'
        );
        return {
          success: false,
          message: `Minimum order value of ₹${matched.minOrderValue} required`,
        };
      }
      let disc = 0;
      if (matched.discountType === 'percent') {
        const raw = Math.round((cartSubtotal * matched.discountValue) / 100);
        disc = matched.maxDiscount ? Math.min(raw, matched.maxDiscount) : raw;
      } else {
        disc = matched.discountValue;
      }
      setCouponCode(matched.code);
      setAppliedCouponDiscount(disc);
      showToast(`Coupon ${matched.code} applied! Saved ₹${disc}.`, 'success');
      return { success: true, message: `Coupon ${matched.code} applied successfully!` };
    }

    // Also check dynamic admin-created coupons
    try {
      const adminCoupsRaw = localStorage.getItem('zoodi_admin_coupons');
      if (adminCoupsRaw) {
        const parsed = JSON.parse(adminCoupsRaw);
        if (Array.isArray(parsed)) {
          const adminMatch = parsed.find(
            (c: any) => c.code.toUpperCase() === trimmed && c.status === 'Active'
          );
          if (adminMatch) {
            if (cartSubtotal > 0 && cartSubtotal < adminMatch.minPurchase) {
              showToast(
                `Minimum order of ₹${adminMatch.minPurchase} required for ${adminMatch.code}`,
                'error'
              );
              return {
                success: false,
                message: `Minimum order value of ₹${adminMatch.minPurchase} required`,
              };
            }
            const disc = Math.round((cartSubtotal * adminMatch.discountPercent) / 100);
            setCouponCode(adminMatch.code);
            setAppliedCouponDiscount(disc);
            showToast(`Coupon ${adminMatch.code} applied! Saved ₹${disc}.`, 'success');
            return { success: true, message: `Coupon ${adminMatch.code} applied successfully!` };
          }
        }
      }
    } catch {}

    showToast('Invalid coupon code. Try any active admin coupon code.', 'error');
    return { success: false, message: 'Invalid or expired coupon code' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCouponDiscount(0);
    showToast('Coupon removed. Discount set to ₹0.', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    const exists = wishlistIds.includes(productId);
    if (exists) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from wishlist.', 'info');
    } else {
      setWishlistIds((prev) => [...prev, productId]);
      showToast('Saved to wishlist!');
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const moveToCartFromWishlist = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      addToCart(prod);
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  // Addresses
  const addAddress = (addrData: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addrData,
      id: `addr_${Date.now()}`,
    };
    if (newAddr.isDefault) {
      setAddresses((prev) => [
        ...prev.map((a): Address => ({ ...a, isDefault: false })),
        newAddr,
      ]);
    } else {
      setAddresses((prev) => [...prev, newAddr]);
    }
    setSelectedAddressId(newAddr.id);
    showToast('Address saved successfully.');
  };

  const updateAddress = (updated: Address) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === updated.id) return updated;
        if (updated.isDefault) return { ...a, isDefault: false };
        return a;
      })
    );
    showToast('Address updated successfully.');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddressId === id) {
      const remaining = addresses.filter((a) => a.id !== id);
      if (remaining.length > 0) setSelectedAddressId(remaining[0].id);
    }
    showToast('Address deleted.', 'info');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    setSelectedAddressId(id);
    showToast('Default address updated.');
  };

  // Orders
  const placeOrder = ({
    address,
    deliveryOption,
    paymentMethod,
  }: {
    address: Address;
    deliveryOption: 'Standard' | 'Express';
    paymentMethod: string;
  }) => {
    const randomNum = Math.floor(100000000 + Math.random() * 900000000);
    const orderId = `#ZC${randomNum}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Processing',
      items: cart.map((c) => ({
        productId: c.productId,
        name: c.name,
        price: c.price,
        color: c.color,
        size: c.size,
        quantity: c.quantity,
        image: c.image,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryCharge: deliveryOption === 'Express' ? 49 : cartDeliveryCharge,
      total:
        cartTotal + (deliveryOption === 'Express' && cartDeliveryCharge === 0 ? 49 : 0),
      shippingAddress: address,
      deliveryOption,
      paymentMethod,
      trackingId: `DLIV${Math.floor(100000000 + Math.random() * 900000000)}`,
      deliveryPartner: {
        name: 'Ramesh Kumar',
        phone: '+91 98450 12345',
        rating: 4.8,
        reviews: '2.3k',
        estimatedTime: 'Expected within 2-3 business days',
        currentLocation: 'Order Processing at Warehouse',
      },
      timeline: [
        {
          status: 'Placed',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: 'Today',
          completed: true,
          current: true,
        },
        { status: 'Packed', time: '--', date: 'Expected Tomorrow', completed: false },
        { status: 'Shipped', time: '--', date: 'Upcoming', completed: false },
        { status: 'Out for Delivery', time: '--', date: 'Upcoming', completed: false },
        { status: 'Delivered', time: '--', date: 'Upcoming', completed: false },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    saveDocument('orders', orderId, newOrder);
    clearCart();
    // Sync customer and order stats to Admin Customers list
    try {
      const custName = address.name || user.name || 'Store Customer';
      const custPhone = address.phone || user.phone || '+91 98765 00000';
      const custEmail = user.email || 'customer@zoodi.com';
      const saved = localStorage.getItem('zoodi_admin_customers');
      let customersList: any[] = saved ? JSON.parse(saved) : [];
      const existingIdx = customersList.findIndex(
        (c) => (custEmail && c.email === custEmail) || (custPhone && c.phone === custPhone)
      );
      if (existingIdx > -1) {
        customersList[existingIdx].totalOrders = (customersList[existingIdx].totalOrders || 0) + 1;
        customersList[existingIdx].totalSpent = (customersList[existingIdx].totalSpent || 0) + newOrder.total;
      } else {
        customersList.unshift({
          id: `cust_${Date.now()}`,
          name: custName,
          email: custEmail,
          phone: custPhone,
          avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          totalOrders: 1,
          totalSpent: newOrder.total,
          walletBalance: 0,
        });
      }
      localStorage.setItem('zoodi_admin_customers', JSON.stringify(customersList));
    } catch {}

    // Add order notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Order Placed Successfully!',
      message: `Your order ${orderId} has been placed. We are preparing it for dispatch.`,
      time: 'Just now',
      type: 'order',
      read: false,
      targetScreen: 'track_order',
      targetId: orderId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Cancelled',
              timeline: [
                ...o.timeline,
                {
                  status: 'Cancelled',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  date: 'Today',
                  completed: true,
                  current: true,
                },
              ],
            }
          : o
      )
    );
    showToast(`Order ${orderId} has been cancelled.`, 'info');
  };

  // Compare
  const toggleCompare = (productId: string) => {
    if (compareIds.includes(productId)) {
      setCompareIds((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from compare.', 'info');
    } else {
      if (compareIds.length >= 3) {
        showToast('You can compare maximum 3 products at a time.', 'error');
        return;
      }
      setCompareIds((prev) => [...prev, productId]);
      showToast('Added to product comparison!');
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== productId));
    showToast('Removed product from comparison.', 'info');
  };

  const clearCompare = () => {
    setCompareIds([]);
    showToast('Cleared all products from comparison.', 'info');
  };

  // Notifications
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Clear cache
  const clearCache = () => {
    setCacheSizeMB('0.0 KB');
    showToast('Cache cleared successfully! 12.4 MB freed.');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        screenParams,
        navigationHistory,
        navigate,
        goBack,
        isDarkMode,
        toggleDarkMode,
        viewMode,
        setViewMode,
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        topUpWallet,
        signInWithGoogleAuth,
        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        searchHistory,
        addToSearchHistory,
        removeFromSearchHistory,
        clearSearchHistory,
        selectedSubcategory,
        setSelectedSubcategory,
        sortBy,
        setSortBy,
        selectedProduct,
        setSelectedProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        reviews,
        getProductReviews,
        submitProductReview,
        toggleReviewHelpful,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartDeliveryCharge,
        cartTotal,
        couponCode,
        appliedCouponDiscount,
        applyCoupon,
        removeCoupon,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        activeOrder,
        setActiveOrder,
        placeOrder,
        cancelOrder,
        compareIds,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        notifications,
        unreadNotifCount,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        notificationsEnabled,
        setNotificationsEnabled,
        language,
        setLanguage,
        clearCache,
        cacheSizeMB,
        toast,
        showToast,
        isOpenAnimationActive,
        replayOpenAnimation,
        dismissOpenAnimation,
        coupons,
        appliedCoupon,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
