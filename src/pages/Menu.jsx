const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Flame, Star, Plus } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useCart } from '@/lib/CartContext';
import { menuData, categoryMap } from '@/lib/translations';

import { Image } from '@/components/ui/image';

function MenuCard({ item }) {
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const [added, setAdded] = useState(false);
  const name = language === 'bn' ? item.nameBn : item.name;

  const handleAdd = () => {
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="group flex gap-4 p-4 rounded-xl border border-[#C5A059]/10 hover:border-[#C5A059]/40 bg-[#0a1a1a] hover:bg-[#0d2020] transition-all duration-300"
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 image-hover">
        <Image src={item.image} alt={name} className="w-full h-full" fittingType="fill" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex flex-wrap gap-1.5 mb-1">
              {item.chefPick && (
                <span className="px-2 py-0.5 bg-[#C5A059]/20 text-[#C5A059] text-xs rounded-full font-medium">Chef's Pick</span>
              )}
              {item.popular && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-[#E67E22]/10 text-[#E67E22] text-xs rounded-full font-medium">
                  <Flame className="w-2.5 h-2.5" /> Popular
                </span>
              )}
            </div>
            <h3 className="font-medium text-[#F4F7F5] text-sm leading-tight">{name}</h3>
            <p className="text-[#F4F7F5]/40 text-xs mt-0.5 line-clamp-1">{item.description}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[#C5A059] font-bold">৳{item.price}</div>
            <button
              onClick={handleAdd}
              className={`mt-1.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                added
                  ? 'bg-green-500 text-white scale-90'
                  : 'bg-[#C5A059]/20 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#051C1C] hover:scale-110'
              }`}
              aria-label="Add to cart"
            >
              {added ? <Star className="w-3.5 h-3.5 fill-white" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filterPopular, setFilterPopular] = useState(false);
  const [filterChef, setFilterChef] = useState(false);
  const [dbItems, setDbItems] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await db.entities.MenuItem.list('-created_date', 500);
        setDbItems(data);
      } catch (e) {
        console.error('Failed to load menu from DB, using static data', e);
        setDbItems([]);
      }
    })();
  }, []);

  const allItems = useMemo(() => {
    if (dbItems && dbItems.length > 0) return dbItems.filter(i => i.available !== false);
    return menuData;
  }, [dbItems]);

  const categories = useMemo(() => {
    const cats = [...new Set(allItems.map(d => d.category))];
    return cats.map(c => ({ key: c, ...categoryMap[c] }));
  }, [allItems]);

  const filtered = useMemo(() => {
    return allItems.filter(item => {
      const name = language === 'bn' ? item.nameBn : item.name;
      const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchPop = !filterPopular || item.popular;
      const matchChef = !filterChef || item.chefPick;
      return matchSearch && matchCat && matchPop && matchChef;
    });
  }, [allItems, search, activeCategory, filterPopular, filterChef, language]);

  const grouped = useMemo(() => {
    if (activeCategory !== 'all') {
      return { [activeCategory]: filtered };
    }
    const g = {};
    filtered.forEach(item => {
      if (!g[item.category]) g[item.category] = [];
      g[item.category].push(item);
    });
    return g;
  }, [filtered, activeCategory]);

  if (dbItems === null) {
    return (
      <div className="bg-[#051C1C] min-h-screen pt-20 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#051C1C] min-h-screen pt-20">
      {/* Hero */}
      <div className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://media.db.com/images/public/6a709030d676bd6178ead433/f3b016c0b_generated_0cbc57a8.png"
            alt=""
            className="w-full h-full"
            fittingType="fill"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-medium">{t('menuLabel')}</span>
          <h1 className="font-display text-5xl md:text-7xl text-[#F4F7F5] mt-3 mb-4">{t('menuTitle')}</h1>
          <p className="text-[#F4F7F5]/50 max-w-xl mx-auto">{t('menuSub')}</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Search & Filters */}
        <div className="sticky top-20 z-30 py-4 bg-[#051C1C]/95 backdrop-blur-md border-b border-[#C5A059]/10 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/60" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-3 bg-[#0a1a1a] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] placeholder-[#F4F7F5]/30 focus:outline-none focus:border-[#C5A059]/60 text-sm transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterPopular(!filterPopular)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  filterPopular ? 'bg-[#E67E22]/20 border-[#E67E22]/60 text-[#E67E22]' : 'border-[#C5A059]/20 text-[#F4F7F5]/60 hover:border-[#C5A059]/40'
                }`}
              >
                <Flame className="w-3.5 h-3.5" /> Popular
              </button>
              <button
                onClick={() => setFilterChef(!filterChef)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  filterChef ? 'bg-[#C5A059]/20 border-[#C5A059]/60 text-[#C5A059]' : 'border-[#C5A059]/20 text-[#F4F7F5]/60 hover:border-[#C5A059]/40'
                }`}
              >
                <Star className="w-3.5 h-3.5" /> Chef's Pick
              </button>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === 'all' ? 'gold-gradient text-[#051C1C]' : 'border border-[#C5A059]/20 text-[#F4F7F5]/60 hover:border-[#C5A059]/50'
              }`}
            >
              {t('allCategories')}
            </button>
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.key ? 'gold-gradient text-[#051C1C]' : 'border border-[#C5A059]/20 text-[#F4F7F5]/60 hover:border-[#C5A059]/50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{language === 'bn' ? cat.bn : cat.en}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 text-[#F4F7F5]/40">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No dishes found. Try a different search.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([catKey, items]) => {
              const catInfo = categoryMap[catKey];
              return (
                <div key={catKey}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-6"
                  >
                    <span className="text-2xl">{catInfo?.icon}</span>
                    <h2 className="font-display text-2xl text-[#C5A059]">
                      {language === 'bn' ? catInfo?.bn : catInfo?.en}
                    </h2>
                    <div className="flex-1 horizon-line ml-2" />
                    <span className="text-[#F4F7F5]/30 text-sm">{items.length} items</span>
                  </motion.div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <AnimatePresence mode="popLayout">
                      {items.map(item => (
                        <MenuCard key={item.id} item={item} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* WhatsApp Order CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-2xl glassmorphism-light border border-[#C5A059]/20 text-center"
        >
          <h3 className="font-display text-2xl text-[#F4F7F5] mb-2">Prefer to Order Directly?</h3>
          <p className="text-[#F4F7F5]/50 mb-6 text-sm">Call us or send a WhatsApp message for quick ordering</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/8801923784149?text=Hello! I'd like to place an order."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe5d] transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('orderWhatsApp')}
            </a>
            <a
              href="tel:+8801923784149"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#C5A059]/40 text-[#C5A059] font-medium hover:bg-[#C5A059]/10 transition-all duration-300"
            >
              +880 1923 784 149
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}