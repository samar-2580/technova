import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../services/storage';
import { 
  TrendingUp, 
  CreditCard, 
  Flame, 
  PiggyBank, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricHubProps {
  onOpenBudgetModal: () => void;
}

export const MetricHub: React.FC<MetricHubProps> = ({ onOpenBudgetModal }) => {
  const { data } = useFinance();
  const { currency, expenses, subscriptions, budget } = data;

  // Calculate Monthly Spend (Expenses from current month e.g., September 2026)
  const currentMonthPrefix = '2026-09';
  const currentMonthExpensesSum = expenses
    .filter((e) => e.date.startsWith(currentMonthPrefix))
    .reduce((sum, e) => sum + e.amount, 0);

  // Active Subscriptions calculation
  const activeSubs = subscriptions.filter((s) => s.status === 'active');
  const monthlySubsRunRate = activeSubs.reduce((sum, s) => {
    return sum + (s.billingCycle === 'annual' ? s.amount / 12 : s.amount);
  }, 0);

  const totalMonthlySpend = currentMonthExpensesSum;
  const projectedAnnualBurn = totalMonthlySpend * 12;
  const remainingBudget = budget.monthlyTarget - totalMonthlySpend;
  const budgetSpentPercentage = Math.min(100, Math.round((totalMonthlySpend / budget.monthlyTarget) * 100));

  // Health color state
  let healthIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
  let healthStatusText = 'Budget Health: Optimal';
  let barGradient = 'from-emerald-500 to-emerald-400';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

  if (budgetSpentPercentage >= 90) {
    healthIcon = <AlertCircle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />;
    healthStatusText = 'Budget Health: Critical Warning';
    barGradient = 'from-rose-500 to-rose-400';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (budgetSpentPercentage >= 70) {
    healthIcon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    healthStatusText = 'Budget Health: Approaching Limit';
    barGradient = 'from-amber-500 to-amber-400';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 28 } },
  };

  return (
    <div className="space-y-4">
      
      {/* 4 Stat Cards Top Row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Total Monthly Spend */}
        <motion.div variants={cardVariants} className="glass-card rounded-xl p-4.5 relative overflow-hidden group border border-zinc-800/80 hover:border-zinc-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
              Monthly Spend
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-2xl font-mono font-bold text-zinc-100 tracking-tight tabular-nums">
              {formatCurrency(totalMonthlySpend, currency)}
            </h3>
            {/* Sparkline SVG */}
            <svg className="w-16 h-8 text-emerald-500/50" viewBox="0 0 60 30" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M0 25 Q15 20, 30 15 T60 5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-400">
            <span>Sep 2026 total</span>
            <span className="text-emerald-400 font-semibold">+4.2% vs last mo</span>
          </div>
        </motion.div>

        {/* Card 2: Subscriptions Run-Rate */}
        <motion.div variants={cardVariants} className="glass-card rounded-xl p-4.5 relative overflow-hidden group border border-zinc-800/80 hover:border-zinc-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
              Sub Run-Rate
            </span>
            <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-mono font-bold text-zinc-100 tracking-tight tabular-nums">
                {formatCurrency(monthlySubsRunRate, currency)}
              </h3>
              <span className="text-xs text-zinc-400 font-mono">/mo</span>
            </div>
            {/* Sparkline SVG */}
            <svg className="w-16 h-8 text-zinc-400/40" viewBox="0 0 60 30" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M0 15 L20 15 L40 15 L60 15" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-400">
            <span>{activeSubs.length} active items</span>
            <span className="text-zinc-300">Normalized</span>
          </div>
        </motion.div>

        {/* Card 3: Projected Annual Burn */}
        <motion.div variants={cardVariants} className="glass-card rounded-xl p-4.5 relative overflow-hidden group border border-zinc-800/80 hover:border-zinc-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
              Annual Burn
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-mono font-bold text-zinc-100 tracking-tight tabular-nums">
                {formatCurrency(projectedAnnualBurn, currency)}
              </h3>
              <span className="text-xs text-amber-400 font-mono">/yr</span>
            </div>
            {/* Sparkline SVG */}
            <svg className="w-16 h-8 text-amber-500/40" viewBox="0 0 60 30" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M0 25 L15 22 L30 18 L45 10 L60 5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-400">
            <span>Current run-rate</span>
            <span className="text-amber-400">12x forecast</span>
          </div>
        </motion.div>

        {/* Card 4: Remaining Budget */}
        <motion.div variants={cardVariants} className="glass-card rounded-xl p-4.5 relative overflow-hidden group border border-zinc-800/80 hover:border-zinc-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
              Remaining Budget
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <PiggyBank className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className={`text-2xl font-mono font-bold tracking-tight tabular-nums ${
              remainingBudget < 0 ? 'text-rose-400' : 'text-zinc-100'
            }`}>
              {formatCurrency(remainingBudget, currency)}
            </h3>
            {/* Sparkline SVG */}
            <svg className="w-16 h-8 text-emerald-500/40" viewBox="0 0 60 30" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M0 5 L20 10 L40 18 L60 22" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-400">
            <span>Target: {formatCurrency(budget.monthlyTarget, currency)}</span>
            <span className="text-emerald-400">{100 - budgetSpentPercentage}% avail</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Dynamic Budget Health Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card rounded-xl p-4 relative border border-zinc-800/80"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className={`px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 text-xs font-mono font-medium ${badgeBg}`}>
              {healthIcon}
              <span>{healthStatusText}</span>
            </div>
            <span className="text-xs font-mono font-medium text-zinc-400">
              ({budgetSpentPercentage}% spent)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400">
              Target: <strong className="text-zinc-200 tabular-nums">{formatCurrency(budget.monthlyTarget, currency)}</strong>
            </span>
            <button
              onClick={onOpenBudgetModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors border border-zinc-700/60"
            >
              <Edit3 className="w-3 h-3 text-zinc-400" />
              <span>Adjust Target</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-zinc-950 rounded-full p-0.5 overflow-hidden border border-zinc-800/80">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, budgetSpentPercentage)}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
            className={`h-full rounded-full bg-gradient-to-r ${barGradient} shadow-sm`}
          />
        </div>

        {/* Milestone Markers */}
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1.5 px-0.5">
          <span>0%</span>
          <span>50%</span>
          <span>70% Limit</span>
          <span>90% Critical</span>
          <span>100% Target</span>
        </div>
      </motion.div>

    </div>
  );
};
