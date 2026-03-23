# 🎨 PakStocks Frontend (AI-Powered Stock Dashboard)

A modern, responsive React frontend for a stock intelligence platform focused on Pakistan Stock Exchange (PSX). Built with performance, usability, and future AI integration in mind.

<br>

## 🚀 Features

### 🔐 Authentication

* Google OAuth login
* Persistent user session (localStorage)

### 📊 Dashboard

* KSE-100 overview
* Market summary
* Top movers
* Personalized watchlist

### 🔔 Alerts System

* Create price alerts (above/below)
* Real-time alert checking
* Browser notifications + sound alerts
* Visual progress tracking

### 💼 Portfolio Management

* Buy & Sell stocks
* Real-time valuation
* Profit/Loss tracking
* Interactive charts (Pie + Sparkline)

### 🎯 UX Enhancements

* Smooth animations (Framer Motion)
* Dark mode support
* Responsive layout (mobile → desktop)
* Interactive UI components (shadcn/ui)

<br>

## 🏗️ Tech Stack

* **Framework:** React (Vite)
* **Routing:** React Router
* **State/Data:** React Query
* **UI:** Tailwind CSS + shadcn/ui
* **Animations:** Framer Motion
* **Charts:** Recharts
* **Auth:** Google OAuth

<br>

## 📁 Project Structure

```
src/
│
├── components/        # Reusable UI components
├── pages/             # Application pages
├── lib/               # API helpers
├── assets/            # Static assets
├── App.jsx            # Routing setup
├── main.jsx           # App entry point
├── index.css          # Global styles
```

<br>

## ⚙️ Installation

```bash
git clone <repo-url>
cd frontend
npm install
```

<br>

## 🔐 Environment Variables

Create a `.env` file:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_BASE_URL=http://localhost:5000/api
```

<br>

## ▶️ Run App

```bash
npm run dev
```

App runs at:

```
http://localhost:5173
```

<br>

## 🔗 API Integration

The frontend communicates with backend APIs via Axios instance:

```
lib/api.js
```

All endpoints are prefixed with:

```
/api
```

---

## 🧩 Key Components

### Dashboard

* `KSE100Card`
* `MarketSummuryCard`
* `WatchlistCard`
* `TopMoversCard`

### Portfolio

* Real-time holdings table
* Pie chart (sector allocation)
* Sparkline charts (mini trends)

### Alerts

* Smart alert creation
* Progress tracking UI
* Notification system

<br>

## 🧠 UX Highlights

* ⚡ Auto-fill stock price when selecting stock
* 🔔 Real-time alert triggering with sound
* 📊 Visual profit/loss indicators
* 🎯 Progress-based alert tracking

<br>

## 🧠 Future Improvements (AI Roadmap)

* AI stock recommendations (dashboard widget)
* Portfolio insights (risk, sector analysis)
* Smart alerts (prediction-based triggers)
* AI assistant/chatbot

<br>

## 🧪 Performance Notes

* Uses React Query for caching & refetching
* Lazy updates instead of full reloads
* Optimized rendering with memoization

<br>

## 👨‍💻 Author

Mubeen Channa - MERN Stack Dev