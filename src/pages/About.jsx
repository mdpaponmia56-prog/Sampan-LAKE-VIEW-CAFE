const db = globalThis['__B44_DB__'] || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Star, Leaf, Heart, Award } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

function ValueCard({ icon: Icon, title, text, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="glassmorphism-light rounded-2xl p-6 border border-[#C5A059]/10 card-hover"
    >
      <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#051C1C]" />
      </div>
      <h3 className="font-display text-xl text-[#F4F7F5] mb-2">{title}</h3>
      <p className="text-[#F4F7F5]/50 text-sm leading-relaxed">{text}</p>
    </motion.div>
  );
}

export default function About() {
  const { t, language } = useLanguage();

  return (
    <div className="bg-[#051C1C] min-h-screen pt-20">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src="/images/sampan-hero-lakeview.jpg"
          alt="Sampan Lake View Cafe Walkway and Cottages"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#051C1C] via-[#051C1C]/65 to-[#051C1C]/30" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-medium">{t('aboutLabel')}</span>
            <h1 className="font-display text-4xl md:text-6xl text-[#F4F7F5] mt-2">{t('aboutTitle')}</h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Section */}
        <section className="section-padding">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-5 text-[#F4F7F5]/65 leading-relaxed">
                <p className="text-lg">{t('aboutText1')}</p>
                <p>{t('aboutText2')}</p>
                <p className="italic text-[#C5A059]/90 font-display text-xl">"{t('aboutText3')}"</p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0a1a1a] border border-[#C5A059]/15">
                  <Clock className="w-5 h-5 text-[#C5A059] mb-2" />
                  <div className="text-[#F4F7F5] font-medium text-sm">{t('openEveryDay')}</div>
                  <div className="text-[#F4F7F5]/50 text-xs">{t('hours')}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0a1a1a] border border-[#C5A059]/15">
                  <MapPin className="w-5 h-5 text-[#C5A059] mb-2" />
                  <div className="text-[#F4F7F5] font-medium text-sm">Location</div>
                  <div className="text-[#F4F7F5]/50 text-xs">Konabari, Gazipur</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0a1a1a] border border-[#C5A059]/15">
                  <Phone className="w-5 h-5 text-[#C5A059] mb-2" />
                  <div className="text-[#F4F7F5] font-medium text-sm">Phone</div>
                  <div className="text-[#F4F7F5]/50 text-xs">+880 1923 784 149</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0a1a1a] border border-[#C5A059]/15">
                  <Star className="w-5 h-5 text-[#C5A059] mb-2" />
                  <div className="text-[#F4F7F5] font-medium text-sm">Rating</div>
                  <div className="text-[#F4F7F5]/50 text-xs">★★★★★ Top Rated</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="rounded-2xl overflow-hidden image-hover aspect-[3/4] border border-[#C5A059]/15 shadow-xl bg-[#0a1a1a]">
                <img
                  src="https://media.db.com/images/public/user_6a708fb2b9806dc02d51a56a/2758960ab_653721489_122162023628862296_8788754229519454734_n.jpg"
                  alt="Daytime view"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4 mt-8">
                <div className="rounded-2xl overflow-hidden image-hover aspect-square border border-[#C5A059]/15 shadow-xl bg-[#0a1a1a]">
                  <img
                    src="https://media.db.com/images/public/user_6a708fb2b9806dc02d51a56a/b5b2a5632_653263963_122162023586862296_4594714457248011881_n.jpg"
                    alt="Night atmosphere"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden image-hover aspect-square border border-[#C5A059]/15 shadow-xl bg-[#0a1a1a]">
                  <img
                    src="https://media.db.com/images/public/6a709030d676bd6178ead433/abfd068a9_generated_8ebdb7d0.png"
                    alt="Ambiance"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-medium">Our Values</span>
            <h2 className="font-display text-4xl text-[#F4F7F5] mt-3">What We Stand For</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            <ValueCard
              icon={Leaf}
              title="Fresh Ingredients"
              text="Every dish is crafted with the freshest ingredients sourced locally, ensuring authentic flavors in every bite."
              delay={0}
            />
            <ValueCard
              icon={Heart}
              title="Made with Love"
              text="Our kitchen team puts heart and soul into every recipe, from the crispiest Chicken Fry to the smoothest Faluda."
              delay={0.1}
            />
            <ValueCard
              icon={Award}
              title="Lakeside Excellence"
              text="We've created a dining experience unlike any other in Gazipur — where nature, culture, and cuisine converge."
              delay={0.2}
            />
          </div>
        </section>

        {/* Bangla Address Section */}
        <section className="pb-24">
          <div className="glassmorphism-light rounded-2xl p-8 border border-[#C5A059]/15 text-center">
            <h3 className="font-display text-2xl text-[#C5A059] mb-4">আমাদের ঠিকানা</h3>
            <p className="text-[#F4F7F5]/70 text-lg leading-relaxed font-bengali">
              হরিণ তলা, বাইমাইল, ওয়ার্ড নং # ১২, কোনাবাড়ী,<br />
              গাজীপুর সিটি কর্পোরেশন গাজীপুর, বাংলাদেশ
            </p>
            <div className="mt-4 text-[#F4F7F5]/40 text-sm">
              Horinchala, Baimail, Ward No #12, Konabari, Gazipur City Corporation, Gazipur, Bangladesh
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}