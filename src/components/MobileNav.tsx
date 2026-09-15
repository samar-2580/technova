import React from 'react';
import { useFinance, TabType } from '../context/FinanceContext';
import { LayoutDashboard, CreditCard, Receipt, BarChart3, Plus } from 'lucide-react';

interface MobileNavProps {
  onOpenExpenseModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenExpenseModal }) => {
  const { activeTab, setActiveTab } = useFinance();

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'subscriptions', label: 'Subs', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'expenses', label: 'Expenses', icon: <Receipt className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/80 px-3 py-2 flex items-center justify-around">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 text-[10px] font-mono font-medium transition-colors ${
              isActive ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenExpenseModal}
        className="flex flex-col items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold"
        title="Log Expense"
      >
        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
          <Plus className="w-4 h-4" />
        </div>
        <span>Log</span>
      </button>
    </div>
  );
};
