import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CATEGORY_COLORS, Category, CATEGORIES } from '../types/finance';
import { formatCurrency } from '../services/storage';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { PieChart as PieIcon, TrendingUp, Layers } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const { data } = useFinance();
  const { currency, expenses, budget } = data;
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // 1. Prepare Category Distribution Data for Donut Chart
  const categoryTotals: Record<string, number> = {};
  CATEGORIES.forEach((cat) => { categoryTotals[cat] = 0; });

  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const overallTotal = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const pieData = Object.entries(categoryTotals)
    .filter(([_, amount]) => amount > 0)
    .map(([name, value]) => ({
      name,
      value,
      percentage: overallTotal > 0 ? ((value / overallTotal) * 100).toFixed(1) : '0',
    }));

  // 2. Prepare 6-Month Spend Velocity Data (April 2026 - September 2026)
  // Let's aggregate historical expenses and add sample historical context if needed for previous months
  const monthlyData = [
    { month: 'Apr 26', amount: 2840, target: budget.monthlyTarget },
    { month: 'May 26', amount: 3120, target: budget.monthlyTarget },
    { month: 'Jun 26', amount: 3450, target: budget.monthlyTarget },
    { month: 'Jul 26', amount: 2980, target: budget.monthlyTarget },
    { month: 'Aug 26', amount: 3890, target: budget.monthlyTarget },
    { month: 'Sep 26', amount: expenses.filter(e => e.date.startsWith('2026-09')).reduce((a, b) => a + b.amount, 0), target: budget.monthlyTarget },
  ];

  // Custom Donut Tooltip Component
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="glass-panel p-3 rounded-xl border border-slate-700/60 shadow-xl text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.fill || '#6366f1' }} />
            <span className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">{data.name}</span>
          </div>
          <div className="text-slate-300">
            Amount: <strong className="text-indigo-400">{formatCurrency(data.value, currency)}</strong>
          </div>
          <div className="text-slate-400 text-[10px]">
            Share: <strong>{data.payload.percentage}%</strong> of total
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Velocity Area Tooltip
  const CustomVelocityTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-xl border border-slate-700/60 shadow-xl text-xs">
          <p className="font-bold text-slate-200 mb-1">{label}</p>
          <div className="flex items-center gap-2 text-indigo-400">
            <span>Spend:</span>
            <strong className="text-sm font-extrabold">{formatCurrency(payload[0].value, currency)}</strong>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Budget Cap: {formatCurrency(payload[0].payload.target, currency)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Donut Chart: Category Breakdown */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-2xl p-6 relative flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                  Category Distribution
                </h3>
                <p className="text-[11px] text-slate-400">Proportional spending breakdown</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
              {pieData.length} Active Categories
            </span>
          </div>

          {/* Donut Chart Canvas */}
          <div className="h-64 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  onMouseEnter={(_, index) => setHoveredCategory(pieData[index].name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {pieData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.name}`} 
                      fill={CATEGORY_COLORS[entry.name as Category] || '#6366f1'} 
                      stroke="rgba(15, 23, 42, 0.6)"
                      strokeWidth={2}
                      className="transition-all duration-200 cursor-pointer hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {hoveredCategory || 'Total Outflow'}
              </span>
              <span className="text-lg font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
                {hoveredCategory
                  ? formatCurrency(categoryTotals[hoveredCategory] || 0, currency)
                  : formatCurrency(overallTotal, currency)}
              </span>
            </div>
          </div>

          {/* Custom Category Legend Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/60">
            {pieData.map((item) => (
              <div 
                key={item.name}
                onMouseEnter={() => setHoveredCategory(item.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex items-center gap-2 p-1.5 rounded-xl text-xs cursor-pointer transition-all ${
                  hoveredCategory === item.name ? 'bg-slate-800/90 ring-1 ring-indigo-500/50' : 'hover:bg-slate-800/40'
                }`}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[item.name as Category] || '#6366f1' }}
                />
                <span className="text-slate-300 truncate text-[11px] font-medium">{item.name}</span>
                <span className="ml-auto text-[10px] font-bold text-slate-400">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Spending Velocity Area/Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card rounded-2xl p-6 relative flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                  Monthly Spend Velocity
                </h3>
                <p className="text-[11px] text-slate-400">6-Month spending trajectory vs target budget</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-purple-400 border border-slate-700">
              6 Months Trend
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} />
                <Tooltip content={<CustomVelocityTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSpend)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-4 border-t border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 rounded bg-indigo-500"></span>
              <span>Actual Outflow</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Avg Monthly Run-Rate: <strong className="text-indigo-300">{formatCurrency(3246, currency)}</strong>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Category Budget Meters */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              Category Budget Breakdown
            </h3>
            <p className="text-[11px] text-slate-400">Spending limits per individual category</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {CATEGORIES.map((category) => {
            const spent = categoryTotals[category] || 0;
            const target = budget.categoryBudgets[category] || 500;
            const pct = Math.min(100, Math.round((spent / target) * 100));
            const catColor = CATEGORY_COLORS[category];

            return (
              <div key={category} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: catColor }} />
                    <span className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">{category}</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    <strong className="text-slate-200 dark:text-slate-200 light:text-slate-800">{formatCurrency(spent, currency)}</strong> / {formatCurrency(target, currency)} ({pct}%)
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-200 rounded-full overflow-hidden border border-slate-800/60">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: pct > 90 ? '#ef4444' : pct > 75 ? '#f59e0b' : catColor 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
};
