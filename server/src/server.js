import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";

import { connectDB } from "./db/connect.js";
import { errorHandler } from "./middlewares/errorHandler.js";
// import { startPriceCron } from "./cron/price.cron.js";

import authRoutes from "./routes/auth.routes.js";
import indicesRoutes from "./routes/indices.routes.js";
import watchlistRoutes from "./routes/watchlist.routes.js";
import stockValuesRoutes from "./routes/stocksValues.routes.js";
import alertRoutes from "./routes/alerts.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import historyRoutes from "./routes/history.routes.js";
import predictRoutes from "./routes/predict.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://pakstocks-ai-powered.vercel.app",
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/indices", indicesRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/stockvalues", stockValuesRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/predict", predictRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use(errorHandler);

// Start
async function start() {
  try {
    await connectDB();

    // startPriceCron();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();