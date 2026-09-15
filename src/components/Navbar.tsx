import React, { useState } from 'react';
import { useFinance, TabType } from '../context/FinanceContext';
import { CURRENCY_CONFIG, Currency } from '../types/finance';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  LayoutDashboard, 
  CreditCard, 
  Receipt, 
  BarChart3, 
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  onOpenExpenseModal: () => void;
  onOpenSubModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenExpenseModal, onOpenSubModal }) => {
  const { 
    data, 
    activeTab, 
    setActiveTab, 
    setCurrency, 
    toggleTheme, 
    reloadDemoData, 
    resetData, 
    exportData 
  } = useFinance();

  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'subscriptions', label: 'Subscriptions', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'expenses', label: 'Expense Feed', icon: <Receipt className="w-3.5 h-3.5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          
          {/* Logo & Status Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm shadow-inner">
                ⚡
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-zinc-100">
                  TechNova
                </span>
                <span className="text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-widest">
                  OS
                </span>
              </div>
            </div>

            {/* Precision Status Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <ShieldCheck className="w-3 h-3" />
              <span>100% Local</span>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-zinc-200/60 p-1 rounded-xl border border-zinc-800/80 light:border-zinc-300">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-zinc-100 shadow-sm' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-zinc-800 dark:bg-zinc-800 light:bg-white rounded-lg border border-zinc-700/70 light:border-zinc-300 shadow-sm"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            
            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onOpenExpenseModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all border border-emerald-500/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Expense</span>
              </button>
              <button
                onClick={onOpenSubModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/90 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-all"
              >
                <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                <span>Add Sub</span>
              </button>
            </div>

            {/* Currency Switcher */}
            <select
              value={data.currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white text-zinc-200 light:text-zinc-900 border border-zinc-800 light:border-zinc-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold focus:outline-none focus:border-zinc-600 cursor-pointer shadow-sm"
              title="Quick Currency Switcher"
            >
              {(Object.keys(CURRENCY_CONFIG) as Currency[]).map((curr) => (
                <option key={curr} value={curr} className="bg-zinc-900 text-zinc-100 dark:bg-zinc-900 light:bg-white light:text-zinc-900">
                  {CURRENCY_CONFIG[curr].label}
                </option>
              ))}
            </select>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white text-zinc-400 hover:text-zinc-200 border border-zinc-800 light:border-zinc-300 transition-colors shadow-sm"
              title="Toggle Dark / Light Mode"
            >
              {data.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>

            {/* Demo Data Button */}
            <button
              onClick={reloadDemoData}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/50 text-xs font-medium transition-all"
              title="Reload realistic demo data"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Demo Data</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={exportData}
              className="p-1.5 rounded-lg bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white text-zinc-400 hover:text-emerald-400 border border-zinc-800 light:border-zinc-300 transition-colors shadow-sm"
              title="Export Data as CSV"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Reset Data */}
            <div className="relative">
              <button
                onClick={() => setShowConfirmReset(!showConfirmReset)}
                className="p-1.5 rounded-lg bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white text-zinc-400 hover:text-rose-400 border border-zinc-800 light:border-zinc-300 transition-colors shadow-sm"
                title="Reset All Local Data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {showConfirmReset && (
                <div className="absolute right-0 mt-2 w-56 glass-panel rounded-xl p-3 shadow-2xl border border-rose-500/30 z-50">
                  <p className="text-xs font-medium text-rose-300 mb-2">
                    Clear all local finance data?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        resetData();
                        setShowConfirmReset(false);
                      }}
                      className="flex-1 py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
                    >
                      Confirm Clear
                    </button>
                    <button
                      onClick={() => setShowConfirmReset(false)}
                      className="py-1 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
