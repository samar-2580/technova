import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Expense, Category, PaymentMethod, CATEGORIES } from '../types/finance';
import { X, Plus, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExpense?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, initialExpense }) => {
  const { addExpense, updateExpense } = useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food & Dining');
  const [date, setDate] = useState('2026-09-14');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialExpense) {
      setTitle(initialExpense.title);
      setAmount(initialExpense.amount.toString());
      setCategory(initialExpense.category);
      setDate(initialExpense.date);
      setPaymentMethod(initialExpense.paymentMethod);
      setNotes(initialExpense.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Food & Dining');
      setDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod('Card');
      setNotes('');
    }
  }, [initialExpense, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) return;

    if (initialExpense) {
      updateExpense({
        ...initialExpense,
        title,
        amount: numAmount,
        category,
        date,
        paymentMethod,
        notes,
      });
    } else {
      addExpense({
        title,
        amount: numAmount,
        category,
        date,
        paymentMethod,
        notes,
      });
    }
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
          className="glass-panel w-full max-w-md rounded-2xl p-6 border border-zinc-800/80 shadow-2xl relative"
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
            <h3 className="text-sm font-mono font-bold text-zinc-100 uppercase tracking-wider">
              {initialExpense ? 'Edit Expense' : 'Log New Expense'}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
            
            {/* Title */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Expense Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Whole Foods Market, Uber Ride"
                className="w-full bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-zinc-600"
              />
            </div>

            {/* Amount & Date Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-300 mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono font-bold tracking-tight tabular-nums focus:outline-none focus:border-zinc-600"
                />
              </div>
              <div>
                <label className="block font-bold text-zinc-300 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>

            {/* Category & Payment Method Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-zinc-600 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-zinc-900 text-zinc-100">{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-zinc-600 cursor-pointer"
                >
                  <option value="Card" className="bg-zinc-900 text-zinc-100">Card</option>
                  <option value="UPI" className="bg-zinc-900 text-zinc-100">UPI</option>
                  <option value="Bank" className="bg-zinc-900 text-zinc-100">Bank Transfer</option>
                  <option value="Cash" className="bg-zinc-900 text-zinc-100">Cash</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Team coffee, tax deductible"
                className="w-full bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-zinc-600"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all border border-emerald-500/30"
              >
                {initialExpense ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{initialExpense ? 'Update Expense' : 'Save Expense'}</span>
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
