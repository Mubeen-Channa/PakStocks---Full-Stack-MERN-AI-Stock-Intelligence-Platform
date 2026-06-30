# 📈 Stock AI Web App (Backend)

A MERN-based stock intelligence platform powered by real-time PSX (Pakistan Stock Exchange) data. This backend provides APIs for authentication, portfolio tracking, watchlists, alerts, and live market data.

<br>

## 🚀 Features

### 🔐 Authentication

* Google OAuth login
* User auto-creation on first login

### 📊 Market Data

* Live stock prices
* Indices data (KSE, KMI30, etc.)

### ⭐ Watchlist

* Add/remove stocks
* Personalized user watchlist

### 💼 Portfolio Management

* Buy & Sell stocks
* Real-time portfolio valuation
* Profit/Loss calculation
* Prevent overselling (data integrity check)

### 🔔 Alerts System

* Set price alerts (above/below)
* Auto-trigger alerts based on live prices
* Mark alerts as seen

<br>


## 🏗️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Validation:** Zod
* **Auth:** Google OAuth

<br>

## 📁 Project Structure

```
src/
│
├── controllers/      # Route handlers
├── models/           # Mongoose schemas
├── routes/           # API routes
├── middlewares/      # Auth, error handling, validation
├── services/         # Business logic ( market data)
├── validators/       # Zod schemas
├── app.js            # Express app setup
```

<br>

## ⚙️ Installation

```bash
git clone <repo-url>
cd backend
npm install
```

<br>

## 🔐 Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
GOOGLE_CLIENT_ID=your_google_client_id
```

<br>

## ▶️ Run Server

```bash
npm run dev
```

Server will run on:

```
http://localhost:5000
```

<br>

## 🔗 API Endpoints

### Auth

```
POST /api/auth/google
```

### Indices

```
GET /api/indices
```

### Stocks

```
GET /api/stockvalues
```

### Watchlist (Protected)

```
GET    /api/watchlist
POST   /api/watchlist
DELETE /api/watchlist/:id
```

### Portfolio (Protected)

```
GET    /api/portfolio
POST   /api/portfolio
DELETE /api/portfolio/symbol/:symbol
```

### Alerts (Protected)

```
POST   /api/alerts
GET    /api/alerts
GET    /api/alerts/check
DELETE /api/alerts/:id
PUT    /api/alerts/mark-seen
```

<br>

## 🧠 Data Models Overview

### User

* googleId
* name
* email
* avatar

### Watchlist

* userId
* symbol
* name
* exchange

### PortfolioTransaction

* userId
* symbol
* quantity
* price
* type (BUY/SELL)

### Alert

* userId
* symbol
* targetPrice
* direction (above/below)
* triggered

<br>

## 🧩 Key Logic

### ✅ Portfolio Calculation

* Aggregates BUY & SELL transactions
* Computes:

  * Avg Cost
  * Current Price
  * Profit/Loss

### ✅ Oversell Protection

* Prevents selling more shares than owned

### ✅ Alert Engine

* Fetches live prices
* Compares with target
* Triggers alerts automatically

<br>

## 🧠 Future Improvements (AI Roadmap)

* Stock recommendations (based on portfolio & watchlist)
* Portfolio insights (sector analysis, risk scoring)
* Sentiment analysis (market news)

<br>

## 🧪 Health Check

```
GET /health
```

Response:

```json
{
  "status": "ok",
  "time": "timestamp"
}
```

<br>

## 👨‍💻 Author

Mubeen Channa - MERN Stack Dev