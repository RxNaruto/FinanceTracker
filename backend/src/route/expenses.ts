import { Router } from "express"; // singleton
import { ExpenseCreateSchema } from "../types/expenses.js";
import { authMiddleware } from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";

const expenseRouter = Router();
const prisma = new PrismaClient();
/* =========================
   CREATE EXPENSE
========================= */
expenseRouter.post(
  "/expenses",
  authMiddleware,
  async (req: any, res) => {
    const parsed = ExpenseCreateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid expense data" });
    }

    const { title, amount, splitType, participantIds, date } = parsed.data;
    const paidById = req.userId;

    // 🔒 Business rules
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
          paidById,
          participants: {
            connect: participantIds.map((id: number) => ({ id }))
          },
          date: new Date(date)
        }
      });

      return res.status(201).json({ expense });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

/* =========================
   BALANCE API
========================= */
expenseRouter.get(
  "/expenses/balance",
  authMiddleware,
  async (req: any, res) => {
    const userId = req.userId;

    try {
      const expenses = await prisma.expense.findMany({
        where: {
          splitType: "BOTH",
          participants: {
            some: { id: userId }
          }
        },
        include: {
          participants: true
        }
      });

      let balance = 0;

      for (const exp of expenses) {
        const share = exp.amount / exp.participants.length;
        balance += exp.paidById === userId ? share : -share;
      }

      return res.json({ balance });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

/* =========================
   MONTHLY EXPENSES
========================= */
expenseRouter.get(
  "/expenses/month",
  authMiddleware,
  async (req: any, res) => {
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!month || !year) {
      return res.status(400).json({
        message: "Month and year are required"
      });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    try {
      const expenses = await prisma.expense.findMany({
        where: {
          date: {
            gte: start,
            lt: end
          }
        }
      });

      return res.json({ expenses });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default expenseRouter;
