import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Subscription, CATEGORY_COLORS } from '../types/finance';
import { formatCurrency } from '../services/storage';
import { 
  CreditCard, 
  Plus, 
  Clock, 
  Trash2, 
  Edit, 
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

  const getDaysUntilRenewal = (nextBillingDate: string): number => {
    const next = new Date(nextBillingDate);
    const diffTime = next.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const dueSoonSubs = subscriptions.filter((sub) => {
    if (sub.status !== 'active') return false;
    const days = getDaysUntilRenewal(sub.nextBillingDate);
    return days >= 0 && days <= 7;
  });

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesCadence = cadenceFilter === 'all' || sub.billingCycle === cadenceFilter;
    const matchesTag = tagFilter === 'all' || sub.tag === tagFilter;
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCadence && matchesTag && matchesSearch;
  });

  const totalMonthlyRunRate = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + (s.billingCycle === 'annual' ? s.amount / 12 : s.amount), 0);

  const reevaluateCount = subscriptions.filter((s) => s.tag === 'reevaluate').length;

  return (
    <div className="space-y-4">
      
      {/* Top Banner & Stats Header */}
      <div className="glass-card rounded-xl p-5 relative overflow-hidden border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </span>
            <h2 className="text-base font-mono font-bold text-zinc-100 uppercase tracking-wider">
              Subscription Hub
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-sans">
            Normalized monthly burn, annual cost optimization, and proactive renewal alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-right">
            <span className="text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider block">
              Active Run-Rate
            </span>
            <span className="text-sm font-mono font-bold text-emerald-400 tabular-nums">
              {formatCurrency(totalMonthlyRunRate, currency)}<span className="text-xs text-zinc-400 font-normal">/mo</span>
            </span>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow-sm border border-emerald-500/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subscription</span>
          </button>
        </div>
      </div>

      {/* RENEWAL RADAR ALERT (Due in Next 7 Days) */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-4 border-l-2 border-l-amber-500 bg-amber-500/5 border border-zinc-800/80"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Renewal Radar — Next 7 Days
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            {dueSoonSubs.length} Upcoming Renewal{dueSoonSubs.length === 1 ? '' : 's'}
          </span>
        </div>

        {dueSoonSubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-2">
            {dueSoonSubs.map((sub) => {
              const daysLeft = getDaysUntilRenewal(sub.nextBillingDate);
              const isUrgent = daysLeft <= 2;

              return (
                <div 
                  key={`radar-${sub.id}`} 
                  className={`p-2.5 rounded-lg border flex items-center justify-between text-xs font-mono ${
                    isUrgent 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' 
                      : 'bg-zinc-950 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300">
                      {sub.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <span className="font-semibold block truncate text-zinc-200">{sub.name}</span>
                      <span className="text-[10px] opacity-70 tabular-nums">{sub.billingCycle} • {formatCurrency(sub.amount, currency)}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                    isUrgent ? 'bg-rose-600 text-white' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {daysLeft === 0 ? 'Due Today' : `In ${daysLeft}d`}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs font-mono text-zinc-400 italic">No recurring renewals scheduled in the next 7 days.</p>
        )}
      </motion.div>

      {/* Control Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subscriptions..."
            className="w-full bg-zinc-900/90 text-zinc-200 placeholder:text-zinc-500 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono focus:outline-none focus:border-zinc-600"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          
          {/* Cadence Toggle */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setCadenceFilter('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                cadenceFilter === 'all' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Cycles
            </button>
            <button
              onClick={() => setCadenceFilter('monthly')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                cadenceFilter === 'monthly' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setCadenceFilter('annual')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                cadenceFilter === 'annual' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Annual
            </button>
          </div>

          {/* Tag Filter */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setTagFilter('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                tagFilter === 'all' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Tags
            </button>
            <button
              onClick={() => setTagFilter('keep')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                tagFilter === 'keep' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Keep
            </button>
            <button
              onClick={() => setTagFilter('reevaluate')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                tagFilter === 'reevaluate' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Re-evaluate ({reevaluateCount})
            </button>
          </div>

        </div>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <AnimatePresence>
          {filteredSubscriptions.map((sub) => {
            const normalizedMonthly = sub.billingCycle === 'annual' ? sub.amount / 12 : sub.amount;

            return (
              <motion.div
                key={sub.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="glass-card rounded-xl p-4 flex flex-col justify-between relative group border border-zinc-800/80 hover:border-zinc-700/60"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/50 text-zinc-300 flex items-center justify-center font-mono font-bold text-sm flex-shrink-0">
                        {sub.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs text-zinc-100 truncate">
                          {sub.name}
                        </h4>
                        <span 
                          className="inline-block text-[10px] font-mono px-1.5 py-0.5 rounded mt-0.5"
                          style={{ 
                            backgroundColor: `${CATEGORY_COLORS[sub.category]}15`, 
                            color: CATEGORY_COLORS[sub.category] 
                          }}
                        >
                          {sub.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-base font-mono font-bold text-zinc-100 tabular-nums block">
                        {formatCurrency(sub.amount, currency)}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">
                        /{sub.billingCycle} {sub.billingCycle === 'annual' && `(${formatCurrency(normalizedMonthly, currency)}/mo)`}
                      </span>
                    </div>
                  </div>

                  {sub.notes && (
                    <p className="text-xs text-zinc-400 mb-2.5 italic line-clamp-2">
                      "{sub.notes}"
                    </p>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-2.5 border-t border-zinc-800/60 flex items-center justify-between gap-2 mt-1">
                  
                  {/* Next Billing */}
                  <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>Next: <strong>{sub.nextBillingDate}</strong></span>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5">
                    
                    {/* Tag Button */}
                    <button
                      onClick={() => toggleSubscriptionTag(sub.id)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border transition-all ${
                        sub.tag === 'keep'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                      title="Click to toggle Keep / Re-evaluate"
                    >
                      {sub.tag === 'keep' ? <Check className="w-3 h-3" /> : <RotateCcw className="w-3 h-3" />}
                      <span>{sub.tag}</span>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEditSub(sub)}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      title="Edit Subscription"
                    >
                      <Edit className="w-3 h-3" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteSubscription(sub.id)}
                      className="p-1 rounded bg-zinc-800 hover:bg-rose-900/40 text-zinc-400 hover:text-rose-400"
                      title="Delete Subscription"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                  </div>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredSubscriptions.length === 0 && (
        <div className="text-center py-12 glass-card rounded-xl border border-zinc-800/80 font-mono text-xs text-zinc-500">
          No subscriptions match current search criteria.
        </div>
      )}

    </div>
  );
};
