const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useCart } from '@/lib/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/about', label: t('about') },
    { to: '/menu', label: t('menu') },
    { to: '/gallery', label: t('gallery') },
    { to: '/reservation', label: t('reservation') },
    { to: '/contact', label: t('contact') },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glassmorphism shadow-2xl shadow-black/30'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="https://media.db.com/images/public/user_6a708fb2b9806dc02d51a56a/e310c872b_497503132_122105925272862296_7443416267114685548_n.jpg"
                alt="Sampan Lake View Cafe"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#C5A059] group-hover:border-[#E8C87A] transition-all duration-300"
              />
              <div className="hidden sm:block">
                <div className="font-display text-xl font-semibold text-gradient-gold leading-tight">
                  Sampan
                </div>
                <div className="text-xs text-[#C5A059]/70 tracking-widest uppercase">
                  Lake View Cafe
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg relative group ${
                    isActive(link.to)
                      ? 'text-[#C5A059]'
                      : 'text-[#F4F7F5]/80 hover:text-[#C5A059]'
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#C5A059] transition-all duration-300 ${
                    isActive(link.to) ? 'w-4' : 'w-0 group-hover:w-4'
                  }`} />
                </Link>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059]/10 transition-all duration-300 text-xs font-medium"
                aria-label="Toggle language"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059]/10 transition-all duration-300"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#E67E22] text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* Order CTA */}
              <Link
                to="/menu"
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full gold-gradient text-[#051C1C] font-semibold text-sm hover:shadow-lg hover:shadow-[#C5A059]/30 transition-all duration-300 hover:scale-105"
              >
                {t('order')}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-[#F4F7F5] hover:text-[#C5A059] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 glassmorphism flex flex-col pt-24 px-6 gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    to={link.to}
                    className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive(link.to)
                        ? 'text-[#C5A059] bg-[#C5A059]/10'
                        : 'text-[#F4F7F5]/80 hover:text-[#C5A059] hover:bg-[#C5A059]/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-4 pt-4 border-t border-[#C5A059]/20">
                <Link
                  to="/menu"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full gold-gradient text-[#051C1C] font-semibold"
                >
                  {t('order')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}