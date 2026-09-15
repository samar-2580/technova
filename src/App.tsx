import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { MetricHub } from './components/MetricHub';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { SubscriptionHub } from './components/SubscriptionHub';
import { ExpenseFeed } from './components/ExpenseFeed';
import { DashboardLedgers } from './components/DashboardLedgers';
import { ExpenseModal } from './components/ExpenseModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { BudgetModal } from './components/BudgetModal';
import { MobileNav } from './components/MobileNav';
import { Toaster } from 'react-hot-toast';
import { Expense, Subscription } from './types/finance';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, data } = useFinance();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const handleOpenExpenseModal = (expense?: Expense) => {
    setEditingExpense(expense || null);
    setIsExpenseModalOpen(true);
  };

  const handleOpenSubModal = (sub?: Subscription) => {
    setEditingSub(sub || null);
    setIsSubModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between pb-20 md:pb-12">
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right" 
        containerStyle={{ pointerEvents: 'none' }}
        toastOptions={{
          style: {
            background: data.theme === 'dark' ? '#18181b' : '#ffffff',
            color: data.theme === 'dark' ? '#fafafa' : '#09090b',
            border: data.theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7',
            borderRadius: '12px',
            fontSize: '12px',
            fontFamily: 'monospace',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
            pointerEvents: 'auto',
          },
        }}
      />

      {/* Top Navbar */}
      <Navbar 
        onOpenExpenseModal={() => handleOpenExpenseModal()} 
        onOpenSubModal={() => handleOpenSubModal()} 
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 w-full flex-1 space-y-4">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              {/* 1. Top Row: 4 Stat Cards & Budget Health Bar */}
              <MetricHub onOpenBudgetModal={() => setIsBudgetModalOpen(true)} />

              {/* 2. Middle Section: 60/40 Spend Velocity & Category Breakdown Split */}
              <AnalyticsCharts />

              {/* 3. Bottom Section: 50/50 Renewals & Recent Transactions Split */}
              <DashboardLedgers
                onOpenSubModal={(sub) => handleOpenSubModal(sub)}
                onOpenExpenseModal={(exp) => handleOpenExpenseModal(exp)}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            </motion.div>
          )}

          {/* TAB 2: SUBSCRIPTION CONTROL HUB */}
          {activeTab === 'subscriptions' && (
            <motion.div
              key="subscriptions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <SubscriptionHub 
                onOpenAddModal={() => handleOpenSubModal()}
                onEditSub={(sub) => handleOpenSubModal(sub)}
              />
            </motion.div>
          )}

          {/* TAB 3: TRANSACTION & EXPENSE FEED */}
          {activeTab === 'expenses' && (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <ExpenseFeed 
                onOpenAddModal={() => handleOpenExpenseModal()}
                onEditExpense={(exp) => handleOpenExpenseModal(exp)}
              />
            </motion.div>
          )}

          {/* TAB 4: ANALYTICS & VISUALS */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <AnalyticsCharts />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Modals */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        initialExpense={editingExpense}
      />

      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        initialSub={editingSub}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      {/* Mobile Bottom Bar */}
      <MobileNav onOpenExpenseModal={() => handleOpenExpenseModal()} />

      {/* Footer */}
      <footer className="mt-8 border-t border-zinc-800/80 py-4 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">TechNova OS</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Encryption & Storage
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a 
              href="https://github.com/samar-2580/technova" 
              target="_blank" 
              rel="noreferrer"
              className="text-zinc-400 hover:text-emerald-400 font-semibold transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
};

export default App;
