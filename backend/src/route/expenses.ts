import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { userAuth } from "../middleware/auth.js";

const expenseRouter = Router();
const prisma = new PrismaClient();


expenseRouter.post("/exp", userAuth,expenseRouter, async (req: any, res) => {
  const body = req.body;
  const myId = req.userId;          
  const friendId = myId === 1 ? 2 : 1;

  let participants: number[] = [];

  if (body.splitType === "INDIVIDUAL") {
    participants = [myId];
  } else if (body.splitType === "BOTH") {
    participants = [myId, friendId];
  } else {
    return res.status(400).json({
      message: "Invalid splitType"
    });
  }

  try {
    const exp = await prisma.expense.create({
      data: {
        title: body.title,
        amount: body.amount,
        splitType: body.splitType,
        date: new Date(),
        paidById: myId,
        participants: {
          connect: participants.map((id) => ({ id }))
        }
      }
    });

    return res.status(200).json({
      message: "Expense added",
      expense: exp
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server error"
    });
  }
});

expenseRouter.get("/balance", userAuth, async (req: any, res) => {
  const myId = req.userId;

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        OR: [
          { splitType: "BOTH" },
          { isSettlement: true }
        ]
      }
    });

    let balance = 0;

    for (const exp of expenses) {
      if (exp.splitType === "BOTH") {
        const share = exp.amount / 2;
        balance += exp.paidById === myId ? share : -share;
      }

      if (exp.isSettlement) {
        // If I paid settlement → I reduce what I owe
        balance += exp.paidById === myId ? exp.amount : -exp.amount;
      }
    }

    res.json({ balance });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


expenseRouter.get("/spending/individual", userAuth, async (req: any, res) => {
  const userId = req.userId;
  const { type, month, year } = req.query;

  let dateFilter: any = {};

  // Today filter
  if (type === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    dateFilter = { gte: start, lte: end };
  }

  // Monthly filter
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
      orderBy: {
        date: "desc"
      }
    });

    const total = expenses.reduce(
  (sum: number, e: { amount: number }) => sum + e.amount,
  0
);

    res.json({
      total,
      expenses
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

expenseRouter.get("/spending/collective", userAuth, async (req: any, res) => {
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
        splitType: "BOTH",
        ...(Object.keys(dateFilter).length && { date: dateFilter })
      },
      orderBy: {
        date: "desc"
      },
      select: {
        id: true,
        title: true,
        amount: true,
        date: true,
        paidById: true   // ✅ IMPORTANT
      }
    });

    const total = expenses.reduce(
  (sum: number, e: { amount: number }) => sum + e.amount,
  0
);


    res.json({
      total,
      expenses
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

expenseRouter.post("/settle", userAuth, async (req: any, res) => {
  const { amount } = req.body;
  const myId = req.userId;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    const settlement = await prisma.expense.create({
      data: {
        title: "Settlement Payment",
        amount,
        splitType: "INDIVIDUAL",
        paidById: myId,
        participants: {
          connect: [{ id: myId }]
        },
        isSettlement: true,
        date: new Date()
      }
    });

    res.json({
      message: "Settlement completed",
      settlement
    });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});




export default expenseRouter;
