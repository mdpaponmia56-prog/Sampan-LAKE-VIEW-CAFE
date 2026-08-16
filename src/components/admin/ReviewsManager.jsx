import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, RefreshCw, MessageSquare, AlertCircle } from 'lucide-react';
import { db } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const { toast } = useToast();

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await db.entities.Review.list();
      setReviews(data);
    } catch (e) {
      console.error('Error loading reviews:', e);
      toast({ title: 'Error loading reviews', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSetStatus = async (review, status) => {
    try {
      await db.entities.Review.update(review.id, { status });
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, status } : r));
      toast({ 
        title: status === 'approved' ? 'Review Approved' : 'Review Rejected', 
        description: `Review by ${review.name} is now ${status}.` 
      });
    } catch (e) {
      toast({ title: 'Update Failed', description: e.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (review) => {
    if (!confirm(`Delete review from "${review.name}"?`)) return;
    try {
      await db.entities.Review.delete(review.id);
      setReviews(prev => prev.filter(r => r.id !== review.id));
      toast({ title: 'Review Deleted', description: 'The review has been permanently removed.' });
    } catch (e) {
      toast({ title: 'Delete Failed', description: e.message, variant: 'destructive' });
    }
  };

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);
  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F4D35E]/20 text-[#F4D35E] text-xs font-semibold uppercase tracking-wider">
              Guest Feedback Moderation
            </span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#E67E22] text-white text-xs font-bold animate-pulse">
                {pendingCount} Awaiting Approval
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl text-[#F4F7F5] mt-1">Customer Reviews Moderation</h1>
          <p className="text-[#F4F7F5]/50 text-sm">Review, approve, or reject customer dining ratings before they display publicly</p>
        </div>
        <button
          onClick={loadReviews}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#C5A059]/20 bg-[#0a1a1a] text-[#F4F7F5]/80 hover:text-[#C5A059] transition-all text-sm self-start"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Reviews
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 pb-1 overflow-x-auto">
        {[
          { key: 'pending', label: 'Pending Approval', count: reviews.filter(r => r.status === 'pending').length },
          { key: 'approved', label: 'Approved (Live on Site)', count: reviews.filter(r => r.status === 'approved').length },
          { key: 'rejected', label: 'Rejected / Hidden', count: reviews.filter(r => r.status === 'rejected').length },
          { key: 'all', label: 'All Reviews', count: reviews.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
              filter === tab.key
                ? 'gold-gradient text-[#051C1C]'
                : 'bg-[#0a1a1a] border border-[#C5A059]/20 text-[#F4F7F5]/60 hover:text-[#C5A059]'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#051C1C]/40 text-[10px]">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Reviews Cards List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
          <span className="text-xs text-[#F4F7F5]/50">Loading reviews...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(review => (
            <div 
              key={review.id} 
              className="p-5 rounded-2xl bg-[#0a1a1a] border border-[#C5A059]/15 hover:border-[#C5A059]/30 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base text-[#F4F7F5] font-bold">{review.name}</span>
                    {review.email && <span className="text-xs text-[#F4F7F5]/40">({review.email})</span>}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      review.status === 'approved'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : review.status === 'rejected'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {review.status}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-[#C5A059] fill-[#C5A059]' : 'text-[#F4F7F5]/20'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#C5A059]">{review.rating} / 5</span>
                    {review.dishName && <span className="text-xs text-[#F4F7F5]/50">• Dish: <strong>{review.dishName}</strong></span>}
                  </div>
                </div>

                <span className="text-xs text-[#F4F7F5]/40">
                  {new Date(review.created_date).toLocaleDateString()}
                </span>
              </div>

              <div className="p-3.5 bg-[#051C1C] rounded-xl border border-[#C5A059]/10">
                <p className="text-sm text-[#F4F7F5]/90 italic leading-relaxed">
                  "{review.text}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {review.status !== 'approved' && (
                  <button 
                    onClick={() => handleSetStatus(review, 'approved')} 
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 transition-all text-xs font-bold"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve & Publish
                  </button>
                )}
                {review.status !== 'rejected' && (
                  <button 
                    onClick={() => handleSetStatus(review, 'rejected')} 
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-all text-xs font-bold"
                  >
                    <X className="w-3.5 h-3.5" /> Reject Review
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(review)} 
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs font-medium ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#F4F7F5]/40 bg-[#0a1a1a] rounded-2xl border border-[#C5A059]/10">
              <p>No reviews in this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}