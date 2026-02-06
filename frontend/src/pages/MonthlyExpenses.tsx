import { useEffect, useState } from "react";
import api from "../api/axios";

export const MonthlyExpenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    const date = new Date();
    api.get(`/expenses/month?month=${date.getMonth() + 1}&year=${date.getFullYear()}`)
      .then(res => setExpenses(res.data.expenses));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Monthly Expenses</h1>

      <ul className="space-y-3">
        {expenses.map(exp => (
          <li key={exp.id} className="bg-white p-4 shadow rounded">
            <p>{exp.title}</p>
            <p>₹{exp.amount}</p>
            <p>{exp.splitType}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
