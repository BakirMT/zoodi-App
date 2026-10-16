export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'add_product'
  | 'edit_product'
  | 'product_detail'
  | 'categories'
  | 'orders'
  | 'order_detail'
  | 'customers'
  | 'customer_detail'
  | 'banners'
  | 'banner_detail'
  | 'coupons'
  | 'analytics'
  | 'settings'
  | 'feedback';

export interface AdminBanner {
  id: string;
  title: string;
  tag?: string;
  buttonText?: string;
  linkType?: 'category' | 'product';
  targetCategory?: string;
  targetProductId?: string;
  type: 'Main Banner' | 'Offer Banner' | 'Category Banner';
  image: string;
  status: 'Active' | 'Inactive';
  startDate: string;
  endDate: string;
}

export interface BannerSettings {
  autoSlide: boolean;
  intervalSeconds: number; // e.g. 4 seconds
  pauseOnHover: boolean;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  walletBalance: number;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountPercent: number;
  minPurchase: number;
  expiryDate: string;
  status: 'Active' | 'Expired';
  usageCount: number;
}

export interface DailySales {
  date: string;
  sales: number;
  orders: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  subtitle: string;
  count: number;
  image: string;
  type: string;
}

