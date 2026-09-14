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

  // 1. Calculate Monthly Spend (Expenses from current month e.g., September 2026)
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

  // Determine health color state
  let healthColor = 'emerald';
  let healthIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  let healthStatusText = 'Budget Health: Optimal';
  let barGradient = 'from-emerald-500 to-teal-400';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

  if (budgetSpentPercentage >= 90) {
    healthColor = 'rose';
    healthIcon = <AlertCircle className="w-4 h-4 text-rose-400 animate-pulse" />;
    healthStatusText = 'Budget Health: Critical Warning';
    barGradient = 'from-rose-600 via-rose-500 to-red-400';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (budgetSpentPercentage >= 70) {
    healthColor = 'amber';
    healthIcon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
    healthStatusText = 'Budget Health: Approaching Limit';
    barGradient = 'from-amber-500 to-yellow-400';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <div className="space-y-6">
      
      {/* 4 Stat Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Total Monthly Spend */}
        <motion.div variants={cardVariants} className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Monthly Spend
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
              {formatCurrency(totalMonthlySpend, currency)}
            </h3>
          </div>
          <p className="text-[11px] font-medium text-slate-400 mt-2">
            September 2026 overall total
          </p>
        </motion.div>

        {/* Card 2: Subscriptions Run-Rate */}
        <motion.div variants={cardVariants} className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Subscription Run-Rate
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
              {formatCurrency(monthlySubsRunRate, currency)}
            </h3>
            <span className="text-xs text-purple-400 font-semibold">/mo</span>
          </div>
          <p className="text-[11px] font-medium text-slate-400 mt-2">
            Across {activeSubs.length} active recurring items
          </p>
        </motion.div>

        {/* Card 3: Projected Annual Burn */}
        <motion.div variants={cardVariants} className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Projected Annual Burn
            </span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
              {formatCurrency(projectedAnnualBurn, currency)}
            </h3>
            <span className="text-xs text-rose-400 font-semibold">/yr</span>
          </div>
          <p className="text-[11px] font-medium text-slate-400 mt-2">
            Based on current monthly run-rate
          </p>
        </motion.div>

        {/* Card 4: Remaining Budget */}
        <motion.div variants={cardVariants} className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Remaining Budget
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              remainingBudget < 0 
                ? 'text-rose-400' 
                : 'text-slate-100 dark:text-slate-100 light:text-slate-900'
            }`}>
              {formatCurrency(remainingBudget, currency)}
            </h3>
          </div>
          <p className="text-[11px] font-medium text-slate-400 mt-2">
            Target cap: {formatCurrency(budget.monthlyTarget, currency)}
          </p>
        </motion.div>
      </motion.div>

      {/* Dynamic Budget Health Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6 relative"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`px-3 py-1 rounded-full border flex items-center gap-1.5 text-xs font-semibold ${badgeBg}`}>
              {healthIcon}
              <span>{healthStatusText}</span>
            </div>
            <span className="text-xs font-bold text-slate-400">
              ({budgetSpentPercentage}% spent)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400">
              Target: <strong className="text-slate-200 dark:text-slate-200 light:text-slate-800">{formatCurrency(budget.monthlyTarget, currency)}</strong>
            </span>
            <button
              onClick={onOpenBudgetModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 light:bg-slate-200 light:hover:bg-slate-300 text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800 transition-colors border border-slate-700/50"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Adjust Target</span>
            </button>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-3.5 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-200 rounded-full p-0.5 overflow-hidden border border-slate-800/60 light:border-slate-300">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, budgetSpentPercentage)}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
            className={`h-full rounded-full bg-gradient-to-r ${barGradient} shadow-md`}
          />
        </div>

        {/* Milestone Tick Markers */}
        <div className="flex justify-between text-[10px] font-semibold text-slate-500 mt-2 px-1">
          <span>0%</span>
          <span>50%</span>
          <span>70% (Warning)</span>
          <span>90% (Critical)</span>
          <span>100% Target</span>
        </div>
      </motion.div>

    </div>
  );
};
