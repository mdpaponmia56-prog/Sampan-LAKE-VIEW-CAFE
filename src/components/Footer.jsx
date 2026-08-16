const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';

export default function Footer() {
  const { t } = useLanguage();

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/about', label: t('about') },
    { to: '/menu', label: t('menu') },
    { to: '/gallery', label: t('gallery') },
    { to: '/reservation', label: t('reservation') },
    { to: '/contact', label: t('contact') },
  ];

  return (
    <footer className="bg-[#030f0f] border-t border-[#C5A059]/15 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/images/sampan-logo.jpg"
                alt="Sampan Lake View Cafe"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#C5A059]/50 shadow-lg bg-white"
              />
              <div>
                <div className="font-display text-xl text-gradient-gold">Sampan</div>
                <div className="text-xs text-[#C5A059]/60 tracking-widest uppercase">Lake View Cafe</div>
              </div>
            </div>
            <p className="text-[#F4F7F5]/50 text-sm leading-relaxed mb-6">
              A sanctuary where Chinese culinary tradition meets the tranquil beauty of Gazipur's lakeside.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/19CJP7WpMS/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sampan -Lake View Cafe on Facebook"
                className="w-10 h-10 rounded-full bg-[#1877F2]/20 border border-[#1877F2]/40 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2]/30 transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sampan Lake View Cafe on Instagram"
                className="w-10 h-10 rounded-full bg-[#E1306C]/20 border border-[#E1306C]/40 flex items-center justify-center text-[#E1306C] hover:bg-[#E1306C]/30 transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg text-[#C5A059] mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[#F4F7F5]/50 hover:text-[#C5A059] transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#C5A059]/0 group-hover:bg-[#C5A059] transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-display text-lg text-[#C5A059] mb-5">{t('openHours')}</h3>
            <div className="flex items-start gap-2 text-[#F4F7F5]/50 text-sm">
              <Clock className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
              <div>
                <p className="text-[#F4F7F5]/80 font-medium">Sunday – Saturday</p>
                <p>10:00 AM – 10:00 PM</p>
                <p className="mt-2 text-[#C5A059]/80">Open Every Day</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg text-[#C5A059] mb-5">{t('contact')}</h3>
            <div className="space-y-3">
              <a href="tel:+8801923784149" className="flex items-start gap-2 text-[#F4F7F5]/50 hover:text-[#C5A059] transition-colors text-sm group">
                <Phone className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
                <span>+880 1923 784 149</span>
              </a>
              <a href="mailto:sampanlakeviewcafe@gmail.com" className="flex items-start gap-2 text-[#F4F7F5]/50 hover:text-[#C5A059] transition-colors text-sm group">
                <Mail className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
                <span>sampanlakeviewcafe@gmail.com</span>
              </a>
              <div className="flex items-start gap-2 text-[#F4F7F5]/50 text-sm">
                <MapPin className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
                <span>Horinchala, Baimail, Ward No #12, Konabari, Gazipur City Corporation, Gazipur, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="horizon-line mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F4F7F5]/30">
          <p>© {new Date().getFullYear()} Sampan Lake View Cafe. {t('allRights')}</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-[#C5A059] transition-colors">{t('privacyPolicy')}</Link>
            <Link to="/terms" className="hover:text-[#C5A059] transition-colors">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}