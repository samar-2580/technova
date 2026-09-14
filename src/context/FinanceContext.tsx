import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppData, Currency, Expense, Subscription, Budget, Category } from '../types/finance';
import { getStoredData, saveStoredData, INITIAL_DEMO_DATA, exportToCSV } from '../services/storage';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export type TabType = 'dashboard' | 'subscriptions' | 'expenses' | 'analytics';

interface FinanceContextType {
  data: AppData;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  setCurrency: (currency: Currency) => void;
  toggleTheme: () => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  updateSubscription: (subscription: Subscription) => void;
  deleteSubscription: (id: string) => void;
  toggleSubscriptionTag: (id: string) => void;
  updateBudget: (monthlyTarget: number, categoryBudgets?: Record<Category, number>) => void;
  reloadDemoData: () => void;
  resetData: () => void;
  exportData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(getStoredData);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Apply dark / light theme class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (data.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [data.theme]);

  // Persist state updates to localStorage
  const updateStateAndStorage = (updater: (prev: AppData) => AppData) => {
    setData((prev) => {
      const next = updater(prev);
      saveStoredData(next);
      return next;
    });
  };

  const setCurrency = (currency: Currency) => {
    updateStateAndStorage((prev) => ({ ...prev, currency }));
    toast.success(`Currency switched to ${currency}`, { icon: '💱' });
  };

  const toggleTheme = () => {
    updateStateAndStorage((prev) => {
      const nextTheme = prev.theme === 'dark' ? 'light' : 'dark';
      toast.success(`Switched to ${nextTheme} mode`, { icon: nextTheme === 'dark' ? '🌙' : '☀️' });
      return { ...prev, theme: nextTheme };
    });
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    updateStateAndStorage((prev) => ({
      ...prev,
      expenses: [newExpense, ...prev.expenses],
    }));
    toast.success(`Logged expense: ${newExpense.title}`);
  };

  const updateExpense = (updated: Expense) => {
    updateStateAndStorage((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === updated.id ? updated : e)),
    }));
    toast.success(`Updated ${updated.title}`);
  };

  const deleteExpense = (id: string) => {
    const target = data.expenses.find((e) => e.id === id);
    updateStateAndStorage((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
    toast.error(`Deleted ${target?.title || 'expense'}`);
  };

  const addSubscription = (subData: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...subData,
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    updateStateAndStorage((prev) => ({
      ...prev,
      subscriptions: [newSub, ...prev.subscriptions],
    }));
    toast.success(`Added subscription: ${newSub.name}`);
  };

  const updateSubscription = (updated: Subscription) => {
    updateStateAndStorage((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) => (s.id === updated.id ? updated : s)),
    }));
    toast.success(`Updated ${updated.name}`);
  };

  const deleteSubscription = (id: string) => {
    const target = data.subscriptions.find((s) => s.id === id);
    updateStateAndStorage((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.filter((s) => s.id !== id),
    }));
    toast.error(`Removed ${target?.name || 'subscription'}`);
  };

  const toggleSubscriptionTag = (id: string) => {
    updateStateAndStorage((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) => {
        if (s.id === id) {
          const nextTag = s.tag === 'keep' ? 'reevaluate' : 'keep';
          toast.success(`${s.name} tagged as [${nextTag.toUpperCase()}]`);
          return { ...s, tag: nextTag };
        }
        return s;
      }),
    }));
  };

  const updateBudget = (monthlyTarget: number, categoryBudgets?: Record<Category, number>) => {
    updateStateAndStorage((prev) => ({
      ...prev,
      budget: {
        monthlyTarget,
        categoryBudgets: categoryBudgets || prev.budget.categoryBudgets,
      },
    }));
    toast.success('Budget target updated!');
  };

  const reloadDemoData = () => {
    updateStateAndStorage(() => INITIAL_DEMO_DATA);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // fallback if canvas canvas issue
    }
    toast.success('Demo data reloaded (27 Expenses, 6 Subscriptions)');
  };

  const resetData = () => {
    const emptyData: AppData = {
      currency: data.currency,
      theme: data.theme,
      budget: {
        monthlyTarget: 3000,
        categoryBudgets: {
          Housing: 1200,
          'Food & Dining': 500,
          'Subscriptions & Tech': 200,
          Transportation: 200,
          Entertainment: 200,
          'Health & Utilities': 300,
          Shopping: 200,
          General: 200,
        },
      },
      subscriptions: [],
      expenses: [],
    };
    updateStateAndStorage(() => emptyData);
    toast.error('All expense and subscription data cleared');
  };

  const exportData = () => {
    exportToCSV(data);
    toast.success('Exported data to CSV');
  };

  return (
    <FinanceContext.Provider
      value={{
        data,
        activeTab,
        setActiveTab,
        setCurrency,
        toggleTheme,
        addExpense,
        updateExpense,
        deleteExpense,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        toggleSubscriptionTag,
        updateBudget,
        reloadDemoData,
        resetData,
        exportData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
