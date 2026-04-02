import express from "express";
import cors from "cors";

import { errorHandler } from "./middlewares/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import indicesRoutes from "./routes/indices.routes.js";
import watchlistRoutes from "./routes/watchlist.routes.js";
import stockValuesRoutes from "./routes/stocksValues.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://pakstocks-ai-powered.vercel.app"
];

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

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/indices", indicesRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/stockvalues", stockValuesRoutes);

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use(errorHandler);

export default app;