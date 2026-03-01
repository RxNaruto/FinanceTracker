import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { userAuth } from "../middleware/auth.js";

const expenseRouter = Router();
const prisma = new PrismaClient();

/* =====================================================
   ADD EXPENSE
===================================================== */
expenseRouter.post("/exp", userAuth, async (req: any, res) => {
  const body = req.body;
  const myId = req.userId;
  const friendId = myId === 1 ? 2 : 1;

  let participants: number[] = [];

  if (body.splitType === "INDIVIDUAL") {
    participants = [myId];
  } else if (body.splitType === "BOTH") {
    participants = [myId, friendId];
  } else {
    return res.status(400).json({ message: "Invalid splitType" });
  }

  try {
    const exp = await prisma.expense.create({
      data: {
        title: body.title,
        amount: body.amount,
        splitType: body.splitType,
        paidById: myId,
        participants: {
          connect: participants.map((id) => ({ id }))
        }
      }
    });

    res.json({ message: "Expense added", expense: exp });
  } catch {
    res.status(500).json({ message: "Internal Server error" });
  }
});

/* =====================================================
   BALANCE
===================================================== */
expenseRouter.get("/balance", userAuth, async (req: any, res) => {
  const myId = req.userId;

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        OR: [{ splitType: "BOTH" }, { isSettlement: true }]
      }
    });

    let balance = 0;

    for (const exp of expenses) {
      if (exp.splitType === "BOTH") {
        const share = exp.amount / 2;
        balance += exp.paidById === myId ? share : -share;
      }

      if (exp.isSettlement) {
        balance += exp.paidById === myId ? exp.amount : -exp.amount;
      }
    }

    res.json({ balance });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* =====================================================
   INDIVIDUAL SPENDING
===================================================== */
expenseRouter.get("/spending/individual", userAuth, async (req: any, res) => {
  const userId = req.userId;
  const { type, month, year } = req.query;

  let dateFilter: any = {};

  if (type === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    dateFilter = { gte: start, lte: end };
  }

  if (type === "month" && month && year) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 1);
    dateFilter = { gte: start, lt: end };
  }

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        splitType: "INDIVIDUAL",
        paidById: userId,
        ...(Object.keys(dateFilter).length && { date: dateFilter })
      },
      orderBy: { date: "desc" }
    });

    const total = expenses.reduce(
      (sum: number, e: { amount: number }) => sum + e.amount,
      0
    );

    res.json({ total, expenses });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* =====================================================
   BUDGET STATUS (NEW)
===================================================== */
expenseRouter.get("/budget/status", userAuth, async (req: any, res) => {
  const userId = req.userId;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  try {
    const budget = await prisma.budget.findFirst({
      where: {
        userId,
        startDate: { lte: todayStart },
        endDate: { gte: todayStart }
      }
    });

    if (!budget) {
      return res.json({ budget: null });
    }

    const expenses = await prisma.expense.findMany({
      where: {
        paidById: userId,
        splitType: "INDIVIDUAL",
        date: { gte: todayStart, lte: todayEnd }
      }
    });

    const todaySpent = expenses.reduce(
      (sum: number, e: { amount: number }) => sum + e.amount,
      0
    );

    res.json({
      dailyLimit: budget.dailyLimit,
      todaySpent,
      remaining: budget.dailyLimit - todaySpent
    });

  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default expenseRouter;