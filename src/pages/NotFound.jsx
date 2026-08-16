import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { Home } from 'lucide-react';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="bg-[#051C1C] min-h-screen flex items-center justify-center px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="font-display text-[12rem] leading-none text-gradient-gold opacity-20 mb-0 select-none">404</div>
        <div className="sampan-animate text-6xl mb-6">⛵</div>
        <h1 className="font-display text-3xl md:text-5xl text-[#F4F7F5] mb-4">{t('notFound')}</h1>
        <p className="text-[#F4F7F5]/50 max-w-md mx-auto mb-10">{t('notFoundMsg')}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full gold-gradient text-[#051C1C] font-bold hover:shadow-xl hover:shadow-[#C5A059]/30 transition-all duration-300 hover:scale-105"
        >
          <Home className="w-4 h-4" /> {t('goHome')}
        </Link>
      </motion.div>
    </div>
  );
}