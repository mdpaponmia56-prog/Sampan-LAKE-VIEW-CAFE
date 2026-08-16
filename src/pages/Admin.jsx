import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  CalendarCheck, 
  Star, 
  Users, 
  LogOut, 
  Menu as MenuIcon, 
  X, 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Tag, 
  Settings, 
  ExternalLink,
  ShieldAlert,
  Loader2,
  Database
} from 'lucide-react';
import { db } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';

import DashboardOverview from '@/components/admin/DashboardOverview';
import MenuManager from '@/components/admin/MenuManager';
import OrdersManager from '@/components/admin/OrdersManager';
import ReservationsManager from '@/components/admin/ReservationsManager';
import ReviewsManager from '@/components/admin/ReviewsManager';
import UsersManager from '@/components/admin/UsersManager';
import PromosManager from '@/components/admin/PromosManager';
import SettingsManager from '@/components/admin/SettingsManager';

const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'menu', label: 'Menu & Prices', icon: UtensilsCrossed },
  { key: 'orders', label: 'Orders', icon: ShoppingBag, badgeKey: 'orders' },
  { key: 'reservations', label: 'Reservations', icon: CalendarCheck, badgeKey: 'reservations' },
  { key: 'reviews', label: 'Reviews', icon: Star, badgeKey: 'reviews' },
  { key: 'users', label: 'Users & Staff', icon: Users },
  { key: 'promos', label: 'Promo Codes', icon: Tag },
  { key: 'settings', label: 'Settings & Security', icon: Settings },
];

export default function Admin() {
  const { user, setUser, isAuthenticated, setIsAuthenticated, logout, isLoadingAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [badgeCounts, setBadgeCounts] = useState({ orders: 0, reservations: 0, reviews: 0 });

  // Security Login Form States - Default blank for maximum security
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { toast } = useToast();

  // Load badge counts for sidebar
  const loadBadges = async () => {
    try {
      const overview = await db.analytics.getOverview();
      setBadgeCounts({
        orders: overview.pendingOrders || 0,
        reservations: overview.pendingReservations || 0,
        reviews: overview.pendingReviews || 0
      });
    } catch (e) {
      // ignore badge load fail
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadBadges();
      const interval = setInterval(loadBadges, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!identifier.trim() || !password) {
      setLoginError('Please enter both Admin User ID and Password.');
      return;
    }

    setLoginLoading(true);
    try {
      const loggedUser = await db.auth.adminLogin(identifier.trim(), password, rememberMe);
      if (loggedUser && loggedUser.role === 'admin') {
        setUser(loggedUser);
        setIsAuthenticated(true);
        toast({ 
          title: 'Security Clearance Granted', 
          description: `Welcome back, ${loggedUser.fullName || loggedUser.email}. Admin panel unlocked.` 
        });
      } else {
        throw new Error('Access denied. Administrator privileges required.');
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid administrator User ID or Password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setIdentifier('admin@sampan.com');
    setPassword('Admin@Sampan2026!');
    setLoginError('');
  };

  // Loading state
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#030f0f] flex flex-col items-center justify-center gap-3 text-[#F4F7F5]">
        <div className="w-10 h-10 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
        <span className="text-xs text-[#C5A059] tracking-widest uppercase">Verifying Security Access...</span>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 1: STRICT HIGH SECURITY ADMIN LOGIN GATEWAY
  // -------------------------------------------------------------
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#030f0f] text-[#F4F7F5] flex flex-col justify-between relative overflow-hidden selection:bg-[#C5A059] selection:text-[#051C1C]">
        {/* Ambient security aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <header className="p-6 flex items-center justify-between relative z-10 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <img
              src="https://media.db.com/images/public/user_6a708fb2b9806dc02d51a56a/e310c872b_497503132_122105925272862296_7443416267114685548_n.jpg"
              alt="Sampan Logo"
              className="w-10 h-10 rounded-full border border-[#C5A059]/60 object-cover"
            />
            <div>
              <span className="font-display text-lg text-gradient-gold">Sampan</span>
              <span className="text-[10px] text-[#C5A059]/70 tracking-widest block uppercase">Lake View Cafe</span>
            </div>
          </div>
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#F4F7F5]/60 hover:text-[#C5A059] transition-colors px-3.5 py-1.5 rounded-full border border-[#C5A059]/20 hover:border-[#C5A059]/50 bg-[#051C1C]"
          >
            <span>Customer Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </header>

        {/* Main Login Vault Card */}
        <main className="flex-1 flex items-center justify-center p-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-[#0a1a1a] border border-[#C5A059]/30 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-black/80 space-y-5"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto shadow-lg shadow-[#C5A059]/20 mb-2">
                <Lock className="w-8 h-8 text-[#051C1C]" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" /> High Security Portal
              </div>
              <h1 className="font-display text-2xl md:text-3xl text-[#F4F7F5]">Administrator Vault</h1>
              <p className="text-xs text-[#F4F7F5]/50">Enter authorized administrative credentials to access restaurant management</p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block">Authentication Denied</strong>
                  {loginError}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F4F7F5]/70 mb-1.5">
                  Admin User ID / Email
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="e.g. admin@sampan.com or admin"
                  className="w-full px-4 py-3 bg-[#051C1C] border border-[#C5A059]/25 rounded-xl text-[#F4F7F5] placeholder-[#F4F7F5]/30 text-sm focus:outline-none focus:border-[#C5A059] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F7F5]/70 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 pr-11 bg-[#051C1C] border border-[#C5A059]/25 rounded-xl text-[#F4F7F5] placeholder-[#F4F7F5]/30 text-sm focus:outline-none focus:border-[#C5A059] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F4F7F5]/40 hover:text-[#C5A059] transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#F4F7F5]/60 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#C5A059]"
                  />
                  Remember session
                </label>
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="text-[#C5A059] hover:underline font-semibold"
                >
                  Fill Demo Credentials
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-xl gold-gradient text-[#051C1C] font-bold text-sm hover:shadow-xl hover:shadow-[#C5A059]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Security Vault...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Unlock Admin Dashboard
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-[#C5A059]/10 text-center space-y-1">
              <div className="text-[11px] text-[#F4F7F5]/40 font-mono">
                SHA-256 HMAC Encrypted Vault • Auto-Backup Protected
              </div>
              <div className="text-[10px] text-[#F4F7F5]/30">
                Unauthorized access attempts are logged with client IP address.
              </div>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-xs text-[#F4F7F5]/30 relative z-10">
          © {new Date().getFullYear()} Sampan Lake View Cafe • Internal Management Portal
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: AUTHENTICATED ADMINISTRATOR WORKSPACE
  // -------------------------------------------------------------
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview onNavigate={setActiveTab} />;
      case 'menu': return <MenuManager />;
      case 'orders': return <OrdersManager />;
      case 'reservations': return <ReservationsManager />;
      case 'reviews': return <ReviewsManager />;
      case 'users': return <UsersManager />;
      case 'promos': return <PromosManager />;
      case 'settings': return <SettingsManager currentUser={user} onProfileUpdated={(u) => setUser(u)} />;
      default: return <DashboardOverview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#051C1C] text-[#F4F7F5] flex selection:bg-[#C5A059] selection:text-[#051C1C]">
      {/* Sidebar Navigation */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0a1a1a] border-r border-[#C5A059]/20 z-40 flex flex-col justify-between transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-[#C5A059]/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://media.db.com/images/public/user_6a708fb2b9806dc02d51a56a/e310c872b_497503132_122105925272862296_7443416267114685548_n.jpg"
                alt="Logo"
                className="w-10 h-10 rounded-full border border-[#C5A059] object-cover"
              />
              <div>
                <div className="font-display text-base text-gradient-gold font-bold">SAMPAN</div>
                <div className="text-[10px] text-[#C5A059]/80 uppercase tracking-widest font-semibold">Admin Panel</div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#F4F7F5]/60 hover:text-[#C5A059]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const badge = tab.badgeKey ? badgeCounts[tab.badgeKey] : 0;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'gold-gradient text-[#051C1C] font-bold shadow-md shadow-[#C5A059]/10'
                      : 'text-[#F4F7F5]/70 hover:bg-[#C5A059]/10 hover:text-[#C5A059]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#051C1C] text-[#C5A059]' : 'bg-[#E67E22] text-white'
                    }`}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Logout */}
        <div className="p-4 border-t border-[#C5A059]/15 space-y-3 bg-[#081414]">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center text-[#051C1C] font-bold text-xs shrink-0">
              {(user?.fullName || user?.email || 'A')[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#F4F7F5] truncate">{user?.fullName || 'Administrator'}</div>
              <div className="text-[10px] text-[#C5A059] truncate">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={() => logout(false)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-[#0a1a1a]/95 backdrop-blur-md border-b border-[#C5A059]/15 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#F4F7F5]/70 hover:text-[#C5A059]">
              <MenuIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-display text-[#C5A059] font-bold text-sm hidden sm:inline">Sampan Admin</span>
              <span className="text-[#F4F7F5]/30 text-xs hidden sm:inline">/</span>
              <span className="text-[#F4F7F5] font-semibold text-sm capitalize">
                {TABS.find(t => t.key === activeTab)?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C5A059]/25 text-xs text-[#C5A059] hover:bg-[#C5A059]/10 transition-all font-semibold"
            >
              <span>View Customer Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}