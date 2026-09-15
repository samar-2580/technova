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
  const monthlyData = [
    { month: 'Apr 26', amount: 2840, target: budget.monthlyTarget },
    { month: 'May 26', amount: 3120, target: budget.monthlyTarget },
    { month: 'Jun 26', amount: 3450, target: budget.monthlyTarget },
    { month: 'Jul 26', amount: 2980, target: budget.monthlyTarget },
    { month: 'Aug 26', amount: 3890, target: budget.monthlyTarget },
    { month: 'Sep 26', amount: expenses.filter(e => e.date.startsWith('2026-09')).reduce((a, b) => a + b.amount, 0), target: budget.monthlyTarget },
  ];

  // Custom Minimalist Donut Tooltip
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="glass-panel p-2.5 rounded-lg border border-zinc-800 shadow-xl text-xs font-mono">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.payload.fill || '#10b981' }} />
            <span className="font-bold text-zinc-100">{item.name}</span>
          </div>
          <div className="text-zinc-300">
            <strong className="text-emerald-400 tabular-nums">{formatCurrency(item.value, currency)}</strong>
          </div>
          <div className="text-zinc-400 text-[10px]">
            Share: <strong>{item.payload.percentage}%</strong>
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
        <div className="glass-panel p-2.5 rounded-lg border border-zinc-800 shadow-xl text-xs font-mono">
          <p className="font-bold text-zinc-200 mb-1">{label}</p>
          <div className="flex items-center gap-2 text-emerald-400">
            <span>Outflow:</span>
            <strong className="text-sm font-extrabold tabular-nums">{formatCurrency(payload[0].value, currency)}</strong>
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">
            Budget Cap: {formatCurrency(payload[0].payload.target, currency)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      
      {/* 60 / 40 Split Grid: Left 60% Spend Velocity, Right 40% Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        
        {/* LEFT COLUMN (60% / lg:col-span-3): Spend Velocity / Cashflow Area Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="lg:col-span-3 glass-card rounded-xl p-5 relative border border-zinc-800/80 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
                  Spend Velocity
                </h3>
                <p className="text-[11px] text-zinc-400">6-Month cashflow trajectory vs target budget</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800/80 text-emerald-400 border border-zinc-700/60">
              6-Mo Velocity
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpendEmerald" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(39, 39, 42, 0.6)" />
                <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                <Tooltip content={<CustomVelocityTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorSpendEmerald)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mt-3 pt-3 border-t border-zinc-800/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-1 rounded bg-emerald-500"></span>
              <span>Monthly Outflow</span>
            </div>
            <div className="text-[11px]">
              Avg Monthly Run-Rate: <strong className="text-zinc-200 tabular-nums">{formatCurrency(3246, currency)}</strong>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN (40% / lg:col-span-2): Compact Category Breakdown */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="lg:col-span-2 glass-card rounded-xl p-5 relative border border-zinc-800/80 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                <PieIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
                  Category Breakdown
                </h3>
                <p className="text-[11px] text-zinc-400">Distribution share</p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              {pieData.length} Categories
            </span>
          </div>

          {/* Donut Chart Canvas */}
          <div className="h-44 w-full relative flex items-center justify-center my-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, index) => setHoveredCategory(pieData[index].name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {pieData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.name}`} 
                      fill={CATEGORY_COLORS[entry.name as Category] || '#10b981'} 
                      stroke="#09090b"
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
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                {hoveredCategory || 'Total'}
              </span>
              <span className="text-sm font-mono font-bold text-zinc-100 tracking-tight tabular-nums">
                {hoveredCategory
                  ? formatCurrency(categoryTotals[hoveredCategory] || 0, currency)
                  : formatCurrency(overallTotal, currency)}
              </span>
            </div>
          </div>

          {/* Compact Category Legend Badges */}
          <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-zinc-800/60 max-h-24 overflow-y-auto">
            {pieData.map((item) => (
              <div 
                key={item.name}
                onMouseEnter={() => setHoveredCategory(item.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex items-center gap-1.5 p-1 rounded text-xs font-mono cursor-pointer transition-all ${
                  hoveredCategory === item.name ? 'bg-zinc-800 text-zinc-100' : 'hover:bg-zinc-800/40 text-zinc-400'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[item.name as Category] || '#10b981' }}
                />
                <span className="truncate text-[10px]">{item.name}</span>
                <span className="ml-auto text-[10px] font-bold text-zinc-300 tabular-nums">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Category Budget Meters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="glass-card rounded-xl p-4.5 border border-zinc-800/80"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
              Category Threshold Meters
            </h3>
            <p className="text-[11px] text-zinc-400">Budget allocation per individual category</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          {CATEGORIES.map((category) => {
            const spent = categoryTotals[category] || 0;
            const target = budget.categoryBudgets[category] || 500;
            const pct = Math.min(100, Math.round((spent / target) * 100));
            const catColor = CATEGORY_COLORS[category];

            return (
              <div key={category} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: catColor }} />
                    <span className="font-semibold text-zinc-200">{category}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    <strong className="text-zinc-200 tabular-nums">{formatCurrency(spent, currency)}</strong> / {formatCurrency(target, currency)} ({pct}%)
                  </div>
                </div>

                <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/60">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: pct > 90 ? '#f43f5e' : pct > 75 ? '#f59e0b' : catColor 
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
