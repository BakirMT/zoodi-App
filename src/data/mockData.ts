import { Product, CartItem, Address, Order, NotificationItem, UserProfile, Coupon } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Store Customer',
  email: 'customer@zoodi.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  walletBalance: 0,
};

export const INITIAL_ADDRESSES: Address[] = [];

// Empty initial products ready for admin to upload/create new products
export const INITIAL_PRODUCTS: Product[] = [];

// Empty initial cart
export const INITIAL_CART: CartItem[] = [];

// Empty initial orders ready for new customer purchases
export const INITIAL_ORDERS: Order[] = [];

// Clean initial notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_welcome',
    title: 'Welcome to ZOODI!',
    message: 'Welcome to your boutique fashion & lifestyle destination.',
    time: 'Just now',
    type: 'system',
    read: false,
    targetScreen: 'home',
  },
];

// Empty initial coupons ready for admin to create discount codes
export const INITIAL_COUPONS: Coupon[] = [];
