import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AdminLayout } from './admin/AdminLayout';
import { PhoneFrame } from './components/PhoneFrame';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { AppOpenAnimation } from './components/AppOpenAnimation';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { ProductListingScreen } from './screens/ProductListingScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrderPlacedScreen } from './screens/OrderPlacedScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { TrackOrderScreen } from './screens/TrackOrderScreen';
import { DeliveryPartnerScreen } from './screens/DeliveryPartnerScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { AccountScreen } from './screens/AccountScreen';
import { AddressesScreen } from './screens/AddressesScreen';
import { WishlistScreen } from './screens/WishlistScreen';
import { CompareScreen } from './screens/CompareScreen';
import { CouponsScreen } from './screens/CouponsScreen';
import { HelpScreen } from './screens/HelpScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const MainAppContent: React.FC = () => {
  const { currentScreen, selectedCategory, cart, wishlistIds, navigate, products } = useApp();
  const { isStoreMode } = useAdmin();

  // If in Admin Mode, render the complete Admin Portal
  if (!isStoreMode) {
    return (
      <>
        <AdminLayout />
        <Toast />
      </>
    );
  }

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginScreen />;
      case 'register':
        return <RegisterScreen />;
      case 'home':
        return <HomeScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'category_listing':
        return <ProductListingScreen />;
      case 'product_detail':
        return <ProductDetailScreen />;
      case 'cart':
        return <CartScreen />;
      case 'checkout':
        return <CheckoutScreen />;
      case 'order_placed':
        return <OrderPlacedScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'track_order':
        return <TrackOrderScreen />;
      case 'delivery_partner':
        return <DeliveryPartnerScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'account':
        return <AccountScreen />;
      case 'addresses':
        return <AddressesScreen />;
      case 'wishlist':
        return <WishlistScreen />;
      case 'compare':
        return <CompareScreen />;
      case 'coupons':
        return <CouponsScreen />;
      case 'help':
        return <HelpScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // Determine TopBar configuration
  const getTopBarConfig = () => {
    switch (currentScreen) {
      case 'splash':
      case 'login':
      case 'register':
        return null; // Screens handle their own navigation headers

      case 'home':
        return <TopBar />;

      case 'categories':
        return <TopBar title="Categories" showBack />;

      case 'category_listing': {
        const catCount =
          selectedCategory === 'All'
            ? products.length
            : products.filter(
                (p) => p.category.toLowerCase() === (selectedCategory || 'Women').toLowerCase()
              ).length;
        return (
          <TopBar
            title={selectedCategory === 'All' ? 'All Products' : selectedCategory || 'Women'}
            subtitle={`${catCount} Products`}
            showBack
          />
        );
      }

      case 'product_detail':
        return <TopBar showBack />;

      case 'cart':
        return <TopBar title={`My Cart (${cart.length})`} showBack />;

      case 'checkout':
        return <TopBar title="Checkout" showBack />;

      case 'order_placed':
        return <TopBar title="Confirmation" showBack />;

      case 'orders':
        return <TopBar title="My Orders" showBack />;

      case 'track_order':
        return <TopBar title="Track Your Order" showBack />;

      case 'delivery_partner':
        return <TopBar title="Delivery Partner" showBack />;

      case 'notifications':
        return <TopBar title="Notifications" showBack />;

      case 'account':
        return <TopBar title="Account" showBack />;

      case 'addresses':
        return <TopBar title="My Addresses" showBack />;

      case 'wishlist':
        return <TopBar title={`Wishlist (${wishlistIds.length})`} showBack />;

      case 'compare':
        return <TopBar title="Compare Products" showBack />;

      case 'coupons':
        return <TopBar title="Coupons & Discounts" showBack />;

      case 'help':
        return <TopBar title="Help & Support" showBack />;

      case 'settings':
        return <TopBar title="Settings" showBack />;

      default:
        return <TopBar />;
    }
  };

  // Determine if bottom navigation is visible
  const showBottomNav = ![
    'splash',
    'login',
    'register',
    'checkout',
    'order_placed',
  ].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#cbeae8] dark:bg-slate-950 flex flex-col font-sans transition-colors selection:bg-[#00B4B6] selection:text-white">
      {/* App Container */}
      <PhoneFrame>
        {/* Dynamic Screen Header */}
        {getTopBarConfig()}

        {/* Screen Content */}
        <div className="flex-1 flex flex-col">{renderScreen()}</div>

        {/* Bottom Tab Bar */}
        {showBottomNav && (
          <BottomNav onOpenMoreMenu={() => navigate('settings')} />
        )}

        {/* App Open Launch Animation (Runs every time app opens) */}
        <AppOpenAnimation />
      </PhoneFrame>

      {/* Global Interactive Toast Alerts */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AdminProvider>
        <MainAppContent />
      </AdminProvider>
    </AppProvider>
  );
}
