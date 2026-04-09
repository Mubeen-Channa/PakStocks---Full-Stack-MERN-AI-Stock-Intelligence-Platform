import { z } from "zod";

export const addWatchlistSchema = z.object({
  body: z.object({
    symbol: z.string().min(1),
    name: z.string().min(1),
  }),
});

export const removeWatchlistSchema = z.object({
  body: z.object({
    symbol: z.string().min(1),
  }),
});
