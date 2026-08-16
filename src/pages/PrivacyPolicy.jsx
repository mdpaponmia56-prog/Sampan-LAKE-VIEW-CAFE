import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

export default function PrivacyPolicy() {
  const { t } = useLanguage();
  return (
    <div className="bg-[#051C1C] min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-medium">Legal</span>
          <h1 className="font-display text-4xl md:text-5xl text-[#F4F7F5] mt-3 mb-8">{t('privacyPolicy')}</h1>
          <div className="prose prose-invert max-w-none text-[#F4F7F5]/65 space-y-6 text-sm leading-relaxed">
            <p className="text-[#F4F7F5]/40 text-xs">Last updated: {new Date().toLocaleDateString()}</p>
            {[
              { title: "Information We Collect", body: "We collect information you provide directly to us, including your name, phone number, email address, and reservation or order details when you contact us or make a booking." },
              { title: "How We Use Information", body: "We use the information we collect to process reservations and orders, communicate with you about your booking, send confirmation messages, and improve our services." },
              { title: "Information Sharing", body: "We do not sell, trade, or rent your personal information to third parties. Your data is used exclusively to serve you at Sampan Lake View Cafe." },
              { title: "Data Security", body: "We implement appropriate security measures to protect your personal information. However, no internet transmission is 100% secure." },
              { title: "Cookies", body: "Our website uses cookies to remember your language preference and improve your browsing experience. You may disable cookies in your browser settings." },
              { title: "Contact Us", body: "If you have questions about this Privacy Policy, please contact us at sampanlakeviewcafe@gmail.com or call +880 1923 784 149." },
            ].map(section => (
              <div key={section.title}>
                <h2 className="font-display text-xl text-[#C5A059] mb-2">{section.title}</h2>
                <p>{section.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}