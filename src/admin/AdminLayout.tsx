import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { AdminBottomNav } from './components/AdminBottomNav';

// Screens
import { AdminDashboard } from './screens/AdminDashboard';
import { AdminProducts } from './screens/AdminProducts';
import { AdminAddProduct } from './screens/AdminAddProduct';
import { AdminEditProduct } from './screens/AdminEditProduct';
import { AdminProductDetail } from './screens/AdminProductDetail';
import { AdminCategories } from './screens/AdminCategories';
import { AdminOrders } from './screens/AdminOrders';
import { AdminOrderDetail } from './screens/AdminOrderDetail';
import { AdminCustomers } from './screens/AdminCustomers';
import { AdminCustomerDetail } from './screens/AdminCustomerDetail';
import { AdminBanners } from './screens/AdminBanners';
import { AdminBannerDetail } from './screens/AdminBannerDetail';
import { AdminCoupons } from './screens/AdminCoupons';
import { AdminAnalytics } from './screens/AdminAnalytics';
import { AdminSettings } from './screens/AdminSettings';
import { AdminFeedback } from './screens/AdminFeedback';
import { AdminLockScreen } from './components/AdminLockScreen';

export const AdminLayout: React.FC = () => {
  const { adminTab, isAdminAuthenticated } = useAdmin();

  // If admin is not authenticated, require password lock screen
  if (!isAdminAuthenticated) {
    return <AdminLockScreen />;
  }

  const renderAdminScreen = () => {
    switch (adminTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <AdminProducts />;
      case 'add_product':
        return <AdminAddProduct />;
      case 'edit_product':
        return <AdminEditProduct />;
      case 'product_detail':
        return <AdminProductDetail />;
      case 'categories':
        return <AdminCategories />;
      case 'orders':
        return <AdminOrders />;
      case 'order_detail':
        return <AdminOrderDetail />;
      case 'customers':
        return <AdminCustomers />;
      case 'customer_detail':
        return <AdminCustomerDetail />;
      case 'banners':
        return <AdminBanners />;
      case 'banner_detail':
        return <AdminBannerDetail />;
      case 'coupons':
        return <AdminCoupons />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'settings':
        return <AdminSettings />;
      case 'feedback':
        return <AdminFeedback />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#dcf0ef] dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col lg:flex-row transition-colors selection:bg-[#00B4B6] selection:text-white">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 pb-16 lg:pb-8">{renderAdminScreen()}</main>
        <AdminBottomNav />
      </div>
    </div>
  );
};
