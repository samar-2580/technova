import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Subscription, Expense, CATEGORY_COLORS } from '../types/finance';
import { formatCurrency } from '../services/storage';
import { Clock, CreditCard, Receipt, Edit3, Trash2, Check, RotateCcw, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardLedgersProps {
  onOpenSubModal: (sub?: Subscription) => void;
  onOpenExpenseModal: (expense?: Expense) => void;
  onNavigateToTab: (tab: 'subscriptions' | 'expenses') => void;
}

export const DashboardLedgers: React.FC<DashboardLedgersProps> = ({
  onOpenSubModal,
  onOpenExpenseModal,
  onNavigateToTab,
}) => {
  const { data, deleteExpense, toggleSubscriptionTag } = useFinance();
  const { currency, subscriptions, expenses } = data;

  const today = new Date('2026-09-14');

  const getDaysUntilRenewal = (nextBillingDate: string): number => {
    const next = new Date(nextBillingDate);
    const diffTime = next.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Subscriptions due within 7 days
  const upcomingRenewals = subscriptions
    .filter((sub) => {
      if (sub.status !== 'active') return false;
      const days = getDaysUntilRenewal(sub.nextBillingDate);
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => getDaysUntilRenewal(a.nextBillingDate) - getDaysUntilRenewal(b.nextBillingDate));

  // Recent 6 expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      
      {/* 1. Upcoming Renewals Ledger */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-4.5 border border-zinc-800/80 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-800/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
                  Upcoming Renewals
                </h3>
                <p className="text-[11px] text-zinc-400">Due within next 7 days</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('subscriptions')}
              className="flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              <span>View All ({subscriptions.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {upcomingRenewals.length > 0 ? (
            <div className="space-y-2">
              {upcomingRenewals.map((sub) => {
                const daysLeft = getDaysUntilRenewal(sub.nextBillingDate);
                const isUrgent = daysLeft <= 2;

                return (
                  <div
                    key={`ledger-sub-${sub.id}`}
                    className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700/60 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700/50 flex items-center justify-center font-mono font-bold text-xs text-zinc-300 flex-shrink-0">
                        {sub.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-zinc-200 block truncate">
                          {sub.name}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">
                          {sub.billingCycle} • {sub.nextBillingDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className="text-xs font-mono font-bold text-zinc-100 tabular-nums">
                        {formatCurrency(sub.amount, currency)}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wide ${
                          isUrgent
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {daysLeft === 0 ? 'Due Today' : `In ${daysLeft} days`}
                      </span>

                      <button
                        onClick={() => toggleSubscriptionTag(sub.id)}
                        className={`p-1 rounded text-[10px] font-mono border transition-all ${
                          sub.tag === 'keep'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                        title="Toggle Keep / Re-evaluate"
                      >
                        {sub.tag === 'keep' ? <Check className="w-3 h-3" /> : <RotateCcw className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-zinc-500 text-xs font-mono">
              No upcoming renewals scheduled in the next 7 days.
            </div>
          )}
        </div>

        <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span>Active monthly run-rate</span>
          <span className="text-zinc-200 font-bold tabular-nums">
            {formatCurrency(
              subscriptions
                .filter((s) => s.status === 'active')
                .reduce((sum, s) => sum + (s.billingCycle === 'annual' ? s.amount / 12 : s.amount), 0),
              currency
            )}
            /mo
          </span>
        </div>
      </motion.div>

      {/* 2. Recent Transactions Ledger */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card rounded-xl p-4.5 border border-zinc-800/80 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-800/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Receipt className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
                  Recent Transactions
                </h3>
                <p className="text-[11px] text-zinc-400">Latest logged expenses</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('expenses')}
              className="flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              <span>Feed ({expenses.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {recentExpenses.map((exp) => (
              <div
                key={`ledger-exp-${exp.id}`}
                className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700/60 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center font-mono font-bold text-xs flex-shrink-0"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[exp.category]}18`,
                      color: CATEGORY_COLORS[exp.category],
                      border: `1px solid ${CATEGORY_COLORS[exp.category]}35`,
                    }}
                  >
                    {exp.title.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-zinc-200 block truncate">
                      {exp.title}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {exp.date} • {exp.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-mono font-bold text-zinc-100 tabular-nums">
                    {formatCurrency(exp.amount, currency)}
                  </span>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={() => onOpenExpenseModal(exp)}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      title="Edit Expense"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1 rounded bg-zinc-800 hover:bg-rose-900/40 text-zinc-400 hover:text-rose-400"
                      title="Delete Expense"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span>Logged total in Sep 2026</span>
          <span className="text-emerald-400 font-bold tabular-nums">
            {formatCurrency(
              expenses
                .filter((e) => e.date.startsWith('2026-09'))
                .reduce((s, e) => s + e.amount, 0),
              currency
            )}
          </span>
        </div>
      </motion.div>

    </div>
  );
};
