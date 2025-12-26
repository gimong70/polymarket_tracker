# 📈 Polymarket Tracker

A premium, futuristic web application to track live prediction market data from Polymarket with advanced filtering and real-time insights.

## ✨ Features

- **Live Data Tracking**: Fetches real-time data from Polymarket's Gamma and CLOB APIs.
- **Advanced Filtering**:
  - **Category-based**: Trending, Politics, Crypto, Finance, Tech, Economy, Trump.
  - **Time Frames**: 1h, 3h, 6h, 24h, 1w.
  - **Probability Change**: 10-30%, 30-50%, 50%+ change detection.
- **Strict Active Filter**: Automatically excludes all resolved or closed markets.
- **Premium UI**: Modern dark-mode interface with glassmorphism and Korean localized support.
- **TypeScript Optimized**: Robust type checking and safe API data handling.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gimong70/polymarket_tracker.git
   cd polymarket_tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Vanilla CSS (Modern Design Tokens)
- **API**: Axios (Gamma & CLOB API Integration)

## 📝 License

Distributed under the MIT License.
