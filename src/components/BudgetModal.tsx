import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CATEGORIES, Category } from '../types/finance';
import { X, Save, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose }) => {
  const { data, updateBudget } = useFinance();

  const [monthlyTarget, setMonthlyTarget] = useState(data.budget.monthlyTarget.toString());
  const [categoryBudgets, setCategoryBudgets] = useState<Record<Category, string>>(() => {
    const init: any = {};
    CATEGORIES.forEach((cat) => {
      init[cat] = (data.budget.categoryBudgets[cat] || 500).toString();
    });
    return init;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseFloat(monthlyTarget);
    if (isNaN(targetNum) || targetNum <= 0) return;

    const parsedCategoryBudgets: Record<Category, number> = {} as any;
    CATEGORIES.forEach((cat) => {
      const val = parseFloat(categoryBudgets[cat]);
      parsedCategoryBudgets[cat] = isNaN(val) ? 500 : val;
    });

    updateBudget(targetNum, parsedCategoryBudgets);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-zinc-800/80 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Target className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-mono font-bold text-zinc-100 uppercase tracking-wider">
                Customize Target Budgets
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            
            {/* Overall Target */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1">
                Overall Monthly Budget Cap ($)
              </label>
              <input
                type="number"
                required
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(e.target.value)}
                placeholder="4200"
                className="w-full bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs font-mono font-bold tracking-tight tabular-nums focus:outline-none focus:border-zinc-600"
              />
            </div>

            {/* Category Level Targets */}
            <div>
              <h4 className="font-bold text-zinc-400 mb-2.5 uppercase tracking-wider text-[10px]">
                Per-Category Budget Targets ($)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CATEGORIES.map((cat) => (
                  <div key={cat}>
                    <label className="block text-zinc-400 mb-1 text-[11px] truncate">
                      {cat}
                    </label>
                    <input
                      type="number"
                      value={categoryBudgets[cat]}
                      onChange={(e) =>
                        setCategoryBudgets({ ...categoryBudgets, [cat]: e.target.value })
                      }
                      className="w-full bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold tracking-tight tabular-nums focus:outline-none focus:border-zinc-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all border border-emerald-500/30"
              >
                <Save className="w-4 h-4" />
                <span>Save Budget Settings</span>
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
