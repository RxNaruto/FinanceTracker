import express from "express";
import cors from "cors";
import userRouter from "./route/user.js";
import expenseRouter from "./route/expenses.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use('/t',userRouter);
app.use('/e',expenseRouter);
app.listen(3000);