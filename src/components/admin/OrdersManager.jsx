import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Package, Check, Printer, X, Search, RefreshCw, AlertCircle, ShoppingBag, User, Mail } from 'lucide-react';
import { db } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

const STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  preparing: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  ready: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/40',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/40',
};

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); // for invoice modal
  const { toast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await db.entities.Order.list();
      setOrders(data);
    } catch (e) {
      console.error('Error loading orders:', e);
      toast({ title: 'Error loading orders', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (order, status) => {
    try {
      await db.entities.Order.update(order.id, { status });
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status } : o));
      toast({ title: `Order Status Updated`, description: `Order #${order.id} is now ${status}` });
    } catch (e) {
      toast({ title: 'Update Failed', description: e.message, variant: 'destructive' });
    }
  };

  const filtered = orders.filter(o => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const q = search.toLowerCase();
    const matchesSearch = !search || 
      o.id?.toLowerCase().includes(q) || 
      o.customerName?.toLowerCase().includes(q) || 
      o.customerPhone?.toLowerCase().includes(q) || 
      o.address?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E67E22]/20 text-[#E67E22] text-xs font-semibold uppercase tracking-wider">
              Live Orders Pipeline
            </span>
            <span className="text-xs text-[#F4F7F5]/40">{orders.length} total orders</span>
          </div>
          <h1 className="font-display text-3xl text-[#F4F7F5] mt-1">Customer Orders Management</h1>
          <p className="text-[#F4F7F5]/50 text-sm">Review incoming orders, change kitchen progress, and generate official customer receipts</p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#C5A059]/20 bg-[#0a1a1a] text-[#F4F7F5]/80 hover:text-[#C5A059] transition-all text-sm self-start"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Orders
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/15 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/60" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, address, or order ID (#ord-1001)..."
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
            All Orders ({orders.length})
          </button>
          {STATUSES.map(s => {
            const count = orders.filter(o => o.status === s).length;
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

      {/* Orders List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
          <span className="text-xs text-[#F4F7F5]/50">Loading orders...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div 
              key={order.id} 
              className="p-5 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/15 hover:border-[#C5A059]/30 transition-all space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#C5A059]/10 pb-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-display text-lg text-[#F4F7F5] font-bold">{order.customerName}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#C5A059]">
                      #{order.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs border uppercase font-bold tracking-wider ${STATUS_COLORS[order.status] || ''}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#F4F7F5]/50 mt-1.5">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#C5A059]" /> {order.customerPhone}</span>
                    {order.customerEmail && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#C5A059]" /> {order.customerEmail}</span>}
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#C5A059]" /> {new Date(order.created_date).toLocaleString()}</span>
                    <span className="flex items-center gap-1 font-semibold uppercase text-[#C5A059]"><Package className="w-3.5 h-3.5" /> {order.orderType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[#C5A059] font-bold text-2xl font-display">৳{order.total}</div>
                    <div className="text-[11px] text-[#F4F7F5]/40">{order.items?.length || 0} dishes • {order.paymentMethod || 'Cash'}</div>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2.5 rounded-xl border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10 transition-all text-xs font-semibold flex items-center gap-1.5"
                    title="View & Print Receipt"
                  >
                    <Printer className="w-4 h-4" /> Receipt
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="p-3.5 rounded-xl bg-[#051C1C] border border-[#C5A059]/10 space-y-2">
                <div className="text-xs font-semibold text-[#F4F7F5]/60 uppercase tracking-wider mb-1">Order Items Breakdown</div>
                {order.items?.map((it, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-[#F4F7F5]/80 py-1 border-b border-[#C5A059]/5 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#C5A059]/15 text-[#C5A059] font-bold flex items-center justify-center text-[10px]">
                        {it.quantity}×
                      </span>
                      <span className="font-medium text-[#F4F7F5]">{it.name}</span>
                    </div>
                    <span className="text-[#C5A059] font-semibold">৳{(it.price || 0) * (it.quantity || 1)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 text-xs text-[#F4F7F5]/50 border-t border-[#C5A059]/15">
                  <span>Subtotal: ৳{order.subtotal || 0} • Delivery Fee: ৳{order.deliveryFee || 0}</span>
                  <span className="text-[#C5A059] font-bold">Total: ৳{order.total}</span>
                </div>
              </div>

              {/* Address and Notes */}
              {order.address && (
                <div className="flex items-start gap-2 text-xs text-[#F4F7F5]/70">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                  <span><strong>Delivery Address:</strong> {order.address}</span>
                </div>
              )}
              {order.notes && (
                <div className="p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-200">
                  <strong>Special Note:</strong> {order.notes}
                </div>
              )}

              {/* Status Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-[#F4F7F5]/50 mr-1">Update Status:</span>
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(order, s)}
                    disabled={order.status === s}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                      order.status === s
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
              <p>No orders found matching this filter.</p>
            </div>
          )}
        </div>
      )}

      {/* Official Receipt / Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-[#0a1a1a] border border-[#C5A059]/30 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://media.db.com/images/public/user_6a708fb2b9806dc02d51a56a/e310c872b_497503132_122105925272862296_7443416267114685548_n.jpg"
                  alt="Logo"
                  className="w-10 h-10 rounded-full border border-[#C5A059]"
                />
                <div>
                  <h3 className="font-display text-lg text-gradient-gold">Sampan Lake View Cafe</h3>
                  <p className="text-[11px] text-[#F4F7F5]/40">Official Customer Invoice</p>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-[#F4F7F5]/60 hover:text-[#C5A059]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[#F4F7F5]/70">
                <span>Invoice No: <strong className="text-[#C5A059]">#{selectedOrder.id}</strong></span>
                <span>Date: <strong>{new Date(selectedOrder.created_date).toLocaleString()}</strong></span>
              </div>
              <div className="p-3 bg-[#051C1C] rounded-xl space-y-1">
                <p className="text-[#F4F7F5] font-semibold">Customer: {selectedOrder.customerName}</p>
                <p className="text-[#F4F7F5]/60">Phone: {selectedOrder.customerPhone}</p>
                {selectedOrder.address && <p className="text-[#F4F7F5]/60">Address: {selectedOrder.address}</p>}
                <p className="text-[#F4F7F5]/60">Type: <span className="uppercase font-bold text-[#C5A059]">{selectedOrder.orderType}</span></p>
              </div>

              <div className="border border-[#C5A059]/15 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 bg-[#051C1C] p-2 text-[#C5A059] font-bold text-[11px]">
                  <span className="col-span-6">Dish</span>
                  <span className="col-span-2 text-center">Qty</span>
                  <span className="col-span-4 text-right">Amount</span>
                </div>
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-12 p-2 border-t border-[#C5A059]/10 text-[#F4F7F5]/80">
                    <span className="col-span-6 font-medium">{it.name}</span>
                    <span className="col-span-2 text-center">{it.quantity}</span>
                    <span className="col-span-4 text-right">৳{(it.price || 0) * (it.quantity || 1)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-2 border-t border-[#C5A059]/20 text-right">
                <div className="text-[#F4F7F5]/60">Subtotal: ৳{selectedOrder.subtotal || 0}</div>
                <div className="text-[#F4F7F5]/60">Delivery Fee: ৳{selectedOrder.deliveryFee || 0}</div>
                <div className="text-base font-bold text-[#C5A059]">Grand Total: ৳{selectedOrder.total}</div>
                <div className="text-[11px] text-[#F4F7F5]/40 mt-1">Payment Method: {selectedOrder.paymentMethod || 'Cash on Delivery'}</div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="flex-1 py-2.5 rounded-xl border border-[#C5A059]/30 text-[#C5A059] font-semibold text-xs"
              >
                Close
              </button>
              <button 
                onClick={handlePrint} 
                className="flex-1 py-2.5 rounded-xl gold-gradient text-[#051C1C] font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}