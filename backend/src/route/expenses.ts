import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { ExpenseCreateSchema } from "../types/expenses.js";

const expenseRouter = Router();
const prisma = new PrismaClient();

expenseRouter.post("/expenses", async (req, res) => {
  const parsed = ExpenseCreateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid expense data",
    });
  }

  const {
    title,
    amount,
    splitType,
    paidById,
    participantIds,
    date
  } = parsed.data;

  // 🧠 Business rules
  if (splitType === "INDIVIDUAL" && participantIds.length !== 1) {
    return res.status(400).json({
      message: "Individual expense must have exactly one participant"
    });
  }

  if (splitType === "BOTH" && participantIds.length !== 2) {
    return res.status(400).json({
      message: "Shared expense must have exactly two participants"
    });
  }

  try {
    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        splitType,
        paidBy: {
          connect: { id: paidById }
        },
        participants: {
          connect: participantIds.map(id => ({ id }))
        },
        date: new Date(date)
      },
      include: {
        paidBy: true,
        participants: true
      }
    });

    return res.status(201).json({
      message: "Expense added successfully",
      expense
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

export default expenseRouter;
