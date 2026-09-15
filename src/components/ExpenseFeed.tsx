import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Expense, PaymentMethod, CATEGORIES, CATEGORY_COLORS } from '../types/finance';
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
    Card: <CreditCard className="w-3.5 h-3.5 text-zinc-400" />,
    Cash: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
    UPI: <Smartphone className="w-3.5 h-3.5 text-zinc-400" />,
    Bank: <Building2 className="w-3.5 h-3.5 text-zinc-400" />,
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
    <div className="space-y-4">
      
      {/* Header Bar */}
      <div className="glass-card rounded-xl p-5 border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              <Receipt className="w-4 h-4 text-emerald-400" />
            </span>
            <h2 className="text-base font-mono font-bold text-zinc-100 uppercase tracking-wider">
              Expense Feed
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            High-density ledger with real-time multi-field search and category sorting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-right">
            <span className="text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider block">
              Filtered Total ({filteredExpenses.length})
            </span>
            <span className="text-sm font-mono font-bold text-emerald-400 tabular-nums">
              {formatCurrency(totalFilteredAmount, currency)}
            </span>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow-sm border border-emerald-500/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-zinc-900/90 text-zinc-200 placeholder:text-zinc-500 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono focus:outline-none focus:border-zinc-600"
          />
        </div>

        {/* Filters & Sorting controls */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          
          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-zinc-200 text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-zinc-900 text-zinc-100">
                All Categories
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-zinc-900 text-zinc-100">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1">
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="bg-transparent text-zinc-200 text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-zinc-900 text-zinc-100">All Payment Methods</option>
              <option value="Card" className="bg-zinc-900 text-zinc-100">Card</option>
              <option value="UPI" className="bg-zinc-900 text-zinc-100">UPI</option>
              <option value="Bank" className="bg-zinc-900 text-zinc-100">Bank Transfer</option>
              <option value="Cash" className="bg-zinc-900 text-zinc-100">Cash</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-zinc-200 text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="newest" className="bg-zinc-900 text-zinc-100">Newest Date</option>
              <option value="oldest" className="bg-zinc-900 text-zinc-100">Oldest Date</option>
              <option value="highest" className="bg-zinc-900 text-zinc-100">Highest Amount</option>
              <option value="lowest" className="bg-zinc-900 text-zinc-100">Lowest Amount</option>
            </select>
          </div>

        </div>
      </div>

      {/* Expense List Feed */}
      <div className="glass-card rounded-xl p-3 border border-zinc-800/80 divide-y divide-zinc-800/60">
        <AnimatePresence>
          {filteredExpenses.map((exp) => (
            <motion.div
              key={exp.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="py-2.5 px-3 rounded-lg hover:bg-zinc-900/60 transition-colors flex items-center justify-between gap-3 group"
            >
              {/* Left Item Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs flex-shrink-0"
                  style={{ 
                    backgroundColor: `${CATEGORY_COLORS[exp.category]}15`, 
                    color: CATEGORY_COLORS[exp.category],
                    border: `1px solid ${CATEGORY_COLORS[exp.category]}30`
                  }}
                >
                  {exp.title.charAt(0)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-xs text-zinc-100 truncate">
                      {exp.title}
                    </h4>
                    <span 
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ 
                        backgroundColor: `${CATEGORY_COLORS[exp.category]}15`, 
                        color: CATEGORY_COLORS[exp.category] 
                      }}
                    >
                      {exp.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400 mt-0.5">
                    <span>{exp.date}</span>
                    <span className="flex items-center gap-1 text-zinc-400">
                      {paymentIcons[exp.paymentMethod]}
                      {exp.paymentMethod}
                    </span>
                    {exp.notes && <span className="truncate italic hidden sm:inline text-zinc-500">"{exp.notes}"</span>}
                  </div>
                </div>
              </div>

              {/* Right Item Amount & Action Buttons */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-mono font-bold text-zinc-100 tracking-tight tabular-nums">
                  {formatCurrency(exp.amount, currency)}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditExpense(exp)}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    title="Edit Expense"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="p-1 rounded bg-zinc-800 hover:bg-rose-900/40 text-zinc-400 hover:text-rose-400"
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
          <div className="text-center py-10 font-mono text-xs text-zinc-500">
            No transactions match your search criteria.
          </div>
        )}
      </div>

    </div>
  );
};
