import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, RefreshCw, CheckCircle, Percent, DollarSign } from 'lucide-react';
import { db } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export default function PromosManager() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percent',
    discountValue: 10,
    minOrder: 400,
    maxDiscount: 200,
    isActive: true
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadPromos = async () => {
    setLoading(true);
    try {
      const data = await db.promos.list();
      setPromos(data);
    } catch (e) {
      console.error('Error loading promos:', e);
      toast({ title: 'Error loading coupons', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleCreatePromo = async () => {
    if (!form.code || !form.discountValue) {
      toast({ title: 'Validation Error', description: 'Coupon code and discount are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const created = await db.promos.create(form);
      setPromos(prev => [...prev, created]);
      toast({ title: 'Coupon Created', description: `Promo code ${created.code} is now active.` });
      setShowAddModal(false);
      setForm({ code: '', discountType: 'percent', discountValue: 10, minOrder: 400, maxDiscount: 200, isActive: true });
    } catch (e) {
      toast({ title: 'Failed to create promo', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E67E22]/20 text-[#E67E22] text-xs font-semibold uppercase tracking-wider">
              Marketing & Promotions
            </span>
            <span className="text-xs text-[#F4F7F5]/40">{promos.length} coupon codes</span>
          </div>
          <h1 className="font-display text-3xl text-[#F4F7F5] mt-1">Discount Coupons & Deals</h1>
          <p className="text-[#F4F7F5]/50 text-sm">Create percentage or flat discount promo codes for online ordering</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl gold-gradient text-[#051C1C] font-bold text-sm hover:shadow-lg transition-all self-start"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* Promos Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
          <span className="text-xs text-[#F4F7F5]/50">Loading coupons...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.map(p => (
            <div 
              key={p.id} 
              className="p-5 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/20 hover:border-[#C5A059]/40 transition-all space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="px-3 py-1 bg-[#C5A059]/15 border border-[#C5A059]/30 rounded-lg text-[#C5A059] font-mono font-bold text-base inline-block">
                    {p.code}
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Active Campaign
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl text-[#F4F7F5] font-bold">
                    {p.discountType === 'percent' ? `${p.discountValue}% OFF` : `৳${p.discountValue} OFF`}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#051C1C] rounded-xl text-xs space-y-1 text-[#F4F7F5]/70">
                <div className="flex justify-between">
                  <span>Minimum Order:</span>
                  <span className="font-semibold text-[#F4F7F5]">৳{p.minOrder || 0}</span>
                </div>
                {p.discountType === 'percent' && (
                  <div className="flex justify-between">
                    <span>Max Discount Limit:</span>
                    <span className="font-semibold text-[#F4F7F5]">৳{p.maxDiscount || 500}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Usage Count:</span>
                  <span className="font-semibold text-[#C5A059]">{p.usageCount || 0} times</span>
                </div>
              </div>
            </div>
          ))}

          {promos.length === 0 && (
            <div className="col-span-full text-center py-16 text-[#F4F7F5]/40 bg-[#0a1a1a] rounded-2xl border border-[#C5A059]/10">
              <p>No coupons currently configured.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#0a1a1a] border border-[#C5A059]/30 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#C5A059]/15 pb-4">
              <div>
                <h2 className="font-display text-xl text-[#F4F7F5]">Create Promotional Coupon</h2>
                <p className="text-xs text-[#F4F7F5]/40">Set discount rules and minimum order values</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-[#F4F7F5]/60 hover:text-[#C5A059]">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Coupon Code *</label>
                <input
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SAMPAN20"
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] font-mono text-sm uppercase focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={e => setForm({ ...form, discountType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Discount Value *</label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={e => setForm({ ...form, discountValue: e.target.value === '' ? 0 : Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Min Order (৳)</label>
                  <input
                    type="number"
                    value={form.minOrder}
                    onChange={e => setForm({ ...form, minOrder: e.target.value === '' ? 0 : Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Max Cap (৳)</label>
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={e => setForm({ ...form, maxDiscount: e.target.value === '' ? 0 : Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-[#C5A059]/15">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#C5A059]/30 text-[#C5A059] font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePromo}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl gold-gradient text-[#051C1C] font-bold text-xs disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Save Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
