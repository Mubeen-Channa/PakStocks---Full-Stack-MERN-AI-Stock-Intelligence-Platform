import { z } from "zod";

export const googleLoginSchema = z.object({
  body: z.object({
    token: z.string().min(10),
  }),
});
