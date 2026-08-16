const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, MessageSquare, CheckCircle, ChevronRight, ChevronLeft, Phone } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Image } from '@/components/ui/image';

const timeSlots = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
  "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM",
];

const guestOptions = [1,2,3,4,5,6,7,8,10,12,15,20];

export default function Reservation() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    date: '', time: '', guests: 2,
    requests: '',
  });

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await db.entities.Reservation.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        date: form.date,
        time: form.time,
        guests: Number(form.guests),
        requests: form.requests,
        status: 'pending',
      });
      const whatsappMsg = `Hello! I'd like to reserve a table at Sampan Lake View Cafe.
Name: ${form.name}
Phone: ${form.phone}
Date: ${form.date}
Time: ${form.time}
Guests: ${form.guests}
Special Requests: ${form.requests || 'None'}`;
      window.open(`https://wa.me/8801923784149?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
      setSubmitted(true);
    } catch (e) {
      alert('Could not submit reservation: ' + (e.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#051C1C] min-h-screen pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-[#051C1C]" />
          </motion.div>
          <h2 className="font-display text-4xl text-[#F4F7F5] mb-3">{t('reservationSuccess')}</h2>
          <p className="text-[#F4F7F5]/60 leading-relaxed mb-8">{t('reservationSuccessMsg')}</p>
          <div className="glassmorphism-light rounded-xl p-5 border border-[#C5A059]/20 text-left mb-6">
            <div className="space-y-2 text-sm">
              {[
                { label: 'Name', val: form.name },
                { label: 'Date', val: form.date },
                { label: 'Time', val: form.time },
                { label: 'Guests', val: form.guests },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-[#F4F7F5]/40">{row.label}</span>
                  <span className="text-[#C5A059] font-medium">{row.val}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => { setSubmitted(false); setStep(1); setForm({ name: '', email: '', phone: '', date: '', time: '', guests: 2, requests: '' }); }}
            className="px-8 py-3 rounded-full border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059]/10 transition-all"
          >
            Make Another Reservation
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#051C1C] min-h-screen pt-20">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src="https://media.db.com/images/public/6a709030d676bd6178ead433/f3b016c0b_generated_0cbc57a8.png"
          alt="Lake view"
          className="w-full h-full"
          fittingType="fill"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#051C1C] via-[#051C1C]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 text-center p-8">
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-medium">{t('reservationLabel')}</span>
          <h1 className="font-display text-4xl md:text-5xl text-[#F4F7F5] mt-2">{t('reservationTitle')}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                s <= step ? 'gold-gradient text-[#051C1C]' : 'bg-[#0a1a1a] text-[#F4F7F5]/40 border border-[#C5A059]/20'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`flex-1 h-px max-w-16 transition-all duration-300 ${s < step ? 'bg-[#C5A059]' : 'bg-[#C5A059]/20'}`} />}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <div className="text-center mb-8">
                <Calendar className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
                <h2 className="font-display text-2xl text-[#F4F7F5]">Choose Your Date & Time</h2>
              </div>
              <div>
                <label className="block text-[#F4F7F5]/60 text-sm mb-2">{t('date')}</label>
                <input
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a1a1a] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] focus:outline-none focus:border-[#C5A059]/60 transition-all"
                />
              </div>
              <div>
                <label className="block text-[#F4F7F5]/60 text-sm mb-2">{t('time')}</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setForm({ ...form, time: slot })}
                      className={`py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        form.time === slot ? 'gold-gradient text-[#051C1C]' : 'bg-[#0a1a1a] border border-[#C5A059]/15 text-[#F4F7F5]/60 hover:border-[#C5A059]/40 hover:text-[#C5A059]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[#F4F7F5]/60 text-sm mb-2">{t('guests')}</label>
                <div className="flex flex-wrap gap-2">
                  {guestOptions.map(n => (
                    <button
                      key={n}
                      onClick={() => setForm({ ...form, guests: n })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        form.guests === n ? 'gold-gradient text-[#051C1C]' : 'bg-[#0a1a1a] border border-[#C5A059]/15 text-[#F4F7F5]/60 hover:border-[#C5A059]/40'
                      }`}
                    >
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => step === 1 && form.date && form.time && setStep(2)}
                disabled={!form.date || !form.time}
                className="w-full py-4 rounded-xl gold-gradient text-[#051C1C] font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl transition-all"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
              <div className="text-center mb-8">
                <Users className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
                <h2 className="font-display text-2xl text-[#F4F7F5]">Your Details</h2>
              </div>
              {[
                { key: 'name', label: t('yourName'), type: 'text', placeholder: 'Your full name' },
                { key: 'email', label: t('yourEmail'), type: 'email', placeholder: 'your@email.com' },
                { key: 'phone', label: t('yourPhone'), type: 'tel', placeholder: '+880...' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-[#F4F7F5]/60 text-sm mb-2">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a1a1a] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] placeholder-[#F4F7F5]/25 focus:outline-none focus:border-[#C5A059]/60 transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[#F4F7F5]/60 text-sm mb-2">{t('specialRequests')}</label>
                <textarea
                  rows={3}
                  placeholder="Any special dietary requirements or occasion?"
                  value={form.requests}
                  onChange={e => setForm({ ...form, requests: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a1a1a] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] placeholder-[#F4F7F5]/25 focus:outline-none focus:border-[#C5A059]/60 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-xl border border-[#C5A059]/30 text-[#C5A059] font-medium flex items-center justify-center gap-2 hover:bg-[#C5A059]/10 transition-all">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => form.name && form.phone && setStep(3)}
                  disabled={!form.name || !form.phone}
                  className="flex-1 py-4 rounded-xl gold-gradient text-[#051C1C] font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl transition-all"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <div className="text-center mb-8">
                <CheckCircle className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
                <h2 className="font-display text-2xl text-[#F4F7F5]">Confirm Reservation</h2>
              </div>
              <div className="glassmorphism-light rounded-2xl p-6 border border-[#C5A059]/15 space-y-3">
                {[
                  { label: 'Name', val: form.name },
                  { label: 'Phone', val: form.phone },
                  { label: 'Email', val: form.email || 'Not provided' },
                  { label: 'Date', val: form.date },
                  { label: 'Time', val: form.time },
                  { label: 'Guests', val: `${form.guests} person(s)` },
                  { label: 'Requests', val: form.requests || 'None' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-[#F4F7F5]/40">{row.label}</span>
                    <span className="text-[#F4F7F5] font-medium text-right max-w-[60%]">{row.val}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-4 rounded-xl border border-[#C5A059]/30 text-[#C5A059] font-medium flex items-center justify-center gap-2 hover:bg-[#C5A059]/10 transition-all">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-4 rounded-xl gold-gradient text-[#051C1C] font-bold hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : t('confirmReservation')}
                </button>
              </div>
              <p className="text-center text-[#F4F7F5]/30 text-xs">
                Your reservation will be saved and sent via WhatsApp.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Direct call option */}
        <div className="mt-12 text-center">
          <div className="horizon-line mb-6" />
          <p className="text-[#F4F7F5]/40 text-sm mb-3">Prefer to call directly?</p>
          <a
            href="tel:+8801923784149"
            className="inline-flex items-center gap-2 text-[#C5A059] font-medium hover:underline"
          >
            <Phone className="w-4 h-4" /> +880 1923 784 149
          </a>
        </div>
      </div>
    </div>
  );
}