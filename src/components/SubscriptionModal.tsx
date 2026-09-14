import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Subscription, Category, BillingCycle, SubscriptionTag, CATEGORIES } from '../types/finance';
import { X, Plus, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSub?: Subscription | null;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, initialSub }) => {
  const { addSubscription, updateSubscription } = useFinance();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [nextBillingDate, setNextBillingDate] = useState('2026-09-20');
  const [category, setCategory] = useState<Category>('Subscriptions & Tech');
  const [tag, setTag] = useState<SubscriptionTag>('keep');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialSub) {
      setName(initialSub.name);
      setAmount(initialSub.amount.toString());
      setBillingCycle(initialSub.billingCycle);
      setNextBillingDate(initialSub.nextBillingDate);
      setCategory(initialSub.category);
      setTag(initialSub.tag);
      setNotes(initialSub.notes || '');
    } else {
      setName('');
      setAmount('');
      setBillingCycle('monthly');
      setNextBillingDate('2026-09-25');
      setCategory('Subscriptions & Tech');
      setTag('keep');
      setNotes('');
    }
  }, [initialSub, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!name.trim() || isNaN(numAmount) || numAmount <= 0) return;

    if (initialSub) {
      updateSubscription({
        ...initialSub,
        name,
        amount: numAmount,
        billingCycle,
        nextBillingDate,
        category,
        tag,
        notes,
      });
    } else {
      addSubscription({
        name,
        amount: numAmount,
        billingCycle,
        nextBillingDate,
        category,
        status: 'active',
        tag,
        notes,
      });
    }
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
          className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-700/80 shadow-2xl relative"
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <h3 className="text-base font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
              {initialSub ? 'Edit Subscription' : 'Add Recurring Subscription'}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Service Name */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">Service / App Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., GitHub Copilot, Netflix, Figma"
                className="w-full bg-slate-900/80 text-slate-100 border border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            {/* Amount & Cadence Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="19.99"
                  className="w-full bg-slate-900/80 text-slate-100 border border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Billing Cadence</label>
                <select
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                  className="w-full bg-slate-900/80 text-slate-100 border border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                >
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>

            {/* Category & Next Billing Date Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-slate-900/80 text-slate-100 border border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Next Billing Date</label>
                <input
                  type="date"
                  required
                  value={nextBillingDate}
                  onChange={(e) => setNextBillingDate(e.target.value)}
                  className="w-full bg-slate-900/80 text-slate-100 border border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">Value Evaluation Tag</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTag('keep')}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                    tag === 'keep'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  KEEP (High Value)
                </button>
                <button
                  type="button"
                  onClick={() => setTag('reevaluate')}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                    tag === 'reevaluate'
                      ? 'bg-amber-600 text-white border-amber-500 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  RE-EVALUATE
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Shared family plan, cancel before trial"
                className="w-full bg-slate-900/80 text-slate-100 border border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
              >
                {initialSub ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{initialSub ? 'Update Subscription' : 'Save Subscription'}</span>
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
