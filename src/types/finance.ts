export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP';

export type Category = 
  | 'Housing'
  | 'Food & Dining'
  | 'Subscriptions & Tech'
  | 'Transportation'
  | 'Entertainment'
  | 'Health & Utilities'
  | 'Shopping'
  | 'General';

export type PaymentMethod = 'Card' | 'Cash' | 'UPI' | 'Bank';

export type BillingCycle = 'monthly' | 'annual';

export type SubscriptionTag = 'keep' | 'reevaluate';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  nextBillingDate: string; // YYYY-MM-DD
  category: Category;
  status: 'active' | 'paused';
  tag: SubscriptionTag;
  notes?: string;
}

export interface Budget {
  monthlyTarget: number;
  categoryBudgets: Record<Category, number>;
}

export interface AppData {
  currency: Currency;
  theme: 'dark' | 'light';
  expenses: Expense[];
  subscriptions: Subscription[];
  budget: Budget;
}

export const CURRENCY_CONFIG: Record<Currency, { symbol: string; label: string; rateFromUSD: number }> = {
  USD: { symbol: '$', label: 'USD ($)', rateFromUSD: 1.0 },
  INR: { symbol: '₹', label: 'INR (₹)', rateFromUSD: 83.5 },
  EUR: { symbol: '€', label: 'EUR (€)', rateFromUSD: 0.92 },
  GBP: { symbol: '£', label: 'GBP (£)', rateFromUSD: 0.78 },
};

export const CATEGORIES: Category[] = [
  'Housing',
  'Food & Dining',
  'Subscriptions & Tech',
  'Transportation',
  'Entertainment',
  'Health & Utilities',
  'Shopping',
  'General',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  'Housing': '#6366f1', // Indigo
  'Food & Dining': '#f59e0b', // Amber
  'Subscriptions & Tech': '#10b981', // Emerald
  'Transportation': '#3b82f6', // Blue
  'Entertainment': '#ec4899', // Pink
  'Health & Utilities': '#14b8a6', // Teal
  'Shopping': '#8b5cf6', // Purple
  'General': '#64748b', // Slate
};
