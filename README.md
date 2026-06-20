# 📈 PakStocks — Full Stack (MERN + AI) Stock Intelligence Platform

A modern, full-stack stock analysis and portfolio management platform focused on the Pakistan Stock Exchange (PSX). Built with the MERN stack and designed for progressive AI integration.

<br>

## 🚀 Overview

PakStocks enables users to:

* Track live PSX market data
* Manage watchlists and portfolios
* Set smart price alerts
* Analyze performance visually
* Prepare for AI-powered insights and recommendations

<br>

## 🧱 Tech Stack

### Frontend

* React (Vite)
* React Router
* React Query
* Tailwind CSS + shadcn/ui
* Framer Motion
* Recharts
* Google OAuth

### Backend

* Node.js + Express
* MongoDB (Mongoose)
* Zod (validation)
* Axios + Cheerio (web scraping)
* Google OAuth (auth)

<br>

## 📁 Project Structure

```
root/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   ├── validators/
│   └── app.js
```

<br>

## 🔐 Authentication

* Google OAuth login
* Automatic user creation
* Session stored in frontend (localStorage)

<br>

## 📊 Core Features

### 📈 Market Data

* Live stock prices (PSX scraping)
* Indices (KSE, KMI30, etc.)

### ⭐ Watchlist

* Add/remove stocks
* Personalized tracking

### 💼 Portfolio

* Buy/Sell transactions
* Real-time valuation
* Profit/Loss calculations
* Oversell protection logic

### 🔔 Alerts System

* Set price targets (above/below)
* Auto-trigger based on live prices
* Browser notifications + sound alerts
* Mark alerts as seen

<br>

## 🎨 Frontend Highlights

* Responsive dashboard UI
* Smooth animations (Framer Motion)
* Dark mode support
* Real-time feel via polling
* Charts:

  * Pie chart (allocation)
  * Sparkline trends

<br>

## ⚙️ Backend Highlights

* Clean MVC structure
* Zod validation for safety
* Centralized error handling
* Async middleware wrapper
* Efficient alert checking (single price fetch)

<br>

## 🔗 API Endpoints

### Auth

```
POST /api/auth/google
```

### Market

```
GET /api/indices
GET /api/stockvalues
```

### Watchlist

```
GET    /api/watchlist
POST   /api/watchlist
DELETE /api/watchlist/:id
```

### Portfolio

```
GET    /api/portfolio
POST   /api/portfolio
DELETE /api/portfolio/symbol/:symbol
```

### Alerts

```
POST   /api/alerts
GET    /api/alerts
GET    /api/alerts/check
PUT    /api/alerts/mark-seen
DELETE /api/alerts/:id
```

<br>

## ⚙️ Setup Instructions

### 1. Clone Repo

```bash
git clone <repo-url>
cd pakstocks
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongo_uri
GOOGLE_CLIENT_ID=your_google_client_id
```

Run:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_BASE_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

---

## 🧠 AI Roadmap

### Phase 1 (Next Step)

* Stock recommendations (based on user portfolio + watchlist)

### Phase 2

* Portfolio insights (sector analysis, risk detection)

### Phase 3

* Smart alerts (prediction-based)

### Phase 4

* AI chatbot assistant

<br>

## 🧪 Health Check

```
GET /
```

<br>

## 👨‍💻 Author

Mubeen Channa - MERN Stack Dev