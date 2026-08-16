import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

export default function Terms() {
  const { t } = useLanguage();
  return (
    <div className="bg-[#051C1C] min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-medium">Legal</span>
          <h1 className="font-display text-4xl md:text-5xl text-[#F4F7F5] mt-3 mb-8">{t('terms')}</h1>
          <div className="text-[#F4F7F5]/65 space-y-6 text-sm leading-relaxed">
            <p className="text-[#F4F7F5]/40 text-xs">Last updated: {new Date().toLocaleDateString()}</p>
            {[
              { title: "Reservations", body: "Table reservations are subject to availability. We reserve the right to cancel a reservation if the party is more than 15 minutes late without prior notice. We ask that you inform us of any cancellations at least 2 hours before your reservation time." },
              { title: "Menu & Pricing", body: "All prices are listed in Bangladeshi Taka (BDT/৳) inclusive of applicable taxes. Menu items and prices are subject to change without prior notice. We strive to maintain accuracy but errors may occur." },
              { title: "Ordering", body: "Orders placed via WhatsApp or our website are subject to confirmation by our team. We reserve the right to refuse service at our discretion. Payment is due upon delivery or pickup of food orders." },
              { title: "Allergen Notice", body: "Our kitchen handles nuts, gluten, dairy, and other common allergens. While we take precautions, we cannot guarantee allergen-free preparation for customers with severe allergies." },
              { title: "Photography", body: "Sampan Lake View Cafe may take photographs of food and general atmosphere for marketing purposes. Personal photography for private use is welcome." },
              { title: "Governing Law", body: "These terms are governed by the laws of Bangladesh. Any disputes shall be subject to the jurisdiction of courts in Gazipur, Bangladesh." },
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