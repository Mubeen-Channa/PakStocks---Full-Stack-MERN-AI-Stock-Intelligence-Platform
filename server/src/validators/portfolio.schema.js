import { z } from "zod";

export const CreatePortfolioSchema = z.object({
  symbol: z
    .string()
    .min(1, "Symbol is required")
    .transform((val) => val.toUpperCase()),

  name: z
    .string()
    .min(1, "Company name is required"),

  exchange: z.string().default("PSX"),

  sector: z.string().default("Others"),

  quantity: z
    .number({ required_error: "Quantity is required" })
    .int()
    .min(1),

  price: z
    .number({ required_error: "Price is required" })
    .min(0),

  tax: z
    .number()
    .min(0)
    .default(0.2), // percent per share

  type: z.enum(["BUY", "SELL"]),
});