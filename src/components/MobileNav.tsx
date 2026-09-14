import React from 'react';
import { useFinance, TabType } from '../context/FinanceContext';
import { LayoutDashboard, CreditCard, Receipt, BarChart3, Plus } from 'lucide-react';

interface MobileNavProps {
  onOpenExpenseModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenExpenseModal }) => {
  const { activeTab, setActiveTab } = useFinance();

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'subscriptions', label: 'Subs', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'expenses', label: 'Expenses', icon: <Receipt className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800/80 px-4 py-2 flex items-center justify-around shadow-2xl">
      {tabs.slice(0, 2).map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}

      {/* Center Floating Action Button */}
      <button
        onClick={onOpenExpenseModal}
        className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 ring-4 ring-slate-950 transition-transform active:scale-95"
        title="Log Expense"
      >
        <Plus className="w-6 h-6" />
      </button>

      {tabs.slice(2, 4).map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
