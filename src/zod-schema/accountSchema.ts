import { z } from "zod";

export const createAccountSchema = z.object({
  kindeId: z.string().min(1, "Kinde ID is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["BANK", "MOBILE_MONEY", "CASH"]),
  balance: z.number().positive("Balance must be positive"),
  currency: z.string().length(3, "Currency code must be 3 characters"),
  description: z.string().optional(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
