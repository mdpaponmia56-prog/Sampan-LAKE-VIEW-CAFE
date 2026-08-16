import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import CartDrawer from './CartDrawer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#051C1C] text-[#F4F7F5]">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
      <CartDrawer />
    </div>
  );
}