# PulseWatch — Smart Market Watchlist

> **Tagline:** *Know what changed. Know what matters.*

PulseWatch is an intelligent market briefing and smart watchlist platform built for the **"Code, by Groww"** hackathon. 

Unlike traditional financial watchlists that overwhelm traders with raw tables of fluctuating numbers, PulseWatch transforms market data into a personalized **Return Brief**. When users return after being away, PulseWatch instantly answers two fundamental questions:
1. **WHAT changed** since their last visit?
2. **WHY does it matter** (quantified context: z-score volatility multipliers, 20-day volume anomalies, away price delta, and market signals)?

---

## 🎯 1-Minute Reviewer Evaluation Guide (Hackathon Demo Flow)

Reviewers can test the core intelligence of PulseWatch in **6 simple steps**:

1. **Open Dashboard**:
   - Upon initial load, PulseWatch displays the clean **Normal State**:
     > *"Nothing needs your attention right now. All 5 stocks in your watchlist are moving within their expected ranges."*
     *(Counters: 🔴 0 SIGNIFICANT, 🟡 0 WORTH WATCHING, 🟢 5 NORMAL)*

2. **Open Market Shock Controls**:
   - Click the floating **"Market Shock Controls"** button in the bottom-right corner.

3. **Trigger Market Shock**:
   - Click **`📉 Simulate TCS Shock (-5.84%, Score 91)`**.

4. **Observe Real-Time Dashboard Intelligence Update**:
   - **Return Brief** instantly updates: > *"1 stock needs your attention. PulseWatch detected unusual movement since your last check."*
   - **Counters** update: **1 SIGNIFICANT**, **4 NORMAL**.
   - **"WHAT DESERVES YOUR ATTENTION"** section appears above the watchlist displaying compact alert card:
     - Price Shift: **₹4,207 → ₹3,962** (↓ -5.84%)
     - Change Score: **91 / 100** *(Hover over **(i)** info icon for score methodology)*
     - Severity: **🔴 SIGNIFICANT**
     - Quantified reasons (*"Price movement is unusually large"*, *"Trading volume is above normal"*, *"Volatility is elevated"*).

5. **Inspect "Why?" & Market Signals Verdict**:
   - Click **`[View Details →]`** on the TCS card to open the Stock Detail Modal.
   - Review the **MARKET SIGNALS** checklist (`Price deviation: High`, `Volume anomaly: 2.8× normal`, `Volatility: +42%`) and the **PULSEWATCH VERDICT**:
     > *"Unusual movement detected. This stock deserves investigation."*

6. **Reset Market State**:
   - Click **`🔄 Reset Market to Normal State`** in the control drawer.
   - Dashboard returns immediately to 0 Significant, 5 Normal state.

---

## 💻 Local Setup & Execution Guide for Reviewers

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local MongoDB service or MongoDB Atlas connection string)

### Step 1: Install Dependencies
From the project root folder:
```bash
npm run setup
```
*(Installs dependencies for root, server, and client)*

### Step 2: Seed Reviewer Demo Account & Baseline State
```bash
npm run seed
```
*(Creates reviewer user `demo@pulsewatch.io` / `Password123!` with a 5-stock baseline watchlist)*

### Step 3: Start Development Application
```bash
npm run dev
```
- **Frontend URL:** [http://localhost:3000](http://localhost:3000)
- **Backend REST API:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)

### Step 4: Login
- Click **"1-Click Instant Access"** on the login screen (or log in with `demo@pulsewatch.io` / `Password123!`).

---

## 🧪 Testing & Verification Commands

### Run Unit Tests (`Vitest`)
Tests the mathematical correctness of `MeaningfulChangeEngine` (z-score calculation, volume anomaly multipliers, away deltas, and edge case handling):
```bash
npm test
```

### Validate Production Build (`Vite`)
```bash
npm run build
```

---

## 🧠 Meaningful Change Engine Formula

The engine calculates a normalized **Change Score (0 - 100)**:

$$\text{Change Score} = S_{\text{price}} + S_{\text{volume}} + S_{\text{away}} + S_{\text{signals}}$$

1. **Price Movement z-Score ($S_{\text{price}}$, max 35 pts)**:
   $$z = \frac{|\Delta\%_{\text{today}}|}{\sigma_{\text{daily}}}$$
   Measures movement standard deviation relative to baseline volatility.
2. **Volume Anomaly Ratio ($S_{\text{volume}}$, max 25 pts)**:
   $$\text{Ratio} = \frac{\text{Volume}_{\text{today}}}{\text{Volume}_{\text{20D Avg}}}$$
   Ratios $\ge 1.8\times$ trigger volume anomaly warnings.
3. **Away Movement Delta ($S_{\text{away}}$, max 20 pts)**:
   $$\Delta\%_{\text{away}} = \frac{\text{Price}_{\text{now}} - \text{Price}_{\text{lastSeen}}}{\text{Price}_{\text{lastSeen}}} \times 100$$
4. **Technical Signals ($S_{\text{signals}}$, max 20 pts)**:
   Proximity to 52-week high/low limits.

### Severity Classification:
- 🔴 **SIGNIFICANT** (Score 70–100): Requires immediate trader attention.
- 🟡 **WORTH WATCHING** (Score 30–69): Moderate shift worth keeping an eye on.
- 🟢 **NORMAL** (Score 0–29): Fluctuation within standard expected bounds.

---

## 📁 Repository Structure

```
pulsewatch/
├── server/
│   ├── src/
│   │   ├── config/          # Threshold constants & DB connection
│   │   ├── models/          # User, Watchlist, UserStockState, MarketSnapshot
│   │   ├── providers/       # DemoMarketDataProvider, MarketDataProviderFactory
│   │   ├── services/        # MeaningfulChangeEngine, MarketDataService, ChangeService, CacheService
│   │   ├── controllers/     # REST API controllers
│   │   ├── middleware/      # Auth & Error handling
│   │   ├── routes/          # Versioned REST router (/api/v1/*)
│   │   ├── seed.js          # Seed script for setup
│   │   └── app.js           # Server entry point
│   └── tests/               # Vitest unit & integration tests
└── client/
    ├── src/
    │   ├── api/             # Axios API client
    │   ├── components/      # Navbar, ReturnBriefHeader, SignificantChangeCard, WatchlistTable, StockDetailModal, DemoControlBar
    │   ├── context/         # AuthContext & WatchlistContext
    │   ├── pages/           # Dashboard & AuthPage
    │   └── styles/          # Tailwind CSS theme tokens
    └── vite.config.js
```

---

## 🔗 REST API Reference (`/api/v1`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register user | No |
| `POST` | `/api/v1/auth/login` | Login & issue JWT | No |
| `GET` | `/api/v1/changes` | Get personalized Return Brief | Yes |
| `POST` | `/api/v1/session/acknowledge` | Acknowledge session changes | Yes |
| `GET` | `/api/v1/watchlists` | Get user watchlists | Yes |
| `POST` | `/api/v1/watchlists/:id/stocks` | Add stock to watchlist | Yes |
| `DELETE` | `/api/v1/watchlists/:id/stocks/:symbol` | Remove stock from watchlist | Yes |
| `GET` | `/api/v1/market/:symbol` | Get market quote with freshness | No |
| `GET` | `/api/v1/market/:symbol/history` | Get chart bars (1D-1Y) | No |
| `POST` | `/api/v1/market/simulate-shock` | Inject live shock for testing | No |
