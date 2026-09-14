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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-slate-700/80 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Target className="w-4 h-4" />
              </span>
              <h3 className="text-base font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
                Customize Target Budgets
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            
            {/* Overall Target */}
            <div>
              <label className="block font-bold text-slate-200 mb-1">
                Overall Monthly Budget Cap ($)
              </label>
              <input
                type="number"
                required
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(e.target.value)}
                placeholder="4000"
                className="w-full bg-slate-900/80 text-slate-100 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category Level Targets */}
            <div>
              <h4 className="font-bold text-slate-300 mb-3 uppercase tracking-wider text-[10px]">
                Per-Category Budget Targets ($)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <div key={cat}>
                    <label className="block font-semibold text-slate-400 mb-1 text-[11px] truncate">
                      {cat}
                    </label>
                    <input
                      type="number"
                      value={categoryBudgets[cat]}
                      onChange={(e) =>
                        setCategoryBudgets({ ...categoryBudgets, [cat]: e.target.value })
                      }
                      className="w-full bg-slate-900/80 text-slate-100 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
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
