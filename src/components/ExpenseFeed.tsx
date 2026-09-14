import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Expense, Category, PaymentMethod, CATEGORIES, CATEGORY_COLORS } from '../types/finance';
import { formatCurrency } from '../services/storage';
import { 
  Search, 
  Plus, 
  Filter, 
  ArrowUpDown, 
  Trash2, 
  Edit3, 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  Building2, 
  Receipt 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpenseFeedProps {
  onOpenAddModal: () => void;
  onEditExpense: (expense: Expense) => void;
}

export const ExpenseFeed: React.FC<ExpenseFeedProps> = ({ onOpenAddModal, onEditExpense }) => {
  const { data, deleteExpense } = useFinance();
  const { currency, expenses } = data;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  const paymentIcons: Record<PaymentMethod, React.ReactNode> = {
    Card: <CreditCard className="w-3.5 h-3.5 text-indigo-400" />,
    Cash: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
    UPI: <Smartphone className="w-3.5 h-3.5 text-purple-400" />,
    Bank: <Building2 className="w-3.5 h-3.5 text-blue-400" />,
  };

  // Filter & Sort Expenses
  const filteredExpenses = expenses
    .filter((exp) => {
      const matchesSearch = 
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (exp.notes && exp.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
      const matchesPayment = selectedPayment === 'all' || exp.paymentMethod === selectedPayment;
      return matchesSearch && matchesCategory && matchesPayment;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'highest') return b.amount - a.amount;
      if (sortBy === 'lowest') return a.amount - b.amount;
      return 0;
    });

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Receipt className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
              Transaction & Expense Feed
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed with multi-filter search, category tags, and instant edit sync.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border border-slate-800 text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Filtered Total ({filteredExpenses.length})
            </span>
            <span className="text-base font-extrabold text-indigo-400">
              {formatCurrency(totalFilteredAmount, currency)}
            </span>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expenses by title or notes..."
            className="w-full bg-slate-900/80 dark:bg-slate-900/80 light:bg-white text-slate-200 dark:text-slate-200 light:text-slate-900 placeholder:text-slate-500 border border-slate-700/60 light:border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters & Sorting controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-1 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border border-slate-700/60 rounded-xl px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-200 dark:text-slate-200 light:text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-slate-900 text-slate-100 dark:bg-slate-900 dark:text-slate-100 light:bg-white light:text-slate-900">
                All Categories
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-100 dark:bg-slate-900 dark:text-slate-100 light:bg-white light:text-slate-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-1 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border border-slate-700/60 rounded-xl px-2 py-1">
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="bg-transparent text-slate-200 dark:text-slate-200 light:text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-slate-900 text-slate-100 dark:bg-slate-900 dark:text-slate-100 light:bg-white light:text-slate-900">
                All Payment Methods
              </option>
              <option value="Card" className="bg-slate-900 text-slate-100">Card</option>
              <option value="UPI" className="bg-slate-900 text-slate-100">UPI</option>
              <option value="Bank" className="bg-slate-900 text-slate-100">Bank Transfer</option>
              <option value="Cash" className="bg-slate-900 text-slate-100">Cash</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border border-slate-700/60 rounded-xl px-2 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-200 dark:text-slate-200 light:text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="newest" className="bg-slate-900 text-slate-100">Newest Date</option>
              <option value="oldest" className="bg-slate-900 text-slate-100">Oldest Date</option>
              <option value="highest" className="bg-slate-900 text-slate-100">Highest Amount</option>
              <option value="lowest" className="bg-slate-900 text-slate-100">Lowest Amount</option>
            </select>
          </div>

        </div>
      </div>

      {/* Expense List Feed */}
      <div className="glass-card rounded-2xl p-4 divide-y divide-slate-800/60">
        <AnimatePresence>
          {filteredExpenses.map((exp) => (
            <motion.div
              key={exp.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="py-3.5 px-3 rounded-xl hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4 group"
            >
              {/* Left Item Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0"
                  style={{ 
                    backgroundColor: `${CATEGORY_COLORS[exp.category]}18`, 
                    color: CATEGORY_COLORS[exp.category],
                    border: `1px solid ${CATEGORY_COLORS[exp.category]}35`
                  }}
                >
                  {exp.title.charAt(0)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 truncate">
                      {exp.title}
                    </h4>
                    <span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0"
                      style={{ 
                        backgroundColor: `${CATEGORY_COLORS[exp.category]}20`, 
                        color: CATEGORY_COLORS[exp.category] 
                      }}
                    >
                      {exp.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span>{exp.date}</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      {paymentIcons[exp.paymentMethod]}
                      {exp.paymentMethod}
                    </span>
                    {exp.notes && <span className="truncate italic hidden sm:inline text-slate-400">"{exp.notes}"</span>}
                  </div>
                </div>
              </div>

              {/* Right Item Amount & Action Buttons */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-base font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
                  {formatCurrency(exp.amount, currency)}
                </span>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditExpense(exp)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Edit Expense"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Expense"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No transactions match your search</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or logging a new expense.</p>
          </div>
        )}
      </div>

    </div>
  );
};
