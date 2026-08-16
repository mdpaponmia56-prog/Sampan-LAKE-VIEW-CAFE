const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Image } from '@/components/ui/image';

const galleryItems = [
  { src: "https://media.db.com/images/public/user_6a708fb2b9806dc02d51a56a/2758960ab_653721489_122162023628862296_8788754229519454734_n.jpg", alt: "Sampan Lake View - Daytime", category: "venue", wide: true },
  { src: "https://media.db.com/images/public/user_6a708fb2b9806dc02d51a56a/b5b2a5632_653263963_122162023586862296_4594714457248011881_n.jpg", alt: "Colorful Night View", category: "venue" },
  { src: "https://media.db.com/images/public/6a709030d676bd6178ead433/f3b016c0b_generated_0cbc57a8.png", alt: "Lake at Twilight", category: "ambiance", wide: true },
  { src: "https://media.db.com/images/public/6a709030d676bd6178ead433/abfd068a9_generated_8ebdb7d0.png", alt: "Bamboo Pavilions", category: "venue" },
  { src: "https://media.db.com/images/public/6a709030d676bd6178ead433/91a351ef7_generated_ecbcae92.png", alt: "Aerial View", category: "venue" },
  { src: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png", alt: "Crispy Chicken Fry", category: "food" },
  { src: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png", alt: "Chicken Burger", category: "food" },
  { src: "https://media.db.com/images/public/6a709030d676bd6178ead433/9ba9de1c4_generated_27ecc927.png", alt: "Dhai Fuchka", category: "food" },
  { src: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png", alt: "Fried Rice Set Menu", category: "food" },
  { src: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png", alt: "Drinks & Desserts", category: "food" },
];

const categories = ['all', 'venue', 'ambiance', 'food'];

export default function Gallery() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const filtered = activeCategory === 'all' ? galleryItems : galleryItems.filter(i => i.category === activeCategory);

  return (
    <div className="bg-[#051C1C] min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-medium">{t('galleryLabel')}</span>
          <h1 className="font-display text-5xl md:text-7xl text-[#F4F7F5] mt-3 mb-4">{t('galleryTitle')}</h1>
          <p className="text-[#F4F7F5]/50 max-w-lg mx-auto">
            From twilight lake views to close-ups of our signature dishes — a visual journey through Sampan.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Filter */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                activeCategory === cat
                  ? 'gold-gradient text-[#051C1C]'
                  : 'border border-[#C5A059]/20 text-[#F4F7F5]/60 hover:border-[#C5A059]/50 hover:text-[#C5A059]'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="break-inside-avoid group relative cursor-pointer rounded-xl overflow-hidden border border-[#C5A059]/10 image-hover"
                onClick={() => setLightbox(item)}
              >
                <Image src={item.src} alt={item.alt} className="w-full h-auto" fittingType="fit" />
                <div className="absolute inset-0 bg-[#051C1C]/0 group-hover:bg-[#051C1C]/50 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#051C1C]/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-[#F4F7F5] text-sm font-medium">{item.alt}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-10"
              onClick={() => setLightbox(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-4xl max-h-[90vh] rounded-xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <img src={lightbox.src} alt={lightbox.alt} className="max-w-full max-h-[85vh] object-contain" />
              <p className="text-center text-white/60 text-sm mt-3">{lightbox.alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}