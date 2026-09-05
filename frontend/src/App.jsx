import React from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import TreatsCatalog from './components/TreatsCatalog';
import BoxBuilder from './components/BoxBuilder';
import StorySection from './components/StorySection';
import Testimonials from './components/Testimonials';
import CustomOrderForm from './components/CustomOrderForm';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import AuthModal from './components/AuthModal';
import OrderHistoryModal from './components/OrderHistoryModal';
import AdminPortalModal from './components/AdminPortalModal';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Hero />
            <Ticker />
            <TreatsCatalog />
            <BoxBuilder />
            <StorySection />
            <Testimonials />
            <CustomOrderForm />
            <FAQSection />
          </main>
          <Footer />
          <CartDrawer />
          <ProductModal />
          <AuthModal />
          <OrderHistoryModal />
          <AdminPortalModal />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
