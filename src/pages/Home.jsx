const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronDown, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  ArrowRight, 
  Flame, 
  Send,
  Waves,
  Sparkles,
  Utensils,
  CalendarCheck
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useCart } from '@/lib/CartContext';
import { menuData } from '@/lib/translations';

import { useToast } from '@/components/ui/use-toast';
import { Image } from '@/components/ui/image';

// Floating particle component
function Particle({ style }) {
  return <div className="particle" style={style} />;
}

// Stat card
function StatCard({ number, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="font-display text-4xl md:text-5xl text-gradient-gold mb-1">{number}</div>
      <div className="text-[#F4F7F5]/60 text-xs md:text-sm uppercase tracking-widest">{label}</div>
    </motion.div>
  );
}

// Signature dish card
function SignatureCard({ item, index }) {
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const name = language === 'bn' ? item.nameBn : item.name;

  const handleAdd = () => {
    addToCart(item);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      viewport={{ once: true }}
      className="group relative rounded-2xl overflow-hidden border border-[#C5A059]/20 card-hover image-hover bg-[#0a1a1a]"
    >
      <div className="aspect-square">
        <Image
          src={item.image}
          alt={name}
          className="w-full h-full object-cover"
          fittingType="fill"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#051C1C] via-[#051C1C]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {(item.chefPick || item.popular) && (
          <div className="flex gap-2 mb-2">
            {item.chefPick && (
              <span className="px-2 py-0.5 bg-[#C5A059] text-[#051C1C] text-xs font-bold rounded-full uppercase tracking-wider">
                Chef's Pick
              </span>
            )}
            {item.popular && (
              <span className="px-2 py-0.5 bg-[#E67E22]/20 border border-[#E67E22]/60 text-[#E67E22] text-xs font-bold rounded-full flex items-center gap-1">
                <Flame className="w-2.5 h-2.5" /> Popular
              </span>
            )}
          </div>
        )}
        <h3 className="font-display text-xl text-[#F4F7F5] mb-1">{name}</h3>
        <p className="text-[#F4F7F5]/60 text-sm mb-3 line-clamp-1">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[#C5A059] font-bold text-xl">৳{item.price}</span>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-full gold-gradient text-[#051C1C] font-semibold text-sm hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Gallery preview
function GalleryPreview({ src, alt, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="rounded-2xl overflow-hidden image-hover aspect-[4/3] border border-[#C5A059]/15 shadow-xl bg-[#0a1a1a]"
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </motion.div>
  );
}

export default function Home() {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [signatureDishes, setSignatureDishes] = useState(() => [
    menuData.find(d => d.id === 25),
    menuData.find(d => d.id === 16),
    menuData.find(d => d.id === 23),
  ].filter(Boolean));
  const [reviews, setReviews] = useState([
    { name: "Rakib Hassan", text: "The most unique dining experience in Gazipur. Eating on the lake with neon lights reflecting in the water is magical!", rating: 5 },
    { name: "Mithila Akter", text: "Sampan Special Burger is incredible. The lakeside view makes every meal feel like a special occasion.", rating: 5 },
    { name: "Farhan Islam", text: "Dhai Fuchka is a must-try. The atmosphere at night with all the colorful lights is absolutely breathtaking.", rating: 5 },
  ]);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, text: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const items = await db.entities.MenuItem.list('-created_date', 500);
        if (items.length > 0) {
          const sigNames = ["Crispy Chicken Fry 1 Pcs", "Sampan Special Burger", "Dhai Fuchka-10 Pcs (Signature Item)"];
          const sig = sigNames.map(n => items.find(i => i.name === n)).filter(Boolean);
          if (sig.length > 0) setSignatureDishes(sig);
        }
      } catch (e) { console.error('menu load', e); }

      try {
        const approved = await db.entities.Review.list('-created_date', 10);
        if (approved.length > 0) setReviews(approved);
      } catch (e) { console.error('reviews load', e); }
    })();
  }, []);

  const submitReview = async () => {
    if (!reviewForm.name || !reviewForm.text) {
      toast({ title: 'Please enter your name and review', variant: 'destructive' });
      return;
    }
    setSubmittingReview(true);
    try {
      await db.entities.Review.create({
        name: reviewForm.name,
        rating: Number(reviewForm.rating),
        text: reviewForm.text,
        status: 'pending',
      });
      toast({ title: 'Thank you! Your review is pending approval.' });
      setReviewForm({ name: '', rating: 5, text: '' });
    } catch (e) {
      toast({ title: 'Could not submit review', description: e.message, variant: 'destructive' });
    } finally {
      setSubmittingReview(false);
    }
  };

  const particles = Array.from({ length: 14 }, (_, i) => ({
    width: `${Math.random() * 4 + 2}px`,
    height: `${Math.random() * 4 + 2}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 6}s`,
    animationDuration: `${Math.random() * 4 + 5}s`,
    opacity: Math.random() * 0.6 + 0.2,
  }));

  const galleryImages = [
    { src: "/images/sampan-hero-lakeview.jpg", alt: "Sampan Lake View Cafe lakeside walkway & dining pavilions" },
    { src: "https://media.db.com/images/public/user_6a708fb2b9806dc02d51a56a/2758960ab_653721489_122162023628862296_8788754229519454734_n.jpg", alt: "Sampan Lake View Cafe daytime" },
    { src: "https://media.db.com/images/public/user_6a708fb2b9806dc02d51a56a/b5b2a5632_653263963_122162023586862296_4594714457248011881_n.jpg", alt: "Sampan Lake View Cafe night view" },
    { src: "https://media.db.com/images/public/6a709030d676bd6178ead433/abfd068a9_generated_8ebdb7d0.png", alt: "Restaurant ambiance" },
  ];

  return (
    <div className="bg-[#051C1C] text-[#F4F7F5]">
      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="relative min-h-[92vh] lg:min-h-screen overflow-hidden flex items-center justify-center pt-24 pb-16">
        {/* Authentic Lakeside Hero Background with Parallax */}
        <motion.div className="absolute inset-0 scale-105" style={{ y: bgY }}>
          <img
            src="/images/sampan-hero-lakeview.jpg"
            alt="Sampan Lake View Cafe Overwater Walkway & Red Roof Cottages"
            className="w-full h-full object-cover object-center"
          />
          {/* Multi-layered cinematic gradient for text legibility & glowing aesthetics */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#051C1C]/75 via-[#051C1C]/55 to-[#051C1C]" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#051C1C]/30 to-[#051C1C]/90" />
        </motion.div>

        {/* Floating Light Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p, i) => (
            <Particle key={i} style={p} />
          ))}
        </div>

        {/* Horizon gold line decoration */}
        <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent pointer-events-none" />

        {/* Hero Content Box */}
        <motion.div
          style={{ y: textY, opacity }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center"
        >
          {/* Luxury Location Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#051C1C]/80 border border-[#C5A059]/40 backdrop-blur-md text-[#C5A059] text-xs font-semibold uppercase tracking-[0.25em] mb-6 shadow-xl shadow-black/40"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{language === 'bn' ? 'গাজীপুরের সেরা লেক ভিউ রেস্তোরাঁ' : 'Authentic Lakeside Dining • Gazipur'}</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08] mb-6 text-[#F4F7F5] font-bold drop-shadow-2xl"
          >
            <span className="block">{language === 'bn' ? 'জলের ধারে' : 'A Symphony'}</span>
            <span className="block text-gradient-gold shimmer">
              {language === 'bn' ? 'মশলার অপূর্ব সিম্ফনি' : 'of Authentic Flavors'}
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light italic text-[#F4F7F5]/85 mt-1 font-display">
              {language === 'bn' ? 'সাম্পান লেক ভিউ ক্যাফে' : 'by the Serene Water'}
            </span>
          </motion.h1>

          {/* Subtitle with high-readability backdrop */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-[#F4F7F5]/85 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light leading-relaxed drop-shadow"
          >
            {language === 'bn' 
              ? 'লেক ভিউ কটেজে বসে উপভোগ করুন স্পেশাল ফুচকা, চিকেন ফ্রাই, সিগনেচার বার্গার এবং চাইনিজ সেট মেনু।' 
              : 'Dine in traditional red-roofed cottages over calm waters in Konabari, Gazipur. Savor handcrafted burgers, crispy chicken, Thai soups, and authentic Bengali street bites.'}
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link
              to="/menu"
              className="w-full sm:w-auto px-8 py-4 rounded-full gold-gradient text-[#051C1C] font-bold text-base hover:shadow-2xl hover:shadow-[#C5A059]/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2.5 shadow-lg"
            >
              <Utensils className="w-4 h-4" />
              <span>{t('heroBtn1') || 'Order Online / Menu'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/reservation"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#051C1C]/80 border border-[#C5A059]/50 backdrop-blur-md text-[#F4F7F5] font-semibold text-base hover:border-[#C5A059] transition-all duration-300 hover:text-[#C5A059] hover:bg-[#051C1C] flex items-center justify-center gap-2 shadow-lg"
            >
              <CalendarCheck className="w-4 h-4 text-[#C5A059]" />
              <span>{t('heroBtn2') || 'Book Lakeside Table'}</span>
            </Link>
          </motion.div>

          {/* Highlight feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-8 pt-4 border-t border-[#C5A059]/20"
          >
            {[
              { icon: Waves, label: language === 'bn' ? 'লেকের ওপর কটেজ' : 'Over-Water Cottages' },
              { icon: Flame, label: language === 'bn' ? 'সিগনেচার খাবার' : '80+ Authentic Dishes' },
              { icon: Star, label: language === 'bn' ? '৪.৯ স্টার রেটিং' : '4.9 Star Hospitality' },
              { icon: MapPin, label: language === 'bn' ? 'কোনাবাড়ী, গাজীপুর' : 'Konabari, Gazipur' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#051C1C]/60 border border-[#C5A059]/25 text-xs text-[#F4F7F5]/80 backdrop-blur-xs"
                >
                  <Icon className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 pointer-events-none"
        >
          <span className="text-[#C5A059]/70 text-[10px] uppercase tracking-widest">{t('heroScroll')}</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4 text-[#C5A059]/80" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="py-10 border-y border-[#C5A059]/20 bg-[#0a1a1a]/95 relative z-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <StatCard number="5,000+" label={t('happyGuests')} delay={0} />
          <StatCard number="78+" label={t('menuItems')} delay={0.1} />
          <StatCard number="3+" label={t('yearsOfJoy')} delay={0.2} />
          <StatCard number="300+" label={t('lakeViews')} delay={0.3} />
        </div>
      </section>

      {/* ===== ABOUT TEASER ===== */}
      <section className="section-padding px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-medium">{t('aboutLabel')}</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F4F7F5] mt-3 mb-6 leading-tight font-bold">
              {t('aboutTitle')}
            </h2>
            <p className="text-[#F4F7F5]/70 text-base leading-relaxed mb-4">
              {t('aboutP1')}
            </p>
            <p className="text-[#F4F7F5]/70 text-base leading-relaxed mb-8">
              {t('aboutP2')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[#C5A059] font-semibold text-base hover:text-[#F4D35E] transition-colors group"
              >
                <span>{t('readStory')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-[#C5A059]/30 shadow-2xl group"
          >
            <img
              src="/images/sampan-hero-lakeview.jpg"
              alt="Sampan Lake View Cafe Lakeside Dining Walkway"
              className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051C1C]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#051C1C]/85 backdrop-blur-md border border-[#C5A059]/20">
              <div className="text-xs text-[#C5A059] font-bold uppercase tracking-wider">Overwater Floating Architecture</div>
              <div className="text-sm text-[#F4F7F5] font-display mt-0.5">Lakeside Cottages & Peaceful Sunset Breeze</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SIGNATURE CREATIONS ===== */}
      <section className="section-padding px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#C5A059]/15">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-medium">{t('signaturesLabel')}</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F4F7F5] mt-2 mb-4 font-bold">{t('signaturesTitle')}</h2>
          <p className="text-[#F4F7F5]/60 text-sm">{t('signaturesSub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {signatureDishes.map((dish, i) => (
            <SignatureCard key={dish.id || i} item={dish} index={i} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full gold-gradient text-[#051C1C] font-bold text-sm hover:shadow-xl hover:shadow-[#C5A059]/20 transition-all hover:scale-105"
          >
            <span>{t('viewFullMenu') || 'Explore Full 78+ Dish Menu'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ===== ATMOSPHERE & GALLERY ===== */}
      <section className="section-padding px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#C5A059]/15">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-medium">Lakeside Ambiance</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F4F7F5] mt-2 mb-4 font-bold">Experience Sampan Lake View</h2>
          <p className="text-[#F4F7F5]/60 text-sm">Where delicious flavours meet breathtaking over-water views in Gazipur</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((img, i) => (
            <GalleryPreview key={i} src={img.src} alt={img.alt} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ===== REVIEWS SECTION ===== */}
      <section className="section-padding px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#C5A059]/15">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-medium">{t('reviewsLabel')}</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F4F7F5] mt-2 mb-4 font-bold">{t('reviewsTitle')}</h2>
          <p className="text-[#F4F7F5]/60 text-sm">{t('reviewsSub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviews.slice(0, 3).map((r, i) => (
            <motion.div
              key={r.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/15 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <Star key={starIdx} className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
                  ))}
                </div>
                <p className="text-sm text-[#F4F7F5]/80 italic leading-relaxed">
                  "{r.text}"
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#C5A059]/10">
                <span className="font-display text-base text-[#F4F7F5] font-bold">{r.name}</span>
                {r.dishName && <div className="text-[11px] text-[#C5A059]">{r.dishName}</div>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Submit Review Card */}
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0a1a1a] border border-[#C5A059]/25 shadow-xl space-y-4">
          <div className="text-center">
            <h3 className="font-display text-2xl text-[#F4F7F5]">Share Your Dining Experience</h3>
            <p className="text-xs text-[#F4F7F5]/50 mt-1">We love hearing from our guests</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#F4F7F5]/70 mb-1">Your Name</label>
              <input
                value={reviewForm.name}
                onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                placeholder="e.g. Tanvir Ahmed"
                className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-sm text-[#F4F7F5] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F4F7F5]/70 mb-1">Rating</label>
              <select
                value={reviewForm.rating}
                onChange={e => setReviewForm({ ...reviewForm, rating: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-sm text-[#F4F7F5] focus:outline-none focus:border-[#C5A059]"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                <option value={3}>⭐⭐⭐ (3 - Good)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F4F7F5]/70 mb-1">Review Details</label>
              <textarea
                rows={3}
                value={reviewForm.text}
                onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })}
                placeholder="Tell us about the atmosphere, food, and your lake view experience..."
                className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-sm text-[#F4F7F5] focus:outline-none focus:border-[#C5A059] resize-none"
              />
            </div>

            <button
              onClick={submitReview}
              disabled={submittingReview}
              className="w-full py-3 rounded-xl gold-gradient text-[#051C1C] font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </section>

      {/* ===== LOCATION & HOURS BANNER ===== */}
      <section className="py-12 border-t border-[#C5A059]/15 bg-[#081414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3.5">
            <div className="w-11 h-11 rounded-xl gold-gradient flex items-center justify-center text-[#051C1C] shrink-0 shadow-md">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#C5A059] font-bold uppercase tracking-wider">Location</div>
              <div className="text-xs text-[#F4F7F5]/80 mt-0.5">Horinchala, Baimail, Konabari, Gazipur</div>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5">
            <div className="w-11 h-11 rounded-xl gold-gradient flex items-center justify-center text-[#051C1C] shrink-0 shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#C5A059] font-bold uppercase tracking-wider">Opening Hours</div>
              <div className="text-xs text-[#F4F7F5]/80 mt-0.5">Everyday: 10:00 AM – 10:00 PM</div>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5">
            <div className="w-11 h-11 rounded-xl gold-gradient flex items-center justify-center text-[#051C1C] shrink-0 shadow-md">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#C5A059] font-bold uppercase tracking-wider">Direct Hotline</div>
              <div className="text-xs text-[#F4F7F5]/80 mt-0.5">+880 1923 784 149</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}