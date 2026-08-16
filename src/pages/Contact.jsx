import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    const msg = `Hello Sampan Lake View Cafe!
My name is ${form.name} (${form.email}).

${form.message}`;
    window.open(`https://wa.me/8801923784149?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const contactItems = [
    { icon: Phone, label: t('phone'), value: '+880 1923 784 149', href: 'tel:+8801923784149' },
    { icon: Mail, label: t('email'), value: 'sampanlakeviewcafe@gmail.com', href: 'mailto:sampanlakeviewcafe@gmail.com' },
    { icon: MapPin, label: t('address'), value: 'Horinchala, Baimail, Ward No #12, Konabari, Gazipur City Corporation, Gazipur, Bangladesh', href: 'https://maps.google.com/?q=Konabari+Gazipur+Bangladesh' },
    { icon: Clock, label: t('openHours'), value: 'Sunday – Saturday: 10:00 AM – 10:00 PM', href: null },
  ];

  return (
    <div className="bg-[#051C1C] min-h-screen pt-20">
      {/* Hero */}
      <div className="py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-medium">{t('contactLabel')}</span>
          <h1 className="font-display text-5xl md:text-7xl text-[#F4F7F5] mt-3 mb-4">{t('contactTitle')}</h1>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-5 mb-10">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 p-4 rounded-xl bg-[#0a1a1a] border border-[#C5A059]/10 hover:border-[#C5A059]/30 transition-all group">
                  <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#051C1C]" />
                  </div>
                  <div>
                    <div className="text-[#C5A059] text-xs uppercase tracking-wider mb-1">{label}</div>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-[#F4F7F5]/70 hover:text-[#C5A059] transition-colors text-sm leading-relaxed">
                        {value}
                      </a>
                    ) : (
                      <p className="text-[#F4F7F5]/70 text-sm leading-relaxed">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/8801923784149"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <div className="text-[#25D366] font-semibold">{t('chatWhatsApp')}</div>
                <div className="text-[#F4F7F5]/50 text-sm">Quick response guaranteed</div>
              </div>
            </a>

            {/* Map */}
            <div className="mt-6 rounded-xl overflow-hidden border border-[#C5A059]/10 h-52">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4665.228478874992!2d90.3354619!3d24.000788899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755dd0042f7d6ad%3A0x941bd194b1d7f5ed!2sSampan%20Lake%20View%20Cafe!5e1!3m2!1sen!2sbd!4v1785768128641!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Sampan Lake View Cafe Location"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="glassmorphism-light rounded-2xl p-8 border border-[#C5A059]/15">
              <h2 className="font-display text-2xl text-[#F4F7F5] mb-6">{t('sendMessage')}</h2>
              <div className="space-y-5">
                {[
                  { key: 'name', label: t('yourName'), type: 'text', placeholder: 'Your name' },
                  { key: 'email', label: t('yourEmail'), type: 'email', placeholder: 'your@email.com' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[#F4F7F5]/60 text-sm mb-2">{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] placeholder-[#F4F7F5]/25 focus:outline-none focus:border-[#C5A059]/60 transition-all"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-[#F4F7F5]/60 text-sm mb-2">{t('yourMessage')}</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] placeholder-[#F4F7F5]/25 focus:outline-none focus:border-[#C5A059]/60 transition-all resize-none"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!form.name || !form.message}
                  className="w-full py-4 rounded-xl gold-gradient text-[#051C1C] font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl transition-all"
                >
                  {sent ? (
                    <>Sent! ✓</>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t('send')} via WhatsApp
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social & Facebook */}
            <div className="mt-6 p-5 rounded-xl bg-[#0a1a1a] border border-[#C5A059]/10">
              <p className="text-[#F4F7F5]/50 text-sm mb-3">{t('followUs')}</p>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/share/19CJP7WpMS/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sampan Lake View Cafe Facebook"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1877F2]/15 border border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2]/25 transition-all text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Sampan Lake View Cafe
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}