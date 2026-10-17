import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AdminTab,
  AdminBanner,
  BannerSettings,
  AdminCustomer,
  AdminCoupon,
  AdminCategory,
} from '../types/admin';
import { subscribeCollection, saveDocument, deleteDocument } from '../lib/firebase';

export interface AdminProfile {
  name: string;
  role: string;
  avatar: string;
}

interface AdminContextType {
  isStoreMode: boolean;
  setIsStoreMode: (storeMode: boolean) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Admin Profile Settings
  adminProfile: AdminProfile;
  updateAdminProfile: (profile: Partial<AdminProfile>) => void;

  // Banners
  banners: AdminBanner[];
  bannerSettings: BannerSettings;
  updateBannerSettings: (settings: Partial<BannerSettings>) => void;
  addBanner: (banner: Omit<AdminBanner, 'id'>) => void;
  updateBanner: (banner: AdminBanner) => void;
  deleteBanner: (id: string) => void;
  toggleBannerStatus: (id: string) => void;

  // Categories
  categories: AdminCategory[];
  addCategory: (cat: Omit<AdminCategory, 'id' | 'count'>) => void;
  updateCategory: (cat: AdminCategory) => void;
  deleteCategory: (id: string) => void;

  // Customers
  customers: AdminCustomer[];
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  addCustomer: (cust: Omit<AdminCustomer, 'id' | 'joinedDate' | 'totalOrders' | 'totalSpent'>) => void;
  deleteCustomer: (id: string) => void;

  // Selected drill-down IDs
  selectedOrderId: string;
  setSelectedOrderId: (id: string) => void;
  selectedBannerId: string;
  setSelectedBannerId: (id: string) => void;
  selectedAdminProductId: string;
  setSelectedAdminProductId: (id: string) => void;

  // Coupons
  coupons: AdminCoupon[];
  addCoupon: (coupon: Omit<AdminCoupon, 'id' | 'usageCount'>) => void;
  deleteCoupon: (id: string) => void;

  // Metrics
  totalRevenue: number;
  totalOrdersCount: number;

  // Admin Authentication & Password Security
  isAdminAuthenticated: boolean;
  verifyAdminPassword: (password: string) => boolean;
  updateAdminPassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
  logoutAdmin: () => void;

  // Reset store data
  resetAllData: () => void;
}

// Initial empty states - clean store ready for uploading new items
const INITIAL_BANNERS: AdminBanner[] = [];
const INITIAL_CUSTOMERS: AdminCustomer[] = [];
const INITIAL_COUPONS: AdminCoupon[] = [];
const INITIAL_CATEGORIES: AdminCategory[] = [];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // One-time cleanup for old mock storage data if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cleanFlag = localStorage.getItem('zoodi_cleared_mock_v3');
    if (!cleanFlag) {
      // Check if old mock data with legacy sample IDs exists
      const oldBanners = localStorage.getItem('zoodi_admin_banners');
      const oldCustomers = localStorage.getItem('zoodi_admin_customers');
      const oldProducts = localStorage.getItem('zoodi_products');
      const oldOrders = localStorage.getItem('zoodi_orders');
      if (
        (oldBanners && oldBanners.includes('ban_1')) ||
        (oldCustomers && oldCustomers.includes('cust_1')) ||
        (oldProducts && oldProducts.includes('prod_1')) ||
        (oldOrders && oldOrders.includes('#ZC256784521'))
      ) {
        localStorage.removeItem('zoodi_products');
        localStorage.removeItem('zoodi_orders');
        localStorage.removeItem('zoodi_cart');
        localStorage.removeItem('zoodi_wishlist');
        localStorage.removeItem('zoodi_admin_banners');
        localStorage.removeItem('zoodi_admin_customers');
        localStorage.removeItem('zoodi_admin_coupons');
        localStorage.removeItem('zoodi_categories');
        localStorage.removeItem('zoodi_reviews');
      }
      localStorage.setItem('zoodi_cleared_mock_v3', 'true');
    }
  }, []);

  const checkIsAdminRoute = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path.includes('/admin') ||
      path.includes('/super-admin') ||
      path.includes('/superadmin') ||
      hash.includes('admin') ||
      hash.includes('super-admin') ||
      search.includes('admin=true')
    );
  };

  // Mode: true = Customer Storefront view (default), false = Admin view
  const [isStoreMode, setIsStoreMode] = useState<boolean>(() => {
    if (checkIsAdminRoute()) return false;
    return true; // Main storefront is ALWAYS default!
  });

  // Sync hash and location route changes
  useEffect(() => {
    const syncRouteMode = () => {
      if (checkIsAdminRoute()) {
        setIsStoreMode(false);
      } else {
        setIsStoreMode(true);
        if (localStorage.getItem('zoodi_mode') === 'admin') {
          localStorage.setItem('zoodi_mode', 'store');
        }
      }
    };
    syncRouteMode();
    window.addEventListener('hashchange', syncRouteMode);
    window.addEventListener('popstate', syncRouteMode);
    return () => {
      window.removeEventListener('hashchange', syncRouteMode);
      window.removeEventListener('popstate', syncRouteMode);
    };
  }, []);

  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Admin Profile State
  const DEFAULT_ADMIN_PROFILE: AdminProfile = {
    name: 'Afneel',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  };

  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    try {
      const saved = localStorage.getItem('zoodi_admin_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ADMIN_PROFILE;
  });

  const updateAdminProfile = (profileData: Partial<AdminProfile>) => {
    setAdminProfile((prev) => {
      const updated = { ...prev, ...profileData };
      try {
        localStorage.setItem('zoodi_admin_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Admin Password & Authentication State
  const DEFAULT_ADMIN_PASSWORD = 'Zoodi@shop26';
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('zoodi_admin_password') || DEFAULT_ADMIN_PASSWORD;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const storedLocal = localStorage.getItem('zoodi_admin_auth');
    if (storedLocal === 'true') return true;
    const storedSession = sessionStorage.getItem('zoodi_admin_auth');
    return storedSession === 'true';
  });

  const verifyAdminPassword = (enteredPassword: string): boolean => {
    if (enteredPassword.trim() === adminPassword.trim()) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('zoodi_admin_auth', 'true');
      sessionStorage.setItem('zoodi_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const updateAdminPassword = (currentPass: string, newPass: string): { success: boolean; message: string } => {
    if (currentPass.trim() !== adminPassword.trim()) {
      return { success: false, message: 'Current password does not match.' };
    }
    if (!newPass || newPass.trim().length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }
    setAdminPassword(newPass.trim());
    localStorage.setItem('zoodi_admin_password', newPass.trim());
    return { success: true, message: 'Admin password successfully renewed!' };
  };

  // Selected items
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [selectedBannerId, setSelectedBannerId] = useState<string>('');
  const [selectedAdminProductId, setSelectedAdminProductId] = useState<string>('');

  // Banners state
  const [banners, setBanners] = useState<AdminBanner[]>(() => {
    const saved = localStorage.getItem('zoodi_admin_banners');
    if (!saved) return INITIAL_BANNERS;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return INITIAL_BANNERS;
      // Filter out dummy legacy banner
      return parsed.filter((b) => b.id !== 'ban_1' && b.id !== 'ban_2' && b.id !== 'ban_3' && b.id !== 'ban_4');
    } catch {
      return INITIAL_BANNERS;
    }
  });

  const [bannerSettings, setBannerSettings] = useState<BannerSettings>(() => {
    try {
      const saved = localStorage.getItem('zoodi_banner_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { autoSlide: true, intervalSeconds: 3, pauseOnHover: true };
  });

  const updateBannerSettings = (newSettings: Partial<BannerSettings>) => {
    setBannerSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('zoodi_banner_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  useEffect(() => {
    localStorage.setItem('zoodi_admin_banners', JSON.stringify(banners));
  }, [banners]);

  // Categories state
  const [categories, setCategories] = useState<AdminCategory[]>(() => {
    const saved = localStorage.getItem('zoodi_categories');
    if (!saved) return INITIAL_CATEGORIES;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  useEffect(() => {
    localStorage.setItem('zoodi_categories', JSON.stringify(categories));
  }, [categories]);

  // Subscribe to Firebase Firestore collections for real-time synchronization
  useEffect(() => {
    const unsubBanners = subscribeCollection<AdminBanner>('banners', (fsBanners) => {
      if (fsBanners && fsBanners.length > 0) setBanners(fsBanners);
    });
    const unsubCategories = subscribeCollection<AdminCategory>('categories', (fsCats) => {
      if (fsCats && fsCats.length > 0) setCategories(fsCats);
    });
    const unsubCustomers = subscribeCollection<AdminCustomer>('customers', (fsCusts) => {
      if (fsCusts && fsCusts.length > 0) setCustomers(fsCusts);
    });
    const unsubCoupons = subscribeCollection<AdminCoupon>('coupons', (fsCoups) => {
      if (fsCoups && fsCoups.length > 0) setCoupons(fsCoups);
    });

    return () => {
      unsubBanners();
      unsubCategories();
      unsubCustomers();
      unsubCoupons();
    };
  }, []);

  const addCategory = (catData: Omit<AdminCategory, 'id' | 'count'>) => {
    const catId = `cat_${Date.now()}`;
    const newCat: AdminCategory = {
      ...catData,
      id: catId,
      count: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    saveDocument('categories', catId, newCat);
  };

  const updateCategory = (updated: AdminCategory) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    saveDocument('categories', updated.id, updated);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    deleteDocument('categories', id);
  };

  // Customers state
  const [customers, setCustomers] = useState<AdminCustomer[]>(() => {
    const saved = localStorage.getItem('zoodi_admin_customers');
    if (!saved) return INITIAL_CUSTOMERS;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return INITIAL_CUSTOMERS;
      return parsed.filter((c) => c.id !== 'cust_1' && c.id !== 'cust_2' && c.id !== 'cust_3' && c.id !== 'cust_4' && c.id !== 'cust_5');
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('zoodi_admin_customers', JSON.stringify(customers));
  }, [customers]);

  const addCustomer = (custData: Omit<AdminCustomer, 'id' | 'joinedDate' | 'totalOrders' | 'totalSpent'>) => {
    const custId = `cust_${Date.now()}`;
    const newCust: AdminCustomer = {
      ...custData,
      id: custId,
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalOrders: 0,
      totalSpent: 0,
    };
    setCustomers((prev) => [newCust, ...prev]);
    saveDocument('customers', custId, newCust);
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    deleteDocument('customers', id);
  };

  // Coupons state
  const [coupons, setCoupons] = useState<AdminCoupon[]>(() => {
    const saved = localStorage.getItem('zoodi_admin_coupons');
    if (!saved) return INITIAL_COUPONS;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return INITIAL_COUPONS;
      return parsed.filter((c) => c.id !== 'coup_1' && c.id !== 'coup_2' && c.id !== 'coup_3');
    } catch {
      return INITIAL_COUPONS;
    }
  });

  useEffect(() => {
    localStorage.setItem('zoodi_admin_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const addBanner = (bannerData: Omit<AdminBanner, 'id'>) => {
    const bannerId = `ban_${Date.now()}`;
    const newBanner: AdminBanner = {
      ...bannerData,
      id: bannerId,
    };
    setBanners((prev) => [newBanner, ...prev]);
    saveDocument('banners', bannerId, newBanner);
  };

  const updateBanner = (updated: AdminBanner) => {
    setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    saveDocument('banners', updated.id, updated);
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    deleteDocument('banners', id);
  };

  const toggleBannerStatus = (id: string) => {
    setBanners((prev) => {
      const updated = prev.map((b) =>
        b.id === id
          ? { ...b, status: (b.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive' }
          : b
      );
      const target = updated.find((b) => b.id === id);
      if (target) saveDocument('banners', id, target);
      return updated;
    });
  };

  const addCoupon = (coupData: Omit<AdminCoupon, 'id' | 'usageCount'>) => {
    const coupId = `coup_${Date.now()}`;
    const newC: AdminCoupon = {
      ...coupData,
      id: coupId,
      usageCount: 0,
    };
    setCoupons((prev) => [newC, ...prev]);
    saveDocument('coupons', coupId, newC);
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    deleteDocument('coupons', id);
  };

  const handleSetIsStoreMode = (storeMode: boolean) => {
    setIsStoreMode(storeMode);
    localStorage.setItem('zoodi_mode', storeMode ? 'store' : 'admin');
    if (!storeMode) {
      if (!window.location.hash.includes('admin')) {
        window.location.hash = '#super-admin';
      }
    } else {
      if (window.location.hash.includes('admin')) {
        window.location.hash = '';
      }
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('zoodi_admin_auth');
    sessionStorage.removeItem('zoodi_admin_auth');
    handleSetIsStoreMode(true);
  };

  // Dynamic metrics derived from actual orders in localStorage
  const getDynamicMetrics = () => {
    try {
      const savedOrders = localStorage.getItem('zoodi_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) {
          const rev = parsed.reduce((sum, o) => sum + (o.total || 0), 0);
          return { revenue: rev, count: parsed.length };
        }
      }
    } catch {}
    return { revenue: 0, count: 0 };
  };

  const { revenue: totalRevenue, count: totalOrdersCount } = getDynamicMetrics();

  // Reset all data completely
  const resetAllData = () => {
    setBanners([]);
    setCustomers([]);
    setCoupons([]);
    setCategories([]);
    localStorage.removeItem('zoodi_admin_banners');
    localStorage.removeItem('zoodi_admin_customers');
    localStorage.removeItem('zoodi_admin_coupons');
    localStorage.removeItem('zoodi_categories');
    localStorage.removeItem('zoodi_products');
    localStorage.removeItem('zoodi_orders');
    localStorage.removeItem('zoodi_cart');
    localStorage.removeItem('zoodi_wishlist');
    localStorage.removeItem('zoodi_reviews');
    localStorage.setItem('zoodi_cleared_mock_v3', 'true');
    window.location.reload();
  };

  return (
    <AdminContext.Provider
      value={{
        isStoreMode,
        setIsStoreMode: handleSetIsStoreMode,
        adminTab,
        setAdminTab,
        sidebarOpen,
        setSidebarOpen,
        adminProfile,
        updateAdminProfile,
        banners,
        bannerSettings,
        updateBannerSettings,
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerStatus,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        customers,
        selectedCustomerId,
        setSelectedCustomerId,
        addCustomer,
        deleteCustomer,
        selectedOrderId,
        setSelectedOrderId,
        selectedBannerId,
        setSelectedBannerId,
        selectedAdminProductId,
        setSelectedAdminProductId,
        coupons,
        addCoupon,
        deleteCoupon,
        totalRevenue,
        totalOrdersCount,
        isAdminAuthenticated,
        verifyAdminPassword,
        updateAdminPassword,
        logoutAdmin,
        resetAllData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
