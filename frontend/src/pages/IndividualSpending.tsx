import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const IndividualSpending = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("month");
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState<any>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const formatAmount = (value: number) =>
    new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

  const fetchSpending = async () => {
    const params: any = {};
    if (filter === "today") params.type = "today";
    if (filter === "month") {
      const d = new Date();
      params.type = "month";
      params.month = d.getMonth() + 1;
      params.year = d.getFullYear();
    }
    const res = await axios.get(
      "https://financetracker.rithkchaudharytechnologies.xyz/e/spending/individual",
      { headers: { Authorization: `Bearer ${token}` }, params }
    );
    setExpenses(res.data.expenses);
    setTotal(res.data.total);
  };

  const fetchBudget = async () => {
    try {
      const res = await axios.get(
        "https://financetracker.rithkchaudharytechnologies.xyz/e/budget/status",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBudget(res.data);
    } catch { setBudget(null); }
  };

  useEffect(() => { fetchSpending(); fetchBudget(); }, [filter]);

  const filteredExpenses = expenses.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/home")}
          className="text-blue-600 dark:text-blue-400 font-medium mb-6">
          ← Back to Dashboard
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-colors">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Individual Spending</h2>

          {budget && budget.dailyLimit && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Daily Limit</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">₹{formatAmount(budget.dailyLimit)}</p>
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">Today Spent: ₹{formatAmount(budget.todaySpent)}</p>
              <p className={`font-semibold mt-1 ${budget.remaining < 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                Remaining: ₹{formatAmount(budget.remaining)}
              </p>
            </div>
          )}

          <input type="text" placeholder="Search by title..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-6 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500" />

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">₹{formatAmount(total)}</p>
          </div>

          <div className="flex gap-3 mb-6">
            {["all", "today", "month"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded ${filter === f ? "bg-blue-600 text-white dark:bg-blue-500" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}>
                {f === "all" ? "All" : f === "today" ? "Today" : "This Month"}
              </button>
            ))}
          </div>

          {filteredExpenses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No expenses found</p>
          ) : (
            filteredExpenses.map((e) => (
              <div key={e.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-3">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{e.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(e.date).toLocaleString()}</p>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-gray-100">₹{formatAmount(e.amount)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};