import { z } from "zod";

export const ExpenseCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().int().positive("Amount must be a positive number"),
  splitType: z.enum(["INDIVIDUAL", "BOTH"]),
  paidById: z.number().int(),
  participantIds: z.array(z.number().int()).min(1, "At least one participant is required"),
  date: z.string()
});
