export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  date: string;
  verifiedPurchase?: boolean;
  helpfulCount?: number;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  category: 'Women' | 'Men' | 'Footwear' | 'Bags' | 'Home' | 'Electronics' | 'Beauty';
  subcategory: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images?: string[];
  color: string;
  colors: { name: string; hex: string }[];
  size: string;
  sizes: string[];
  description: string;
  specs: { [key: string]: string };
  inStock: boolean;
  featured?: boolean;
  isPopular?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  color: string;
  size: string;
  quantity: number;
  image: string;
}

export interface Address {
  id: string;
  type: 'Home' | 'Office' | 'Other';
  name: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  category?: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string; // e.g. #ZC256784521
  date: string;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  shippingAddress: Address;
  deliveryOption: 'Standard' | 'Express';
  paymentMethod: string;
  trackingId: string;
  deliveryPartner: {
    name: string;
    phone: string;
    rating: number;
    reviews: string;
    estimatedTime: string;
    currentLocation: string;
  };
  timeline: {
    status: string;
    time: string;
    date: string;
    completed: boolean;
    current?: boolean;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'discount' | 'new_arrival' | 'system';
  read: boolean;
  targetScreen?: string;
  targetId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  walletBalance: number;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'flat' | 'percent';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  tag?: string;
  applicableCategory?: string;
}

export type ScreenId =
  | 'splash'
  | 'login'
  | 'register'
  | 'home'
  | 'categories'
  | 'category_listing'
  | 'product_detail'
  | 'cart'
  | 'checkout'
  | 'order_placed'
  | 'orders'
  | 'track_order'
  | 'delivery_partner'
  | 'notifications'
  | 'account'
  | 'addresses'
  | 'wishlist'
  | 'compare'
  | 'coupons'
  | 'help'
  | 'settings';

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'rating'
  | 'discount';
