import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Shield, 
  Settings, 
  Store, 
  Clock, 
  Phone, 
  MapPin, 
  DollarSign, 
  Save, 
  Key, 
  AlertTriangle, 
  Activity, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  HardDrive, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { db } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export default function SettingsManager({ currentUser, onProfileUpdated }) {
  const [activeSubTab, setActiveSubTab] = useState('credentials');
  const [settings, setSettings] = useState({
    restaurantName: 'Sampan Lake View Cafe',
    tagline: 'A Symphony of Spice by the Water',
    phone: '+880 1923 784 149',
    email: 'sampanlakeviewcafe@gmail.com',
    address: 'Horinchala, Baimail, Ward No #12, Konabari, Gazipur City Corporation, Gazipur, Bangladesh',
    hours: '10:00 AM – 10:00 PM',
    deliveryFee: 50,
    enableOnlineOrders: true,
    enableReservations: true
  });
  const [securityLogs, setSecurityLogs] = useState([]);
  const [backupData, setBackupData] = useState({ backups: [], totalItems: {}, storageStatus: '' });
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoring, setRestoring] = useState(false);

  // Password / User ID change form
  const [credForm, setCredForm] = useState({
    newEmail: currentUser?.email || '',
    newUsername: currentUser?.username || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingCred, setSavingCred] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [sets, logs, bkp] = await Promise.all([
        db.settings.get().catch(() => null),
        db.settings.getSecurityLogs().catch(() => []),
        db.backup.list().catch(() => ({ backups: [] }))
      ]);
      if (sets) setSettings(sets);
      if (logs) setSecurityLogs(logs);
      if (bkp) setBackupData(bkp);
      if (currentUser) {
        setCredForm(prev => ({
          ...prev,
          newEmail: currentUser.email || '',
          newUsername: currentUser.username || ''
        }));
      }
    } catch (e) {
      console.error('Error loading settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const updated = await db.settings.update(settings);
      setSettings(updated);
      toast({ title: 'Settings Saved', description: 'Restaurant configuration has been updated.' });
    } catch (e) {
      toast({ title: 'Save Failed', description: e.message, variant: 'destructive' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (credForm.newPassword) {
      if (credForm.newPassword.length < 8) {
        toast({ title: 'Password Too Short', description: 'New password must be at least 8 characters.', variant: 'destructive' });
        return;
      }
      if (credForm.newPassword !== credForm.confirmPassword) {
        toast({ title: 'Password Mismatch', description: 'New passwords do not match.', variant: 'destructive' });
        return;
      }
    }

    setSavingCred(true);
    try {
      const res = await db.auth.changePassword({
        currentPassword: credForm.currentPassword,
        newPassword: credForm.newPassword || undefined,
        newUsername: credForm.newUsername || undefined,
        newEmail: credForm.newEmail || undefined
      });
      toast({ title: 'Security Credentials Updated', description: 'Your Admin ID and security credentials have been saved.' });
      setCredForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      if (onProfileUpdated && res.user) {
        onProfileUpdated(res.user);
      }
      loadData();
    } catch (e) {
      toast({ title: 'Update Failed', description: e.message, variant: 'destructive' });
    } finally {
      setSavingCred(false);
    }
  };

  const handleCreateBackup = async () => {
    setCreatingBackup(true);
    try {
      const res = await db.backup.create('ADMIN_MANUAL');
      toast({ title: 'Backup Created', description: `Snapshot saved: ${res.filename}` });
      loadData();
    } catch (e) {
      toast({ title: 'Backup Failed', description: e.message, variant: 'destructive' });
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      await db.backup.download();
      toast({ title: 'Database Exported', description: 'JSON backup downloaded to your computer.' });
    } catch (e) {
      toast({ title: 'Download Failed', description: e.message, variant: 'destructive' });
    }
  };

  const handleRestoreBackup = async (filename) => {
    if (!confirm(`Are you sure you want to restore the database to the snapshot "${filename}"? A safety backup will be created first.`)) {
      return;
    }
    setRestoring(true);
    try {
      await db.backup.restore(filename);
      toast({ title: 'Database Restored', description: `Successfully rolled back to ${filename}` });
      loadData();
    } catch (e) {
      toast({ title: 'Restore Failed', description: e.message, variant: 'destructive' });
    } finally {
      setRestoring(false);
    }
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const json = JSON.parse(evt.target?.result);
        if (!confirm('Import this database backup file? All current collections will be restored to this file.')) return;
        await db.backup.import(json);
        toast({ title: 'Import Successful', description: 'Database restored from uploaded JSON file.' });
        loadData();
      } catch (err) {
        toast({ title: 'Import Error', description: 'Invalid JSON backup file.', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs font-semibold uppercase tracking-wider">
            System & Security Administration
          </span>
        </div>
        <h1 className="font-display text-3xl text-[#F4F7F5] mt-1">Security, Backups & Settings</h1>
        <p className="text-[#F4F7F5]/50 text-sm">Manage admin credentials, automated database backups & disaster recovery, and store parameters</p>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-[#C5A059]/15 pb-3 overflow-x-auto">
        {[
          { key: 'credentials', label: 'Admin Security Credentials', icon: Lock },
          { key: 'backup', label: 'Database Backup & Recovery', icon: Database },
          { key: 'restaurant', label: 'Restaurant Configuration', icon: Store },
          { key: 'logs', label: 'Security Audit Trail', icon: Activity },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeSubTab === tab.key
                  ? 'gold-gradient text-[#051C1C]'
                  : 'text-[#F4F7F5]/60 hover:text-[#C5A059] hover:bg-[#C5A059]/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtab 1: Admin Credentials */}
      {activeSubTab === 'credentials' && (
        <div className="max-w-xl p-6 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/20 space-y-6">
          <div>
            <h2 className="font-display text-xl text-[#F4F7F5] flex items-center gap-2">
              <Key className="w-5 h-5 text-[#C5A059]" /> Change Admin User ID & Password
            </h2>
            <p className="text-xs text-[#F4F7F5]/40 mt-1">
              Keep your administrator credentials protected with a strong, secret password.
            </p>
          </div>

          <form onSubmit={handleUpdateCredentials} className="space-y-4">
            <div className="p-3 bg-[#051C1C] rounded-xl border border-[#C5A059]/15 text-xs text-[#F4F7F5]/70 space-y-1">
              <div>Logged in as: <strong className="text-[#C5A059]">{currentUser?.email}</strong></div>
              <div>User ID (Username): <strong className="text-[#C5A059]">@{currentUser?.username || 'admin'}</strong></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Admin Email / User ID</label>
                <input
                  type="email"
                  value={credForm.newEmail}
                  onChange={e => setCredForm({ ...credForm, newEmail: e.target.value })}
                  placeholder="admin@sampan.com"
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Username Alias</label>
                <input
                  value={credForm.newUsername}
                  onChange={e => setCredForm({ ...credForm, newUsername: e.target.value })}
                  placeholder="admin"
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Current Password *</label>
              <input
                type="password"
                required
                value={credForm.currentPassword}
                onChange={e => setCredForm({ ...credForm, currentPassword: e.target.value })}
                placeholder="Enter current password to verify identity"
                className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#C5A059]/10">
              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">New Password</label>
                <input
                  type="password"
                  value={credForm.newPassword}
                  onChange={e => setCredForm({ ...credForm, newPassword: e.target.value })}
                  placeholder="At least 8 characters"
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={credForm.confirmPassword}
                  onChange={e => setCredForm({ ...credForm, confirmPassword: e.target.value })}
                  placeholder="Re-type new password"
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingCred}
              className="w-full py-3 rounded-xl gold-gradient text-[#051C1C] font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> {savingCred ? 'Updating Credentials...' : 'Save New Credentials'}
            </button>
          </form>
        </div>
      )}

      {/* Subtab 2: Database Backup & Recovery */}
      {activeSubTab === 'backup' && (
        <div className="space-y-6 max-w-4xl">
          {/* Status Banner */}
          <div className="p-5 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center text-[#051C1C] shrink-0 shadow-md">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg text-[#F4F7F5] font-bold">Live Data Vault & Disaster Shield</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Protected
                  </span>
                </div>
                <p className="text-xs text-[#F4F7F5]/50 mt-0.5">
                  Atomic crash-safe storage active • {backupData.backups?.length || 0} automated snapshots on disk
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={handleCreateBackup}
                disabled={creatingBackup}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl gold-gradient text-[#051C1C] font-bold text-xs hover:shadow-lg transition-all disabled:opacity-50"
              >
                <HardDrive className="w-4 h-4" />
                {creatingBackup ? 'Saving Snapshot...' : 'Create Instant Snapshot'}
              </button>

              <button
                onClick={handleDownloadBackup}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10 font-bold text-xs transition-all"
              >
                <Download className="w-4 h-4" /> Download Backup (.json)
              </button>

              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#C5A059]/40 text-[#F4F7F5]/80 hover:text-[#C5A059] hover:border-[#C5A059] font-bold text-xs transition-all cursor-pointer">
                <Upload className="w-4 h-4" /> Restore From File
                <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
              </label>
            </div>
          </div>

          {/* Backup Snapshots Table */}
          <div className="p-6 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg text-[#F4F7F5]">Saved Snapshot Restore Points</h3>
                <p className="text-xs text-[#F4F7F5]/40">Roll back to any snapshot instantly if data is corrupted or accidentally deleted</p>
              </div>
              <button onClick={loadData} className="text-xs text-[#C5A059] hover:underline">
                Refresh List
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {backupData.backups?.map((bkp, i) => (
                <div key={bkp.filename} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-[#051C1C] rounded-xl border border-[#C5A059]/10 hover:border-[#C5A059]/30 transition-all text-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <div>
                      <div className="font-mono text-[#F4F7F5] font-semibold">{bkp.filename}</div>
                      <div className="text-[10px] text-[#F4F7F5]/40">
                        {new Date(bkp.created).toLocaleString()} • {(bkp.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRestoreBackup(bkp.filename)}
                    disabled={restoring}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 font-semibold text-xs transition-all self-end sm:self-auto disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restore This Point
                  </button>
                </div>
              ))}

              {(!backupData.backups || backupData.backups.length === 0) && (
                <div className="text-center py-8 text-xs text-[#F4F7F5]/40">
                  No snapshots created yet. Click "Create Instant Snapshot" to save your first recovery point.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Restaurant Settings */}
      {activeSubTab === 'restaurant' && (
        <div className="max-w-2xl p-6 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/20 space-y-6">
          <div>
            <h2 className="font-display text-xl text-[#F4F7F5] flex items-center gap-2">
              <Store className="w-5 h-5 text-[#C5A059]" /> Restaurant Operational Parameters
            </h2>
            <p className="text-xs text-[#F4F7F5]/40 mt-1">Configure live store information, phone numbers, delivery fee, and opening hours</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Restaurant Brand Name</label>
                <input
                  value={settings.restaurantName}
                  onChange={e => setSettings({ ...settings, restaurantName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Tagline</label>
                <input
                  value={settings.tagline}
                  onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Contact Phone</label>
                <input
                  value={settings.phone}
                  onChange={e => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Contact Email</label>
                <input
                  value={settings.email}
                  onChange={e => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Lakeside Address</label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Operating Hours</label>
                <input
                  value={settings.hours}
                  onChange={e => setSettings({ ...settings, hours: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Delivery Fee (৳)</label>
                <input
                  type="number"
                  value={settings.deliveryFee}
                  onChange={e => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 text-sm text-[#F4F7F5]/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableOnlineOrders}
                  onChange={e => setSettings({ ...settings, enableOnlineOrders: e.target.checked })}
                  className="w-4 h-4 accent-[#C5A059]"
                /> Accept Online Food Orders
              </label>
              <label className="flex items-center gap-2 text-sm text-[#F4F7F5]/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableReservations}
                  onChange={e => setSettings({ ...settings, enableReservations: e.target.checked })}
                  className="w-4 h-4 accent-[#C5A059]"
                /> Accept Table Reservations
              </label>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="w-full py-3 rounded-xl gold-gradient text-[#051C1C] font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> {savingSettings ? 'Saving...' : 'Save Restaurant Settings'}
            </button>
          </div>
        </div>
      )}

      {/* Subtab 4: Security Logs */}
      {activeSubTab === 'logs' && (
        <div className="p-6 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-[#F4F7F5] flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#C5A059]" /> High Security Audit Log
              </h2>
              <p className="text-xs text-[#F4F7F5]/40 mt-1">Real-time log of administrative logins, price modifications, and security actions</p>
            </div>
            <button onClick={loadData} className="text-xs text-[#C5A059] hover:underline">
              Refresh Logs
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {securityLogs.map(log => (
              <div key={log.id} className="p-3 bg-[#051C1C] rounded-xl border border-[#C5A059]/10 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#C5A059]">{log.action}</span>
                  <span className="text-[#F4F7F5]/40">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-[#F4F7F5]/80">{log.details}</div>
                <div className="text-[#F4F7F5]/40 text-[10px]">User: {log.user} • IP: {log.ip}</div>
              </div>
            ))}
            {securityLogs.length === 0 && (
              <p className="text-center py-8 text-xs text-[#F4F7F5]/40">No audit logs recorded yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
