import { AppData, Expense, Subscription, Budget, Currency, CURRENCY_CONFIG } from '../types/finance';

const STORAGE_KEY = 'technova_finance_data_v1';

export const INITIAL_DEMO_DATA: AppData = {
  currency: 'USD',
  theme: 'dark',
  budget: {
    monthlyTarget: 4200,
    categoryBudgets: {
      'Housing': 1600,
      'Food & Dining': 750,
      'Subscriptions & Tech': 350,
      'Transportation': 300,
      'Entertainment': 300,
      'Health & Utilities': 400,
      'Shopping': 350,
      'General': 150,
    },
  },
  subscriptions: [
    {
      id: 'sub-1',
      name: 'GitHub Copilot Enterprise',
      amount: 19.00,
      billingCycle: 'monthly',
      nextBillingDate: '2026-09-17', // 3 days away - Renewal Radar alert
      category: 'Subscriptions & Tech',
      status: 'active',
      tag: 'keep',
      notes: 'Essential AI pair programmer for dev work'
    },
    {
      id: 'sub-2',
      name: 'ChatGPT Plus',
      amount: 20.00,
      billingCycle: 'monthly',
      nextBillingDate: '2026-09-19', // 5 days away
      category: 'Subscriptions & Tech',
      status: 'active',
      tag: 'keep',
      notes: 'GPT-4o & Reasoning models access'
    },
    {
      id: 'sub-3',
      name: 'Netflix 4K Ultra HD',
      amount: 22.99,
      billingCycle: 'monthly',
      nextBillingDate: '2026-09-22', // 8 days away
      category: 'Entertainment',
      status: 'active',
      tag: 'reevaluate',
      notes: 'Shared family plan - check usage'
    },
    {
      id: 'sub-4',
      name: 'Spotify Premium Family',
      amount: 16.99,
      billingCycle: 'monthly',
      nextBillingDate: '2026-09-28',
      category: 'Entertainment',
      status: 'active',
      tag: 'keep',
      notes: 'Music & podcast streaming'
    },
    {
      id: 'sub-5',
      name: 'AWS Cloud Infrastructure',
      amount: 145.50,
      billingCycle: 'monthly',
      nextBillingDate: '2026-10-01',
      category: 'Subscriptions & Tech',
      status: 'active',
      tag: 'keep',
      notes: 'Production VPS and S3 storage'
    },
    {
      id: 'sub-6',
      name: 'Equinox Gym Membership',
      amount: 120.00,
      billingCycle: 'monthly',
      nextBillingDate: '2026-09-16', // 2 days away - URGENT RADAR
      category: 'Health & Utilities',
      status: 'active',
      tag: 'reevaluate',
      notes: 'Consider switching to local gym'
    },
  ],
  expenses: [
    { id: 'exp-1', title: 'Whole Foods Market', amount: 142.50, category: 'Food & Dining', date: '2026-09-14', paymentMethod: 'Card', notes: 'Weekly groceries' },
    { id: 'exp-2', title: 'Equinox Gym Membership', amount: 120.00, category: 'Health & Utilities', date: '2026-09-14', paymentMethod: 'Bank', notes: 'Auto-debit recurring' },
    { id: 'exp-3', title: 'Uber Ride to Downtown Tech Summit', amount: 28.40, category: 'Transportation', date: '2026-09-13', paymentMethod: 'UPI', notes: 'Business travel' },
    { id: 'exp-4', title: 'Starbucks Coffee & Snacks', amount: 14.80, category: 'Food & Dining', date: '2026-09-13', paymentMethod: 'Card', notes: 'Team coffee sync' },
    { id: 'exp-5', title: 'AWS Cloud Infrastructure', amount: 145.50, category: 'Subscriptions & Tech', date: '2026-09-12', paymentMethod: 'Card', notes: 'Cloud server hosting' },
    { id: 'exp-6', title: 'Blue Bottle Espresso', amount: 8.50, category: 'Food & Dining', date: '2026-09-11', paymentMethod: 'UPI', notes: 'Morning coffee' },
    { id: 'exp-7', title: 'Apartment Monthly Rent', amount: 1550.00, category: 'Housing', date: '2026-09-01', paymentMethod: 'Bank', notes: 'Primary housing expense' },
    { id: 'exp-8', title: 'Trader Joe\'s Groceries', amount: 89.60, category: 'Food & Dining', date: '2026-09-10', paymentMethod: 'Card', notes: 'Organic produce' },
    { id: 'exp-9', title: 'Gas Station Fuel', amount: 48.00, category: 'Transportation', date: '2026-09-09', paymentMethod: 'Card', notes: 'Full tank refill' },
    { id: 'exp-10', title: 'Apple Store - USB-C Hub & Cables', amount: 79.00, category: 'Shopping', date: '2026-09-08', paymentMethod: 'Card', notes: 'Work hardware accessories' },
    { id: 'exp-11', title: 'Dinner at Italian Trattoria', amount: 112.40, category: 'Food & Dining', date: '2026-09-07', paymentMethod: 'Card', notes: 'Weekend dinner with friends' },
    { id: 'exp-12', title: 'City Electric Utility Bill', amount: 118.20, category: 'Health & Utilities', date: '2026-09-05', paymentMethod: 'Bank', notes: 'August electricity statement' },
    { id: 'exp-13', title: 'High-Speed Fiber Internet', amount: 85.00, category: 'Health & Utilities', date: '2026-09-04', paymentMethod: 'Card', notes: '1 Gbps internet' },
    { id: 'exp-14', title: 'Cinema IMAX Movie Tickets', amount: 42.00, category: 'Entertainment', date: '2026-09-03', paymentMethod: 'UPI', notes: 'Weekend movie night' },
    { id: 'exp-15', title: 'ChatGPT Plus Subscription', amount: 20.00, category: 'Subscriptions & Tech', date: '2026-09-02', paymentMethod: 'Card', notes: 'AI assistant subscription' },
    { id: 'exp-16', title: 'GitHub Copilot Subscription', amount: 19.00, category: 'Subscriptions & Tech', date: '2026-09-02', paymentMethod: 'Card', notes: 'Developer tool' },
    { id: 'exp-17', title: 'Steam Summer Game Sale', amount: 59.99, category: 'Entertainment', date: '2026-08-28', paymentMethod: 'Card', notes: 'Indie game package' },
    { id: 'exp-18', title: 'Uniqlo Casual Wear', amount: 134.00, category: 'Shopping', date: '2026-08-26', paymentMethod: 'Card', notes: 'Autumn wardrobe items' },
    { id: 'exp-19', title: 'Metro Transit Monthly Pass', amount: 90.00, category: 'Transportation', date: '2026-08-25', paymentMethod: 'Cash', notes: 'Public transit pass' },
    { id: 'exp-20', title: 'Sushi Bar Lunch', amount: 36.50, category: 'Food & Dining', date: '2026-08-22', paymentMethod: 'UPI', notes: 'Quick lunch' },
    { id: 'exp-21', title: 'Dental Cleaning & Checkup', amount: 150.00, category: 'Health & Utilities', date: '2026-08-20', paymentMethod: 'Card', notes: 'Health co-pay' },
    { id: 'exp-22', title: 'Home Depot Hardware & Bulbs', amount: 64.30, category: 'Housing', date: '2026-08-18', paymentMethod: 'Card', notes: 'Apartment maintenance' },
    { id: 'exp-23', title: 'Barnes & Noble Tech Books', amount: 45.00, category: 'General', date: '2026-08-15', paymentMethod: 'Card', notes: 'System architecture reading' },
    { id: 'exp-24', title: 'Uber Eats Late Night Order', amount: 32.10, category: 'Food & Dining', date: '2026-08-12', paymentMethod: 'UPI', notes: 'Late hackathon dinner' },
    { id: 'exp-25', title: 'Spotify Family Subscription', amount: 16.99, category: 'Entertainment', date: '2026-08-10', paymentMethod: 'Card', notes: 'Audio streaming' },
    { id: 'exp-26', title: 'Netflix 4K Subscription', amount: 22.99, category: 'Entertainment', date: '2026-08-08', paymentMethod: 'Card', notes: 'Video streaming' },
    { id: 'exp-27', title: 'Amazon Office Desk Accessories', amount: 88.50, category: 'Shopping', date: '2026-08-05', paymentMethod: 'Card', notes: 'Ergonomic mousepad & stand' },
  ]
};

export const getStoredData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredData(INITIAL_DEMO_DATA);
      return INITIAL_DEMO_DATA;
    }
    const parsed = JSON.parse(raw) as AppData;
    return parsed;
  } catch (error) {
    console.error('Error reading localStorage:', error);
    return INITIAL_DEMO_DATA;
  }
};

export const saveStoredData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const exportToCSV = (data: AppData): void => {
  const headers = ['Type', 'ID', 'Title/Name', 'Amount', 'Category', 'Date/NextBilling', 'PaymentMethod/Status', 'Tag/Notes'];
  const rows: string[][] = [];

  // Expenses
  data.expenses.forEach(exp => {
    rows.push([
      'Expense',
      exp.id,
      `"${exp.title.replace(/"/g, '""')}"`,
      exp.amount.toString(),
      exp.category,
      exp.date,
      exp.paymentMethod,
      `"${(exp.notes || '').replace(/"/g, '""')}"`
    ]);
  });

  // Subscriptions
  data.subscriptions.forEach(sub => {
    rows.push([
      'Subscription',
      sub.id,
      `"${sub.name.replace(/"/g, '""')}"`,
      sub.amount.toString(),
      sub.category,
      sub.nextBillingDate,
      sub.status,
      `"[Tag: ${sub.tag}] ${(sub.notes || '').replace(/"/g, '""')}"`
    ]);
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `technova-finance-export-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatCurrency = (amountInUSD: number, currency: Currency): string => {
  const config = CURRENCY_CONFIG[currency];
  // Strict floating point rounding to prevent 19.990000000002
  const converted = Math.round((amountInUSD * config.rateFromUSD) * 100) / 100;
  
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: converted % 1 === 0 ? 0 : 2,
  }).format(converted);
};
