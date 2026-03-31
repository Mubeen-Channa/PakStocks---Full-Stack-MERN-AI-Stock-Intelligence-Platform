import { Watchlist } from "../models/Watchlist.js";

export const getWatchlist = async (req, res) => {
  const list = await Watchlist.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: list,
  });
};

export const addToWatchlist = async (req, res) => {
  const { symbol, name, exchange } = req.body;

  if (!symbol || !name) {
    return res.status(400).json({
      success: false,
      message: "Symbol and name required",
    });
  }

  const item = await Watchlist.create({
    userId: req.user.id,
    symbol,
    name,
    exchange: exchange ?? "PSX",
  });

  res.status(201).json({
    success: true,
    data: item,
  });
};

export const removeFromWatchlist = async (req, res) => {
  await Watchlist.deleteOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  res.json({ success: true });
};
