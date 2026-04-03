import { z } from "zod";

export const CreateAlertSchema = z.object({
  symbol: z.string().min(1),
  targetPrice: z.number().positive(),
  direction: z.enum(["above", "below"]),
});