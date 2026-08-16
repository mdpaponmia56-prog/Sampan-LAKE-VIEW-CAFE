const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, CheckCircle, User, Phone, MapPin, Package, ChevronLeft } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Link } from 'react-router-dom';

import { useToast } from '@/components/ui/use-toast';

export default function CartDrawer() {
  const { cartItems, removeFromCart, updateQuantity, subtotal, isCartOpen, setIsCartOpen, totalItems, clearCart } = useCart();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [checkout, setCheckout] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', orderType: 'delivery', notes: '' });

  const deliveryFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  const close = () => {
    setIsCartOpen(false);
    setTimeout(() => { setCheckout(false); setDone(false); }, 300);
  };

  const placeOrder = async () => {
    if (!form.name || !form.phone) {
      toast({ title: 'Please enter your name and phone', variant: 'destructive' });
      return;
    }
    setPlacing(true);
    try {
      await db.entities.Order.create({
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: '',
        items: cartItems.map(i => ({ id: i.id, name: i.name, nameBn: i.nameBn, price: i.price, quantity: i.quantity, image: i.image })),
        subtotal,
        deliveryFee,
        total,
        orderType: form.orderType,
        address: form.address,
        notes: form.notes,
        status: 'pending',
      });
      clearCart();
      setDone(true);
      toast({ title: 'Order placed successfully!' });
    } catch (e) {
      toast({ title: 'Could not place order', description: e.message, variant: 'destructive' });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={close}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glassmorphism flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#C5A059]/20">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
                <h2 className="font-display text-xl text-[#F4F7F5]">{done ? 'Order Placed' : checkout ? 'Checkout' : t('yourCart')}</h2>
                {!done && !checkout && totalItems > 0 && (
                  <span className="px-2 py-0.5 bg-[#E67E22] text-white text-xs rounded-full font-bold">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={close}
                className="p-2 rounded-full hover:bg-[#C5A059]/10 text-[#F4F7F5]/60 hover:text-[#C5A059] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {done ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-[#051C1C]" />
                </motion.div>
                <h3 className="font-display text-2xl text-[#F4F7F5] mb-2">Thank You!</h3>
                <p className="text-[#F4F7F5]/60 mb-6">Your order has been placed. We'll contact you shortly to confirm.</p>
                <button onClick={close} className="px-8 py-3 rounded-full gold-gradient text-[#051C1C] font-semibold hover:shadow-lg transition-all">
                  Close
                </button>
              </div>
            ) : checkout ? (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <button onClick={() => setCheckout(false)} className="text-[#C5A059] text-sm flex items-center gap-1 mb-2">
                    <ChevronLeft className="w-4 h-4" /> Back to cart
                  </button>
                  <div>
                    <label className="block text-[#F4F7F5]/60 text-sm mb-2 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-[#0a1a1a] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] placeholder-[#F4F7F5]/30 focus:outline-none focus:border-[#C5A059]/60 text-sm" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-[#F4F7F5]/60 text-sm mb-2 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number *</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-[#0a1a1a] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] placeholder-[#F4F7F5]/30 focus:outline-none focus:border-[#C5A059]/60 text-sm" placeholder="+880..." />
                  </div>
                  <div>
                    <label className="block text-[#F4F7F5]/60 text-sm mb-2 flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Order Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['delivery', 'pickup', 'dinein'].map(opt => (
                        <button key={opt} onClick={() => setForm({ ...form, orderType: opt })} className={`py-2.5 rounded-lg text-xs font-medium capitalize transition-all ${form.orderType === opt ? 'gold-gradient text-[#051C1C]' : 'bg-[#0a1a1a] border border-[#C5A059]/15 text-[#F4F7F5]/60'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  {form.orderType === 'delivery' && (
                    <div>
                      <label className="block text-[#F4F7F5]/60 text-sm mb-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Delivery Address</label>
                      <textarea rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-3 bg-[#0a1a1a] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] placeholder-[#F4F7F5]/30 focus:outline-none focus:border-[#C5A059]/60 text-sm resize-none" placeholder="Your delivery address" />
                    </div>
                  )}
                  <div>
                    <label className="block text-[#F4F7F5]/60 text-sm mb-2">Notes (optional)</label>
                    <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-3 bg-[#0a1a1a] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] placeholder-[#F4F7F5]/30 focus:outline-none focus:border-[#C5A059]/60 text-sm resize-none" placeholder="Any special instructions" />
                  </div>
                </div>
                <div className="p-6 border-t border-[#C5A059]/20 space-y-3">
                  <div className="flex justify-between font-semibold text-[#C5A059]">
                    <span>{t('total')}</span>
                    <span>৳{total}</span>
                  </div>
                  <button onClick={placeOrder} disabled={placing} className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full gold-gradient text-[#051C1C] font-semibold hover:shadow-xl transition-all disabled:opacity-50">
                    {placing ? 'Placing Order...' : `Place Order — ৳${total}`}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                      <div className="w-20 h-20 rounded-full bg-[#C5A059]/10 flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-[#C5A059]/40" />
                      </div>
                      <p className="text-[#F4F7F5]/50 font-body">{t('emptyCart')}</p>
                      <Link
                        to="/menu"
                        onClick={() => setIsCartOpen(false)}
                        className="px-6 py-2.5 rounded-full gold-gradient text-[#051C1C] font-semibold text-sm hover:shadow-lg transition-all"
                      >
                        {t('menuLabel')}
                      </Link>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-4 p-3 rounded-xl bg-[#C5A059]/5 border border-[#C5A059]/10"
                      >
                        <img
                          src={item.image}
                          alt={language === 'bn' ? item.nameBn : item.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#F4F7F5] text-sm truncate">
                            {language === 'bn' ? item.nameBn : item.name}
                          </p>
                          <p className="text-[#C5A059] font-semibold text-sm">৳{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059]/20 transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-[#F4F7F5] font-medium text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059]/20 transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 rounded-full hover:bg-red-500/20 text-[#F4F7F5]/40 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                  <div className="p-6 border-t border-[#C5A059]/20 space-y-3">
                    <div className="flex justify-between text-sm text-[#F4F7F5]/70">
                      <span>{t('subtotal')}</span>
                      <span>৳{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#F4F7F5]/70">
                      <span>{t('delivery')}</span>
                      <span>৳{deliveryFee}</span>
                    </div>
                    <div className="horizon-line" />
                    <div className="flex justify-between font-semibold text-[#C5A059]">
                      <span>{t('total')}</span>
                      <span>৳{total}</span>
                    </div>
                    <button
                      onClick={() => setCheckout(true)}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full gold-gradient text-[#051C1C] font-semibold hover:shadow-xl hover:shadow-[#C5A059]/30 transition-all duration-300 hover:scale-[1.02]"
                    >
                      {t('checkout')}
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}