import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { MetricHub } from './components/MetricHub';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { SubscriptionHub } from './components/SubscriptionHub';
import { ExpenseFeed } from './components/ExpenseFeed';
import { ExpenseModal } from './components/ExpenseModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { BudgetModal } from './components/BudgetModal';
import { MobileNav } from './components/MobileNav';
import { Toaster } from 'react-hot-toast';
import { Expense, Subscription } from './types/finance';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Heart, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, data } = useFinance();

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
      
      {/* Toast Notifications - Non-blocking pointer events */}
      <Toaster 
        position="top-right" 
        containerStyle={{ pointerEvents: 'none' }}
        toastOptions={{
          style: {
            background: data.theme === 'dark' ? '#0f172a' : '#ffffff',
            color: data.theme === 'dark' ? '#f8fafc' : '#0f172a',
            border: data.theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full flex-1 space-y-6">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Stat Cards & Budget Health Bar */}
              <MetricHub onOpenBudgetModal={() => setIsBudgetModalOpen(true)} />

              {/* Main Charts & Recent Feed Split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AnalyticsCharts />
                </div>
                <div className="lg:col-span-1">
                  <SubscriptionHub 
                    onOpenAddModal={() => handleOpenSubModal()}
                    onEditSub={(sub) => handleOpenSubModal(sub)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SUBSCRIPTION CONTROL HUB */}
          {activeTab === 'subscriptions' && (
            <motion.div
              key="subscriptions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
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
      <footer className="mt-12 border-t border-slate-800/60 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">TechNova Finance OS</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side LocalStorage
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for modern personal finance
            </span>
            <a 
              href="https://github.com/samar-2580/technova" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-300 hover:text-indigo-400 font-semibold transition-colors"
            >
              GitHub
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
