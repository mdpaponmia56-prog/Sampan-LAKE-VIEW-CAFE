import React, { useState, useEffect } from 'react';
import { ShoppingBag, CalendarCheck, Star, UtensilsCrossed, TrendingUp, Clock, CheckCircle, AlertCircle, ArrowUpRight, DollarSign, Users, Sparkles, RefreshCw } from 'lucide-react';
import { db } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export default function DashboardOverview({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const overview = await db.analytics.getOverview();
      setStats(overview);
    } catch (e) {
      console.error('Failed to load dashboard overview:', e);
      toast({ title: 'Could not load analytics', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
        <span className="text-sm text-[#F4F7F5]/50">Loading restaurant analytics...</span>
      </div>
    );
  }

  const cards = [
    { 
      label: 'Total Revenue', 
      value: `৳${(stats.totalRevenue || 0).toLocaleString()}`, 
      sub: 'Lifetime sales volume', 
      icon: DollarSign, 
      color: '#C5A059',
      tab: 'orders',
      highlight: true 
    },
    { 
      label: 'Customer Orders', 
      value: stats.ordersCount || 0, 
      sub: `${stats.pendingOrders || 0} pending processing`, 
      icon: ShoppingBag, 
      color: '#E67E22', 
      tab: 'orders',
      badge: stats.pendingOrders > 0 ? `${stats.pendingOrders} New` : null 
    },
    { 
      label: 'Table Bookings', 
      value: stats.reservationsCount || 0, 
      sub: `${stats.pendingReservations || 0} awaiting confirmation`, 
      icon: CalendarCheck, 
      color: '#4ECDC4', 
      tab: 'reservations',
      badge: stats.pendingReservations > 0 ? `${stats.pendingReservations} Pending` : null 
    },
    { 
      label: 'Guest Reviews', 
      value: stats.reviewsCount || 0, 
      sub: `${stats.pendingReviews || 0} awaiting moderation`, 
      icon: Star, 
      color: '#F4D35E', 
      tab: 'reviews',
      badge: stats.pendingReviews > 0 ? `${stats.pendingReviews} New` : null 
    },
    { 
      label: 'Menu Dishes', 
      value: stats.menuItemsCount || 0, 
      sub: 'Active catalog items', 
      icon: UtensilsCrossed, 
      color: '#6BCB77', 
      tab: 'menu' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs font-semibold uppercase tracking-wider">
              Live Backend Control
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-[#F4F7F5] mt-1.5">Executive Dashboard</h1>
          <p className="text-[#F4F7F5]/50 text-sm">Real-time overview of orders, pricing, reservations & dining operations</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#C5A059]/20 bg-[#0a1a1a] text-[#F4F7F5]/80 hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={() => onNavigate('menu')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gold-gradient text-[#051C1C] font-bold text-sm hover:shadow-lg transition-all"
          >
            <UtensilsCrossed className="w-4 h-4" /> Manage Menu & Prices
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => onNavigate(card.tab)}
              className={`text-left p-5 rounded-2xl bg-[#0a1a1a] border transition-all duration-300 relative group overflow-hidden ${
                card.highlight 
                  ? 'border-[#C5A059]/40 bg-gradient-to-br from-[#0d2626] to-[#0a1a1a] shadow-lg shadow-[#C5A059]/5' 
                  : 'border-[#C5A059]/15 hover:border-[#C5A059]/40 hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" 
                  style={{ backgroundColor: `${card.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                {card.badge ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#E67E22] text-white animate-pulse">
                    {card.badge}
                  </span>
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-[#F4F7F5]/20 group-hover:text-[#C5A059] transition-colors" />
                )}
              </div>
              <div className="font-display text-2xl md:text-3xl text-[#F4F7F5] font-bold">{card.value}</div>
              <div className="text-[#F4F7F5]/70 text-xs font-medium mt-1">{card.label}</div>
              <div className="text-[#C5A059] text-[11px] mt-1 truncate">{card.sub}</div>
            </button>
          );
        })}
      </div>

      {/* Two Column Layout: Top Dishes & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Dishes */}
        <div className="p-6 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/15">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-display text-lg text-[#F4F7F5]">Top Selling Creations</h2>
            </div>
            <button onClick={() => onNavigate('menu')} className="text-xs text-[#C5A059] hover:underline">
              Adjust Prices →
            </button>
          </div>

          <div className="space-y-3">
            {(stats.topDishes || []).length > 0 ? (
              stats.topDishes.map((dish, i) => (
                <div key={dish.name} className="flex items-center justify-between p-3 rounded-xl bg-[#051C1C] border border-[#C5A059]/10">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full gold-gradient text-[#051C1C] text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[#F4F7F5] text-sm font-medium truncate max-w-[200px] sm:max-w-xs">{dish.name}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#C5A059]/15 text-[#C5A059] text-xs font-semibold">
                    {dish.count} ordered
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-xs text-[#F4F7F5]/40">No sales history yet.</p>
            )}
          </div>
        </div>

        {/* Recent Orders Ticker */}
        <div className="p-6 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/15">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#E67E22]" />
              <h2 className="font-display text-lg text-[#F4F7F5]">Recent Customer Orders</h2>
            </div>
            <button onClick={() => onNavigate('orders')} className="text-xs text-[#C5A059] hover:underline">
              View All Orders →
            </button>
          </div>

          <div className="space-y-3">
            {(stats.recentOrders || []).length > 0 ? (
              stats.recentOrders.map(order => (
                <div 
                  key={order.id} 
                  onClick={() => onNavigate('orders')}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#051C1C] border border-[#C5A059]/10 hover:border-[#C5A059]/30 transition-all cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#F4F7F5] text-sm font-medium">{order.customerName}</span>
                      <span className="text-xs text-[#C5A059] font-mono font-bold">#{order.id}</span>
                    </div>
                    <div className="text-[11px] text-[#F4F7F5]/40 mt-0.5">
                      {order.items?.length || 0} items • {order.orderType} • {new Date(order.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#C5A059] font-bold text-sm">৳{order.total}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] rounded-full uppercase font-bold tracking-wider bg-yellow-500/20 text-yellow-400">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-xs text-[#F4F7F5]/40">No recent orders.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Control Banners */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0a1a1a] via-[#0d2626] to-[#0a1a1a] border border-[#C5A059]/20">
        <h3 className="font-display text-lg text-[#F4F7F5] mb-3">Quick Administrative Controls</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => onNavigate('menu')} 
            className="p-4 rounded-xl bg-[#051C1C]/80 border border-[#C5A059]/20 hover:border-[#C5A059] text-left transition-all group"
          >
            <div className="text-[#C5A059] font-semibold text-sm group-hover:translate-x-1 transition-transform">Control Dish Prices</div>
            <div className="text-[#F4F7F5]/50 text-xs mt-1">Instant Up/Down +/- ৳10, ৳50 buttons & discounts</div>
          </button>
          <button 
            onClick={() => onNavigate('orders')} 
            className="p-4 rounded-xl bg-[#051C1C]/80 border border-[#C5A059]/20 hover:border-[#C5A059] text-left transition-all group"
          >
            <div className="text-[#E67E22] font-semibold text-sm group-hover:translate-x-1 transition-transform">Process Kitchen Orders</div>
            <div className="text-[#F4F7F5]/50 text-xs mt-1">{stats.pendingOrders || 0} orders waiting in queue</div>
          </button>
          <button 
            onClick={() => onNavigate('reservations')} 
            className="p-4 rounded-xl bg-[#051C1C]/80 border border-[#C5A059]/20 hover:border-[#C5A059] text-left transition-all group"
          >
            <div className="text-[#4ECDC4] font-semibold text-sm group-hover:translate-x-1 transition-transform">Table Reservations</div>
            <div className="text-[#F4F7F5]/50 text-xs mt-1">{stats.pendingReservations || 0} table requests to confirm</div>
          </button>
          <button 
            onClick={() => onNavigate('reviews')} 
            className="p-4 rounded-xl bg-[#051C1C]/80 border border-[#C5A059]/20 hover:border-[#C5A059] text-left transition-all group"
          >
            <div className="text-[#F4D35E] font-semibold text-sm group-hover:translate-x-1 transition-transform">Review Moderation</div>
            <div className="text-[#F4F7F5]/50 text-xs mt-1">{stats.pendingReviews || 0} feedback reviews waiting approval</div>
          </button>
        </div>
      </div>
    </div>
  );
}