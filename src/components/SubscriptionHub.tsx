import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Subscription, CATEGORY_COLORS } from '../types/finance';
import { formatCurrency } from '../services/storage';
import { 
  CreditCard, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  Edit, 
  Tag,
  Search,
  Check,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubscriptionHubProps {
  onOpenAddModal: () => void;
  onEditSub: (sub: Subscription) => void;
}

export const SubscriptionHub: React.FC<SubscriptionHubProps> = ({ onOpenAddModal, onEditSub }) => {
  const { data, deleteSubscription, toggleSubscriptionTag } = useFinance();
  const { currency, subscriptions } = data;

  const [cadenceFilter, setCadenceFilter] = useState<'all' | 'monthly' | 'annual'>('all');
  const [tagFilter, setTagFilter] = useState<'all' | 'keep' | 'reevaluate'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date('2026-09-14'); // Current system date context

  // Calculate renewal days remaining for a subscription
  const getDaysUntilRenewal = (nextBillingDate: string): number => {
    const next = new Date(nextBillingDate);
    const diffTime = next.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Find subscriptions due within next 7 days (Renewal Radar)
  const dueSoonSubs = subscriptions.filter((sub) => {
    if (sub.status !== 'active') return false;
    const days = getDaysUntilRenewal(sub.nextBillingDate);
    return days >= 0 && days <= 7;
  });

  // Filter subscriptions list
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesCadence = cadenceFilter === 'all' || sub.billingCycle === cadenceFilter;
    const matchesTag = tagFilter === 'all' || sub.tag === tagFilter;
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCadence && matchesTag && matchesSearch;
  });

  // Total active monthly run-rate
  const totalMonthlyRunRate = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + (s.billingCycle === 'annual' ? s.amount / 12 : s.amount), 0);

  const reevaluateCount = subscriptions.filter((s) => s.tag === 'reevaluate').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Stats Header */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CreditCard className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
              Subscription Control Center
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Track active billing cycles, evaluate recurring ROI, and catch upcoming renewals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border border-slate-800 text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Run-Rate
            </span>
            <span className="text-base font-extrabold text-purple-400">
              {formatCurrency(totalMonthlyRunRate, currency)}<span className="text-xs font-semibold text-slate-400">/mo</span>
            </span>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subscription</span>
          </button>
        </div>
      </div>

      {/* RENEWAL RADAR ALERT (Due in Next 7 Days) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-500/10 via-slate-900/40 to-slate-900/40"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Renewal Radar — Due in Next 7 Days
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {dueSoonSubs.length} Upcoming Renewal{dueSoonSubs.length === 1 ? '' : 's'}
          </span>
        </div>

        {dueSoonSubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
            {dueSoonSubs.map((sub) => {
              const daysLeft = getDaysUntilRenewal(sub.nextBillingDate);
              const isUrgent = daysLeft <= 3;

              return (
                <div 
                  key={`radar-${sub.id}`} 
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    isUrgent 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' 
                      : 'bg-slate-900/80 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-purple-300">
                      {sub.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <span className="font-bold block truncate">{sub.name}</span>
                      <span className="text-[10px] opacity-80">{sub.billingCycle} • {formatCurrency(sub.amount, currency)}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    isUrgent ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500/30 text-amber-200'
                  }`}>
                    {daysLeft === 0 ? 'Due Today' : `In ${daysLeft} Day${daysLeft === 1 ? '' : 's'}`}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No recurring renewals scheduled in the next 7 days. All smooth!</p>
        )}
      </motion.div>

      {/* Control Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subscriptions..."
            className="w-full bg-slate-900/80 dark:bg-slate-900/80 light:bg-white text-slate-200 dark:text-slate-200 light:text-slate-900 placeholder:text-slate-500 border border-slate-700/60 light:border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Cadence Toggle */}
          <div className="flex items-center bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-200 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setCadenceFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                cadenceFilter === 'all' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Cycles
            </button>
            <button
              onClick={() => setCadenceFilter('monthly')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                cadenceFilter === 'monthly' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setCadenceFilter('annual')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                cadenceFilter === 'annual' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Annual
            </button>
          </div>

          {/* Tag Filter */}
          <div className="flex items-center bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-200 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setTagFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                tagFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Tags
            </button>
            <button
              onClick={() => setTagFilter('keep')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                tagFilter === 'keep' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Keep
            </button>
            <button
              onClick={() => setTagFilter('reevaluate')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                tagFilter === 'reevaluate' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Re-evaluate ({reevaluateCount})
            </button>
          </div>

        </div>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredSubscriptions.map((sub) => {
            const daysLeft = getDaysUntilRenewal(sub.nextBillingDate);

            return (
              <motion.div
                key={sub.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between relative group border border-slate-800/80 hover:border-purple-500/40"
              >
                <div>
                  {/* Card Header: Icon, Name, Category & Price */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-base shadow-sm">
                        {sub.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 group-hover:text-purple-300 transition-colors">
                          {sub.name}
                        </h4>
                        <span 
                          className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md mt-0.5"
                          style={{ 
                            backgroundColor: `${CATEGORY_COLORS[sub.category]}20`, 
                            color: CATEGORY_COLORS[sub.category] 
                          }}
                        >
                          {sub.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
                        {formatCurrency(sub.amount, currency)}
                      </span>
                      <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                        /{sub.billingCycle}
                      </span>
                    </div>
                  </div>

                  {sub.notes && (
                    <p className="text-xs text-slate-400 mb-3 italic line-clamp-2">
                      "{sub.notes}"
                    </p>
                  )}
                </div>

                {/* Card Footer: Renewal Date, Tag Button & Action Buttons */}
                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2 mt-2">
                  
                  {/* Next Billing Badge */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Next: <strong>{sub.nextBillingDate}</strong></span>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center gap-2">
                    
                    {/* Tag Toggle Button */}
                    <button
                      onClick={() => toggleSubscriptionTag(sub.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border transition-all ${
                        sub.tag === 'keep'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                      title="Click to toggle Keep / Re-evaluate"
                    >
                      {sub.tag === 'keep' ? <Check className="w-3 h-3" /> : <RotateCcw className="w-3 h-3" />}
                      <span>{sub.tag}</span>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEditSub(sub)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Edit Subscription"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteSubscription(sub.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Subscription"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredSubscriptions.length === 0 && (
        <div className="text-center py-12 glass-card rounded-2xl">
          <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No subscriptions found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search or cadence filter.</p>
        </div>
      )}

    </div>
  );
};
