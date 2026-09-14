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
  Database,
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
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'subscriptions', label: 'Subscriptions', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'expenses', label: 'Expense Feed', icon: <Receipt className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Status Pill */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-black text-xl">
                ⚡
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
                  TechNova
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-1">
                  Finance OS
                </span>
              </div>
            </div>

            {/* Glowing Status Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Local & Private</span>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 p-1.5 rounded-2xl border border-slate-800/80 light:border-slate-200">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl shadow-lg shadow-indigo-500/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            
            {/* Quick Add Action Button */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={onOpenExpenseModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Expense</span>
              </button>
              <button
                onClick={onOpenSubModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 light:bg-slate-200 light:hover:bg-slate-300 text-slate-200 light:text-slate-800 text-xs font-semibold border border-slate-700/50 transition-all"
              >
                <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                <span>Add Sub</span>
              </button>
            </div>

            {/* Currency Switcher */}
            <select
              value={data.currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white text-slate-200 light:text-slate-800 border border-slate-700/60 light:border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
              title="Quick Currency Switcher"
            >
              {(Object.keys(CURRENCY_CONFIG) as Currency[]).map((curr) => (
                <option key={curr} value={curr} className="bg-slate-900 text-slate-100 dark:bg-slate-900 dark:text-slate-100 light:bg-white light:text-slate-900">
                  {CURRENCY_CONFIG[curr].label}
                </option>
              ))}
            </select>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-white text-slate-300 dark:text-slate-300 light:text-slate-700 border border-slate-700/60 light:border-slate-300 hover:text-indigo-400 transition-colors shadow-sm"
              title="Toggle Dark / Light Mode"
            >
              {data.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Demo Data Button */}
            <button
              onClick={reloadDemoData}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 dark:text-indigo-300 light:text-indigo-700 border border-indigo-500/30 text-xs font-semibold transition-all"
              title="Reload realistic 25+ demo expenses & subscriptions"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
              <span>Demo Data</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={exportData}
              className="p-2 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-white text-slate-300 dark:text-slate-300 light:text-slate-700 border border-slate-700/60 light:border-slate-300 hover:text-emerald-400 transition-colors shadow-sm"
              title="Export Data as CSV"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Reset Data */}
            <div className="relative">
              <button
                onClick={() => setShowConfirmReset(!showConfirmReset)}
                className="p-2 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-white text-slate-300 dark:text-slate-300 light:text-slate-700 border border-slate-700/60 light:border-slate-300 hover:text-rose-400 transition-colors shadow-sm"
                title="Reset All Local Data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {showConfirmReset && (
                <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-3 shadow-2xl border border-rose-500/30 z-50 animate-in fade-in zoom-in-95">
                  <p className="text-xs font-semibold text-rose-300 dark:text-rose-300 light:text-rose-700 mb-2">
                    Clear all local finance data?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        resetData();
                        setShowConfirmReset(false);
                      }}
                      className="flex-1 py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                    >
                      Confirm Clear
                    </button>
                    <button
                      onClick={() => setShowConfirmReset(false)}
                      className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
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
