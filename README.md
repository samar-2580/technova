# ⚡ TechNova Finance — Personal Finance & Subscription OS

> **Tagline:** Personal Finance & Subscription Management Operating System  
> **Internship Project:** Refined for the **Decode Labs Internship Evaluation**

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite 6](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS 3.4](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-SPA_Rewrites-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![100% Client-Side LocalStorage](https://img.shields.io/badge/Storage-100%25_Client--Side_LocalStorage-10B981?style=for-the-badge&logo=shieldcheck&logoColor=white)](#-data-engine--zero-server-privacy)

---

## 📌 Executive Overview

**TechNova Finance** is an ultra-modern, high-density personal financial operating system engineered as a 100% client-side Single Page Application (SPA). Developed as part of the **Decode Labs internship evaluation**, this application transformed a legacy landing page concept into a fully interactive, production-ready financial tracking tool.

Designed around a bespoke **obsidian/zinc fintech aesthetic** (`#09090b` background, `#121215` card surfaces, `border-zinc-800/80` hairline borders, and emerald `#10b981` / amber `#f59e0b` accents), TechNova Finance combines real-time budget health monitoring, subscription value evaluation, automated renewal alerts, spend velocity forecasting, and multi-currency conversion without requiring any external backend server or user login.

---

## 📸 Visual Showcase

| Viewport / Module | Description & Interface |
| :--- | :--- |
| **Main Overview & Metric Hub**<br>`dashboard.png` | ![Dashboard Overview](docs/screenshots/dashboard.png) |
| **Subscription Control Center**<br>`subscriptions.png` | ![Subscription Control Center](docs/screenshots/subscriptions.png) |
| **Analytics & Spend Trajectory**<br>`analytics.png` | ![Analytics & Visuals](docs/screenshots/analytics.png) |
| **Mobile Viewport (375px)**<br>`mobile-view.png` | ![Mobile Responsive View](docs/screenshots/mobile-view.png) |

---

## ✨ Feature Matrix

### 1. 📊 Metric Hub & Budget Health
- **Real-Time Stat Cards**: Live display of **Monthly Spend**, **Subscription Run-Rate**, **Projected Annual Burn**, and **Remaining Monthly Budget**.
- **Dynamic Threshold Alerts**: Animated progress meter shifting automatically through three health states:
  - 🟢 **Optimal** (`< 70%` spent): Emerald status badge and progress gradient.
  - 🟡 **Approaching Limit** (`70% – 90%` spent): Amber caution alerts.
  - 🔴 **Critical Warning** (`> 90%` spent): Pulsing crimson alerts.
- **Run-Rate Projections**: Automatic 12x annual burn calculation and custom monthly target modifier modal.

### 2. 🛡️ Subscription Watchdog & Control Center
- **Renewal Radar (< 7 Days)**: Proactive warning panel alerting users to subscriptions renewing within 7 days with urgency indicators (`Due Today`, `In 2 days`).
- **Billing Cadence Normalizer**: Seamless toggle between monthly and annual cycles with auto-normalized `/mo` impact metrics.
- **Value Evaluation Tags**: 1-click value tag toggles:
  - `[KEEP]` (High utility, essential services).
  - `[RE-EVALUATE]` (Low ROI or under-utilized services flagged for cancellation).
- **Search & Filter Controls**: Real-time filtering by billing cadence, evaluation tag, and keyword search.

### 3. 🧾 Transaction Feed & Smart Ledgers
- **Real-Time Feed & Filters**: Multi-field live search across title, notes, date, category, and payment method (`Card`, `UPI`, `Bank`, `Cash`).
- **Multi-Sort Logic**: Instant sorting by Newest Date, Oldest Date, Highest Amount, or Lowest Amount.
- **Framer Motion Modals**: Smooth animated dialogs for logging, editing, and deleting expenses with full field validation.

### 4. 💱 Data Engine & Zero-Server Privacy
- **1-Click Demo Data Seeder**: Populates 27+ realistic transactions and 6 recurring subscriptions with confetti visual celebration.
- **Multi-Currency Engine**: Instant live formatting across `$ USD`, `₹ INR`, `€ EUR`, and `£ GBP`.
- **CSV Data Exporter**: 1-click structured CSV file generation for local backup or financial auditing.
- **Zero-Server Privacy Architecture**: 100% local persistence via HTML5 `localStorage` wrapped in defensive try/catch blocks with automatic seed data fallbacks.

---

## 🏗️ Technical Architecture & Data Flow

TechNova Finance is structured around a unidirectional data flow powered by React Context and custom local storage adapters:

```
┌─────────────────────────────────────────────────────────────────┐
│                       TechNova App Shell                        │
│         (React 19 + Framer Motion + Tailwind CSS 3.4)           │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                         FinanceContext                          │
│     (State Provider + Reactive Dispatchers + Hot Toasts)        │
└───────────────────┬─────────────────────────┬───────────────────┘
                    │                         │
┌───────────────────▼───────────┐ ┌───────────▼───────────────────┐
│     Services & LocalStorage   │ │     Recharts & Visuals Engine   │
│ (Defensive Fallback & CSV)    │ │   (Velocity Curves & Donut)     │
└───────────────────────────────┘ └───────────────────────────────┘
```

### Component Structure
```
src/
├── App.tsx                     # Main layout & router tab switcher
├── main.tsx                    # Application entrypoint
├── index.css                   # Obsidian/zinc custom variables & glassmorphism
├── context/
│   └── FinanceContext.tsx      # Centralized React state provider
├── services/
│   └── storage.ts              # LocalStorage DAO, CSV export, currency formatter
├── types/
│   └── finance.ts              # TypeScript schemas, enums, & currency configs
└── components/
    ├── Navbar.tsx              # Desktop header navigation & action toolbar
    ├── MobileNav.tsx           # Docked frosted-glass bottom mobile navigation
    ├── MetricHub.tsx           # Top stat cards & dynamic budget health bar
    ├── AnalyticsCharts.tsx     # Recharts Area & Donut visual analytics
    ├── DashboardLedgers.tsx    # 50/50 split renewals & recent transactions
    ├── SubscriptionHub.tsx     # Subscription control center & Renewal Radar
    ├── ExpenseFeed.tsx         # High-density transaction feed & filters
    ├── BudgetModal.tsx         # Target budget modifier dialog
    ├── ExpenseModal.tsx        # Expense add/edit modal
    └── SubscriptionModal.tsx   # Subscription add/edit modal
```

---

## 💻 Local Setup & Development

Follow these steps to run TechNova Finance locally on your machine:

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/samar-2580/technova.git
cd technova
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Run TypeScript Check & Production Build
```bash
npx tsc --noEmit
npm run build
```
The optimized production bundle will be output to the `dist/` directory.

### 5. Automated Playwright Screenshot Capture
```bash
npm run capture-screenshots
```
This launches Chromium in headless mode, boots the local preview server, and updates all screenshots in `docs/screenshots/`.

---

## 📄 License & Attribution

Developed for **TechNova OS** as part of the **Decode Labs Internship Program**. Built with React 19, Vite, TypeScript, Framer Motion, and Tailwind CSS.
