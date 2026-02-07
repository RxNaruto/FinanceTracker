import { z } from "zod";

export const ExpenseCreateSchema = z.object({
  title: z.string().min(1),
  amount: z.number().int().positive(),
  splitType: z.enum(["INDIVIDUAL", "BOTH"]),
  date: z.string().datetime()
});
