import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Search, ArrowUp, ArrowDown, Save, Eye, EyeOff, Sparkles, Flame, Percent, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { db } from '@/api/base44Client';
import { categoryMap } from '@/lib/translations';
import { useToast } from '@/components/ui/use-toast';

const emptyForm = {
  name: '',
  nameBn: '',
  category: 'chickenFry',
  price: 0,
  description: '',
  image: 'https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png',
  popular: false,
  chefPick: false,
  available: true
};

export default function MenuManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [editing, setEditing] = useState(null); // 'new' or item.id
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('all');
  const [bulkPercent, setBulkPercent] = useState('');
  const [bulkFixed, setBulkFixed] = useState('');
  const [inlineEditingId, setInlineEditingId] = useState(null);
  const [inlinePrice, setInlinePrice] = useState('');
  const { toast } = useToast();

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await db.entities.MenuItem.list();
      setItems(data);
    } catch (e) {
      console.error('Error loading menu items:', e);
      toast({ title: 'Error loading menu', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filtered = items.filter(i => {
    const q = search.toLowerCase();
    const matchesSearch = !search || 
      i.name?.toLowerCase().includes(q) || 
      i.nameBn?.toLowerCase().includes(q) || 
      i.description?.toLowerCase().includes(q);
    const matchesCategory = activeCategory === 'all' || i.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const openNew = () => {
    setEditing('new');
    setForm(emptyForm);
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({ ...emptyForm, ...item });
  };

  const handleSave = async () => {
    if (!form.name || !form.category || form.price == null) {
      toast({ title: 'Validation Error', description: 'Dish name, category, and price are mandatory.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      if (editing === 'new') {
        const created = await db.entities.MenuItem.create({ ...form, price: Number(form.price) });
        setItems(prev => [created, ...prev]);
        toast({ title: 'Dish Added', description: `"${created.name}" was added to the menu.` });
      } else {
        const updated = await db.entities.MenuItem.update(editing, { ...form, price: Number(form.price) });
        setItems(prev => prev.map(i => i.id === editing ? updated : i));
        toast({ title: 'Dish Updated', description: `Changes to "${updated.name}" have been saved.` });
      }
      setEditing(null);
    } catch (e) {
      toast({ title: 'Save Failed', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Are you sure you want to permanently delete "${item.name}"?`)) return;
    try {
      await db.entities.MenuItem.delete(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      toast({ title: 'Dish Deleted', description: `"${item.name}" has been removed.` });
    } catch (e) {
      toast({ title: 'Delete Failed', description: e.message, variant: 'destructive' });
    }
  };

  // Up/Down price adjustment
  const handleAdjustPrice = async (item, delta) => {
    const newPrice = Math.max(0, (item.price || 0) + delta);
    try {
      await db.entities.MenuItem.adjustPrice(item.id, { price: newPrice });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, price: newPrice } : i));
      toast({ 
        title: delta > 0 ? `Price Increased (+৳${delta})` : `Price Decreased (-৳${Math.abs(delta)})`,
        description: `${item.name} is now ৳${newPrice}` 
      });
    } catch (e) {
      toast({ title: 'Price Update Failed', description: e.message, variant: 'destructive' });
    }
  };

  // Inline custom price submit
  const handleInlinePriceSubmit = async (item) => {
    const val = Number(inlinePrice);
    if (isNaN(val) || val < 0) {
      setInlineEditingId(null);
      return;
    }
    try {
      await db.entities.MenuItem.adjustPrice(item.id, { price: val });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, price: val } : i));
      toast({ title: 'Price Updated', description: `${item.name} is now ৳${val}` });
    } catch (e) {
      toast({ title: 'Price Update Failed', description: e.message, variant: 'destructive' });
    } finally {
      setInlineEditingId(null);
    }
  };

  // Toggle availability
  const handleToggleAvailable = async (item) => {
    const nextState = !item.available;
    try {
      await db.entities.MenuItem.update(item.id, { available: nextState });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, available: nextState } : i));
      toast({ 
        title: nextState ? 'Dish Available' : 'Dish Hidden from Customer Menu',
        description: `${item.name} status updated.` 
      });
    } catch (e) {
      toast({ title: 'Update Failed', description: e.message, variant: 'destructive' });
    }
  };

  // Bulk Price Adjustment
  const handleBulkPrice = async () => {
    if (!bulkPercent && !bulkFixed) {
      toast({ title: 'Please enter a percentage or fixed amount', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        category: bulkCategory,
        deltaPercent: bulkPercent ? Number(bulkPercent) : undefined,
        deltaFixed: bulkFixed ? Number(bulkFixed) : undefined
      };
      const res = await db.entities.MenuItem.bulkPrice(payload);
      toast({ 
        title: 'Bulk Price Update Applied', 
        description: `Successfully adjusted prices for ${res.updatedCount || 'selected'} items.` 
      });
      setBulkModalOpen(false);
      setBulkPercent('');
      setBulkFixed('');
      loadItems();
    } catch (e) {
      toast({ title: 'Bulk Update Failed', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs font-semibold uppercase tracking-wider">
              Menu & Pricing Engine
            </span>
            <span className="text-xs text-[#F4F7F5]/40">{items.length} dishes in catalog</span>
          </div>
          <h1 className="font-display text-3xl text-[#F4F7F5] mt-1">Menu Management & Price Control</h1>
          <p className="text-[#F4F7F5]/50 text-sm">Control dish prices up/down in real-time, toggle stock, and create gourmet dishes</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setBulkModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#C5A059]/30 bg-[#0a1a1a] text-[#C5A059] hover:bg-[#C5A059]/10 transition-all text-sm font-semibold"
          >
            <Percent className="w-4 h-4" /> Bulk Price Adjust
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gold-gradient text-[#051C1C] font-bold text-sm hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Dish
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/15 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/60" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search dishes by name (English or বাংলা)..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] placeholder-[#F4F7F5]/30 focus:outline-none focus:border-[#C5A059] text-sm"
            />
          </div>
          <button 
            onClick={loadItems} 
            className="px-3.5 py-2.5 rounded-xl border border-[#C5A059]/20 bg-[#051C1C] text-[#F4F7F5]/60 hover:text-[#C5A059] transition-all"
            title="Refresh Dishes"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 ${
              activeCategory === 'all'
                ? 'gold-gradient text-[#051C1C]'
                : 'bg-[#051C1C] text-[#F4F7F5]/60 border border-[#C5A059]/15 hover:border-[#C5A059]/40'
            }`}
          >
            All Categories ({items.length})
          </button>
          {Object.entries(categoryMap).map(([k, v]) => {
            const count = items.filter(i => i.category === k).length;
            return (
              <button
                key={k}
                onClick={() => setActiveCategory(k)}
                className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                  activeCategory === k
                    ? 'gold-gradient text-[#051C1C]'
                    : 'bg-[#051C1C] text-[#F4F7F5]/60 border border-[#C5A059]/15 hover:border-[#C5A059]/40'
                }`}
              >
                <span>{v.icon}</span>
                <span>{v.en}</span>
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dish Cards List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
          <span className="text-xs text-[#F4F7F5]/50">Loading menu dishes...</span>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(item => (
            <div 
              key={item.id} 
              className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0a1a1a] border transition-all ${
                item.available ? 'border-[#C5A059]/15 hover:border-[#C5A059]/40' : 'border-red-500/20 opacity-60 bg-[#081212]'
              }`}
            >
              {/* Left Info */}
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#C5A059]/20" 
                  onError={(e) => {
                    e.currentTarget.src = 'https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png';
                  }}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[#F4F7F5] font-semibold text-sm truncate">{item.name}</span>
                    {item.nameBn && (
                      <span className="text-[#F4F7F5]/40 text-xs font-normal">({item.nameBn})</span>
                    )}
                    {!item.available && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-full border border-red-500/30">
                        OUT OF STOCK
                      </span>
                    )}
                    {item.popular && (
                      <span className="px-2 py-0.5 bg-[#E67E22]/20 text-[#E67E22] text-[10px] font-bold rounded-full flex items-center gap-1 border border-[#E67E22]/30">
                        <Flame className="w-2.5 h-2.5" /> Popular
                      </span>
                    )}
                    {item.chefPick && (
                      <span className="px-2 py-0.5 bg-[#C5A059]/20 text-[#C5A059] text-[10px] font-bold rounded-full flex items-center gap-1 border border-[#C5A059]/30">
                        <Sparkles className="w-2.5 h-2.5" /> Chef's Pick
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#F4F7F5]/40 mt-1">
                    <span className="text-[#C5A059]">{categoryMap[item.category]?.icon} {categoryMap[item.category]?.en || item.category}</span>
                    {item.description && <span>• {item.description}</span>}
                  </div>
                </div>
              </div>

              {/* Right Controls: Price Up/Down & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#C5A059]/10">
                {/* Price Controller */}
                <div className="flex items-center gap-1 bg-[#051C1C] p-1 rounded-xl border border-[#C5A059]/20">
                  {/* -50 button */}
                  <button 
                    onClick={() => handleAdjustPrice(item, -50)} 
                    className="px-2 py-1.5 rounded-lg text-[11px] font-bold text-red-400 hover:bg-red-500/10 transition-all" 
                    title="Decrease ৳50"
                  >
                    -50
                  </button>
                  {/* -10 button */}
                  <button 
                    onClick={() => handleAdjustPrice(item, -10)} 
                    className="w-7 h-7 rounded-lg border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/20 flex items-center justify-center transition-all" 
                    title="Decrease ৳10"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Price display / inline edit */}
                  <div className="w-24 text-center px-1">
                    {inlineEditingId === item.id ? (
                      <input
                        type="number"
                        autoFocus
                        value={inlinePrice}
                        onChange={e => setInlinePrice(e.target.value)}
                        onBlur={() => handleInlinePriceSubmit(item)}
                        onKeyDown={e => { if (e.key === 'Enter') handleInlinePriceSubmit(item); if (e.key === 'Escape') setInlineEditingId(null); }}
                        className="w-full px-1 py-0.5 bg-[#0a1a1a] border border-[#C5A059] rounded text-center text-[#C5A059] font-bold text-sm focus:outline-none"
                      />
                    ) : (
                      <div 
                        onClick={() => { setInlineEditingId(item.id); setInlinePrice(item.price); }}
                        className="cursor-pointer group flex flex-col items-center justify-center"
                        title="Click to type custom price"
                      >
                        <span className="text-[#C5A059] font-bold text-base leading-tight group-hover:underline">
                          ৳{item.price}
                        </span>
                        <span className="text-[9px] text-[#F4F7F5]/30">Edit</span>
                      </div>
                    )}
                  </div>

                  {/* +10 button */}
                  <button 
                    onClick={() => handleAdjustPrice(item, 10)} 
                    className="w-7 h-7 rounded-lg border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/20 flex items-center justify-center transition-all" 
                    title="Increase ৳10"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  {/* +50 button */}
                  <button 
                    onClick={() => handleAdjustPrice(item, 50)} 
                    className="px-2 py-1.5 rounded-lg text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/10 transition-all" 
                    title="Increase ৳50"
                  >
                    +50
                  </button>
                </div>

                {/* Stock Visibility Toggle */}
                <button
                  onClick={() => handleToggleAvailable(item)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                    item.available 
                      ? 'border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10' 
                      : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                  }`}
                  title={item.available ? 'Mark as Out of Stock' : 'Mark as Available'}
                >
                  {item.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Edit & Delete Buttons */}
                <button 
                  onClick={() => openEdit(item)} 
                  className="w-9 h-9 rounded-xl border border-[#C5A059]/20 text-[#F4F7F5]/70 hover:text-[#C5A059] hover:bg-[#C5A059]/10 flex items-center justify-center transition-all"
                  title="Edit Dish Details"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(item)} 
                  className="w-9 h-9 rounded-xl border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all"
                  title="Delete Dish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#F4F7F5]/40 bg-[#0a1a1a] rounded-2xl border border-[#C5A059]/10">
              <p>No dishes found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Edit / Add Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-[#0a1a1a] border border-[#C5A059]/30 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[#C5A059]/15 sticky top-0 bg-[#0a1a1a] z-10">
              <div>
                <h2 className="font-display text-2xl text-[#F4F7F5]">{editing === 'new' ? 'Add New Dish' : 'Edit Dish Details'}</h2>
                <p className="text-xs text-[#F4F7F5]/40">Manage recipe details, pricing, and visual appearance</p>
              </div>
              <button onClick={() => setEditing(null)} className="text-[#F4F7F5]/60 hover:text-[#C5A059]">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Name (English) *</label>
                  <input 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                    placeholder="e.g. Crispy Cheese Burger"
                    className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]" 
                  />
                </div>
                <div>
                  <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Name (Bengali)</label>
                  <input 
                    value={form.nameBn} 
                    onChange={e => setForm({ ...form, nameBn: e.target.value })} 
                    placeholder="যেমন: ক্রিসপি চিজ বার্গার"
                    className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Category *</label>
                  <select 
                    value={form.category} 
                    onChange={e => setForm({ ...form, category: e.target.value })} 
                    className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                  >
                    {Object.entries(categoryMap).map(([k, v]) => (
                      <option key={k} value={k}>{v.icon} {v.en}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Price (৳) *</label>
                  <input 
                    type="number" 
                    value={form.price} 
                    onChange={e => setForm({ ...form, price: e.target.value === '' ? 0 : Number(e.target.value) })} 
                    className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Description</label>
                <textarea 
                  rows={2} 
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })} 
                  placeholder="Ingredients or brief taste description"
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059] resize-none" 
                />
              </div>

              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Image URL</label>
                <input 
                  value={form.image} 
                  onChange={e => setForm({ ...form, image: e.target.value })} 
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]" 
                />
                {form.image && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-[#051C1C] rounded-xl border border-[#C5A059]/15">
                    <img src={form.image} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                    <span className="text-xs text-[#F4F7F5]/40">Live Image Preview</span>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm text-[#F4F7F5]/80 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={form.available} 
                    onChange={e => setForm({ ...form, available: e.target.checked })} 
                    className="w-4 h-4 accent-[#C5A059]" 
                  /> In Stock (Available)
                </label>
                <label className="flex items-center gap-2 text-sm text-[#F4F7F5]/80 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={form.popular} 
                    onChange={e => setForm({ ...form, popular: e.target.checked })} 
                    className="w-4 h-4 accent-[#E67E22]" 
                  /> Popular Badge
                </label>
                <label className="flex items-center gap-2 text-sm text-[#F4F7F5]/80 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={form.chefPick} 
                    onChange={e => setForm({ ...form, chefPick: e.target.checked })} 
                    className="w-4 h-4 accent-[#C5A059]" 
                  /> Chef's Pick
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-[#C5A059]/15 flex gap-3 sticky bottom-0 bg-[#0a1a1a]">
              <button 
                onClick={() => setEditing(null)} 
                className="flex-1 py-3 rounded-xl border border-[#C5A059]/30 text-[#C5A059] font-medium hover:bg-[#C5A059]/10 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving} 
                className="flex-1 py-3 rounded-xl gold-gradient text-[#051C1C] font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Dish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Price Adjustment Modal */}
      {bulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setBulkModalOpen(false)}>
          <div className="bg-[#0a1a1a] border border-[#C5A059]/30 rounded-3xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[#C5A059]/15">
              <div>
                <h2 className="font-display text-xl text-[#F4F7F5] flex items-center gap-2">
                  <Percent className="w-5 h-5 text-[#C5A059]" /> Bulk Price Adjustment
                </h2>
                <p className="text-xs text-[#F4F7F5]/40">Apply discount or price increase across dishes</p>
              </div>
              <button onClick={() => setBulkModalOpen(false)} className="text-[#F4F7F5]/60 hover:text-[#C5A059]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Target Category</label>
                <select 
                  value={bulkCategory} 
                  onChange={e => setBulkCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="all">Entire Menu (All Categories)</option>
                  {Object.entries(categoryMap).map(([k, v]) => (
                    <option key={k} value={k}>{v.icon} {v.en}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">
                  Percentage Adjustment (%) <span className="text-xs font-normal text-[#F4F7F5]/40">(e.g. +10 for hike or -15 for discount)</span>
                </label>
                <input 
                  type="number"
                  placeholder="e.g. 10 or -10"
                  value={bulkPercent}
                  onChange={e => { setBulkPercent(e.target.value); setBulkFixed(''); }}
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="text-center text-xs text-[#F4F7F5]/30 uppercase tracking-widest">— OR —</div>

              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">
                  Fixed Amount Delta (৳) <span className="text-xs font-normal text-[#F4F7F5]/40">(e.g. +20 or -30)</span>
                </label>
                <input 
                  type="number"
                  placeholder="e.g. 20 or -20"
                  value={bulkFixed}
                  onChange={e => { setBulkFixed(e.target.value); setBulkPercent(''); }}
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="p-6 border-t border-[#C5A059]/15 flex gap-3">
              <button 
                onClick={() => setBulkModalOpen(false)} 
                className="flex-1 py-3 rounded-xl border border-[#C5A059]/30 text-[#C5A059] font-medium hover:bg-[#C5A059]/10 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleBulkPrice} 
                disabled={saving} 
                className="flex-1 py-3 rounded-xl gold-gradient text-[#051C1C] font-bold disabled:opacity-50 hover:shadow-lg transition-all"
              >
                {saving ? 'Applying...' : 'Apply Price Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}