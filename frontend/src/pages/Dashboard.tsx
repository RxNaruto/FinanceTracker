import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    api.get("/expenses/balance").then(res => {
      setBalance(res.data.balance);
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="bg-white p-6 shadow rounded">
        {balance > 0 && <p>You will receive ₹{balance}</p>}
        {balance < 0 && <p>You owe ₹{Math.abs(balance)}</p>}
        {balance === 0 && <p>All settled 🎉</p>}
      </div>

      <div className="flex gap-4">
        <Link to="/add-expense" className="text-orange-500">
          Add Expense
        </Link>
        <Link to="/monthly" className="text-orange-500">
          Monthly Expenses
        </Link>
      </div>
    </div>
  );
};
