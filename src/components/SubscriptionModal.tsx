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
              {initialSub ? 'Edit Subscription' : 'Add Recurring Subscription'}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
            
            {/* Service Name */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Service / App Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., GitHub Copilot, Netflix, Figma"
                className="w-full bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-zinc-600"
              />
            </div>

            {/* Amount & Cadence Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-300 mb-1">Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="19.99"
                  className="w-full bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono font-bold tracking-tight tabular-nums focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1">Billing Cadence</label>
                <select
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                  className="w-full bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-zinc-600 cursor-pointer"
                >
                  <option value="monthly" className="bg-zinc-900 text-zinc-100">Monthly</option>
                  <option value="annual" className="bg-zinc-900 text-zinc-100">Annual</option>
                </select>
              </div>
            </div>

            {/* Category & Next Billing Date Grid */}
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
                <label className="block font-bold text-zinc-300 mb-1">Next Billing Date</label>
                <input
                  type="date"
                  required
                  value={nextBillingDate}
                  onChange={(e) => setNextBillingDate(e.target.value)}
                  className="w-full bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Value Evaluation Tag</label>
              <div className="flex gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setTag('keep')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    tag === 'keep'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  KEEP (High Value)
                </button>
                <button
                  type="button"
                  onClick={() => setTag('reevaluate')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    tag === 'reevaluate'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  RE-EVALUATE
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Shared family plan, cancel before trial"
                className="w-full bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-zinc-600"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all border border-emerald-500/30"
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
