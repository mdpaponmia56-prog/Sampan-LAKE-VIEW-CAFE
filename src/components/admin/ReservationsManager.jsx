import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Clock, Users, MessageSquare, Check, X, RefreshCw, Search, MessageCircle, MapPin } from 'lucide-react';
import { db } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  confirmed: 'bg-green-500/20 text-green-400 border-green-500/40',
  completed: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/40',
};

export default function ReservationsManager() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingTableId, setEditingTableId] = useState(null);
  const [tableValue, setTableValue] = useState('');
  const { toast } = useToast();

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await db.entities.Reservation.list();
      setReservations(data);
    } catch (e) {
      console.error('Error loading reservations:', e);
      toast({ title: 'Error loading bookings', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const updateStatus = async (res, status) => {
    try {
      await db.entities.Reservation.update(res.id, { status });
      setReservations(prev => prev.map(r => r.id === res.id ? { ...r, status } : r));
      toast({ title: `Reservation Updated`, description: `${res.name}'s booking is now marked as ${status}` });
    } catch (e) {
      toast({ title: 'Update Failed', description: e.message, variant: 'destructive' });
    }
  };

  const handleAssignTable = async (res) => {
    try {
      await db.entities.Reservation.update(res.id, { tableNumber: tableValue || 'Auto-Assigned' });
      setReservations(prev => prev.map(r => r.id === res.id ? { ...r, tableNumber: tableValue } : r));
      toast({ title: 'Table Assigned', description: `Assigned ${tableValue} to ${res.name}` });
    } catch (e) {
      toast({ title: 'Assignment Failed', description: e.message, variant: 'destructive' });
    } finally {
      setEditingTableId(null);
    }
  };

  const filtered = reservations.filter(r => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const q = search.toLowerCase();
    const matchesSearch = !search ||
      r.name?.toLowerCase().includes(q) ||
      r.phone?.toLowerCase().includes(q) ||
      r.date?.toLowerCase().includes(q) ||
      r.tableNumber?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#4ECDC4]/20 text-[#4ECDC4] text-xs font-semibold uppercase tracking-wider">
              Table Bookings & Reservations
            </span>
            <span className="text-xs text-[#F4F7F5]/40">{reservations.length} total reservations</span>
          </div>
          <h1 className="font-display text-3xl text-[#F4F7F5] mt-1">Lakeside Dining Reservations</h1>
          <p className="text-[#F4F7F5]/50 text-sm">Review table bookings, assign lakeview pavilions, and message guests directly via WhatsApp</p>
        </div>
        <button
          onClick={loadReservations}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#C5A059]/20 bg-[#0a1a1a] text-[#F4F7F5]/80 hover:text-[#C5A059] transition-all text-sm self-start"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Bookings
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/15 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/60" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by guest name, phone, date (YYYY-MM-DD), or table..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] placeholder-[#F4F7F5]/30 focus:outline-none focus:border-[#C5A059] text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              filter === 'all' ? 'gold-gradient text-[#051C1C]' : 'bg-[#051C1C] border border-[#C5A059]/20 text-[#F4F7F5]/60'
            }`}
          >
            All Bookings ({reservations.length})
          </button>
          {STATUSES.map(s => {
            const count = reservations.filter(r => r.status === s).length;
            return (
              <button 
                key={s} 
                onClick={() => setFilter(s)} 
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all shrink-0 flex items-center gap-1.5 ${
                  filter === s ? 'gold-gradient text-[#051C1C]' : 'bg-[#051C1C] border border-[#C5A059]/20 text-[#F4F7F5]/60'
                }`}
              >
                <span>{s}</span>
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
          <span className="text-xs text-[#F4F7F5]/50">Loading reservations...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(res => (
            <div 
              key={res.id} 
              className="p-5 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/15 hover:border-[#C5A059]/30 transition-all space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#C5A059]/10 pb-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-display text-lg text-[#F4F7F5] font-bold">{res.name}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#C5A059]">
                      #{res.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs border uppercase font-bold tracking-wider ${STATUS_COLORS[res.status] || ''}`}>
                      {res.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#F4F7F5]/60 mt-2">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#C5A059]" /> {res.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#C5A059]" /> {res.time}</span>
                    <span className="flex items-center gap-1.5 font-semibold text-[#C5A059]"><Users className="w-3.5 h-3.5" /> {res.guests} Guest(s)</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#C5A059]" /> {res.phone}</span>
                    {res.email && <span className="text-[#F4F7F5]/40">{res.email}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${res.phone.replace(/[^0-9]/g, '')}?text=Hello ${encodeURIComponent(res.name)}, this is Sampan Lake View Cafe regarding your table reservation for ${res.date} at ${res.time}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/30 transition-all text-xs font-bold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                  <a
                    href={`tel:${res.phone}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 hover:bg-[#C5A059]/25 transition-all text-xs font-bold"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                </div>
              </div>

              {/* Table Assignment & Special Requests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#051C1C] rounded-xl border border-[#C5A059]/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                    <span>Table / Seating: <strong className="text-[#C5A059]">{res.tableNumber || 'Unassigned'}</strong></span>
                  </div>
                  {editingTableId === res.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        value={tableValue}
                        onChange={e => setTableValue(e.target.value)}
                        placeholder="e.g. Table 5 (Lakefront)"
                        className="px-2 py-1 bg-[#0a1a1a] border border-[#C5A059] rounded text-xs text-[#F4F7F5] focus:outline-none"
                      />
                      <button onClick={() => handleAssignTable(res)} className="px-2 py-1 gold-gradient text-[#051C1C] rounded font-bold">Save</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setEditingTableId(res.id); setTableValue(res.tableNumber || ''); }}
                      className="text-[#C5A059] hover:underline"
                    >
                      Assign / Edit
                    </button>
                  )}
                </div>

                <div className="p-3 bg-[#051C1C] rounded-xl border border-[#C5A059]/10 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span className="truncate">
                    <strong>Special Requests:</strong> {res.requests || 'None specified'}
                  </span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-[#F4F7F5]/50 mr-1">Update Status:</span>
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(res, s)}
                    disabled={res.status === s}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                      res.status === s
                        ? `${STATUS_COLORS[s]} shadow-sm`
                        : 'bg-[#051C1C] text-[#F4F7F5]/60 border border-[#C5A059]/15 hover:border-[#C5A059]/50 hover:text-[#C5A059]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#F4F7F5]/40 bg-[#0a1a1a] rounded-2xl border border-[#C5A059]/10">
              <p>No reservations found matching this filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}