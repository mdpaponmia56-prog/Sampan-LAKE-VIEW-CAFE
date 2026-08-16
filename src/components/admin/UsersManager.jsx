import React, { useState, useEffect } from 'react';
import { Mail, Shield, UserPlus, Trash2, RefreshCw, Lock, User, Phone, CheckCircle } from 'lucide-react';
import { db } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    email: '',
    username: '',
    fullName: '',
    phone: '',
    role: 'admin',
    password: ''
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await db.users.list();
      setUsers(data);
    } catch (e) {
      console.error('Error loading users:', e);
      toast({ title: 'Error loading users', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!form.email || !form.password) {
      toast({ title: 'Validation Error', description: 'Email and password are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const created = await db.users.createUser(form);
      setUsers(prev => [...prev, created]);
      toast({ title: 'User Account Created', description: `Successfully created ${form.role}: ${form.email}` });
      setShowAddModal(false);
      setForm({ email: '', username: '', fullName: '', phone: '', role: 'admin', password: '' });
    } catch (e) {
      toast({ title: 'Creation Failed', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`Are you sure you want to permanently delete user "${user.email}"?`)) return;
    try {
      await db.users.deleteUser(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      toast({ title: 'User Deleted', description: `Account for ${user.email} removed.` });
    } catch (e) {
      toast({ title: 'Delete Failed', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs font-semibold uppercase tracking-wider">
              Staff & Role Access Control
            </span>
            <span className="text-xs text-[#F4F7F5]/40">{users.length} registered accounts</span>
          </div>
          <h1 className="font-display text-3xl text-[#F4F7F5] mt-1">Users & Administrative Staff</h1>
          <p className="text-[#F4F7F5]/50 text-sm">Create staff credentials, assign permissions, and manage user security</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl gold-gradient text-[#051C1C] font-bold text-sm hover:shadow-lg transition-all self-start"
        >
          <UserPlus className="w-4 h-4" /> Add Admin / Staff
        </button>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
          <span className="text-xs text-[#F4F7F5]/50">Loading users...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map(u => (
            <div 
              key={u.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/15 hover:border-[#C5A059]/30 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center text-[#051C1C] font-bold text-base shrink-0 shadow-md">
                  {(u.fullName || u.email || '?')[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#F4F7F5] font-bold text-sm">{u.fullName || 'Staff User'}</span>
                    <span className="text-xs font-mono text-[#C5A059]/80">(@{u.username || u.email.split('@')[0]})</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#F4F7F5]/50 mt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#C5A059]" /> {u.email}</span>
                    {u.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#C5A059]" /> {u.phone}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#C5A059]/10">
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  u.role === 'admin' 
                    ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40' 
                    : 'bg-[#051C1C] text-[#F4F7F5]/60 border border-[#C5A059]/15'
                }`}>
                  <Shield className="w-3.5 h-3.5" /> {u.role || 'user'}
                </span>

                <button
                  onClick={() => handleDeleteUser(u)}
                  className="p-2 rounded-xl border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Delete User"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-16 text-[#F4F7F5]/40 bg-[#0a1a1a] rounded-2xl border border-[#C5A059]/10">
              <p>No registered users found.</p>
            </div>
          )}
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#0a1a1a] border border-[#C5A059]/30 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#C5A059]/15 pb-4">
              <div>
                <h2 className="font-display text-xl text-[#F4F7F5]">Create Administrative Account</h2>
                <p className="text-xs text-[#F4F7F5]/40">Add new staff or administrator credentials</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-[#F4F7F5]/60 hover:text-[#C5A059]">
                <Trash2 className="hidden" />
                <span className="text-lg">✕</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Full Name</label>
                <input
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. Asif Chowdhury"
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Email / User ID *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="staff@sampan.com"
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Username (Optional)</label>
                <input
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="asif.manager"
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Password *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[#F4F7F5]/70 text-xs font-semibold mb-1.5">Role Permission</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#051C1C] border border-[#C5A059]/20 rounded-xl text-[#F4F7F5] text-sm focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="staff">Kitchen / Service Staff</option>
                  <option value="user">Standard User</option>
                </select>
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
                onClick={handleCreateUser}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl gold-gradient text-[#051C1C] font-bold text-xs disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}