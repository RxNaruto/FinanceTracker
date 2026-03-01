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

  // ✅ Currency formatter (Indian format + 2 decimals)
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

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
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );

    setExpenses(res.data.expenses);
    setTotal(res.data.total);
  };

  const fetchBudget = async () => {
    try {
      const res = await axios.get(
        "https://financetracker.rithkchaudharytechnologies.xyz/e/budget/status",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBudget(res.data);
    } catch {
      setBudget(null);
    }
  };

  useEffect(() => {
    fetchSpending();
    fetchBudget();
  }, [filter]);

  const filteredExpenses = expenses.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => navigate("/home")}
          className="text-blue-600 font-medium mb-6"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6">

          <h2 className="text-3xl font-bold mb-6">Individual Spending</h2>

          {/* 🔥 Budget Section */}
          {budget && budget.dailyLimit && (
            <div className="bg-yellow-50 rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-600">Daily Limit</p>
              <p className="text-xl font-bold">
                ₹{formatAmount(budget.dailyLimit)}
              </p>

              <p className="mt-3 text-sm">
                Today Spent: ₹{formatAmount(budget.todaySpent)}
              </p>

              <p
                className={`font-semibold mt-1 ${
                  budget.remaining < 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                Remaining: ₹{formatAmount(budget.remaining)}
              </p>
            </div>
          )}

          {/* 🔍 Search */}
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-6 p-3 border rounded-lg"
          />

          {/* 💰 Total */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-4xl font-bold text-blue-600">
              ₹{formatAmount(total)}
            </p>
          </div>

          {/* 🔄 Filters */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter("today")}
              className={`px-4 py-2 rounded ${
                filter === "today"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              Today
            </button>

            <button
              onClick={() => setFilter("month")}
              className={`px-4 py-2 rounded ${
                filter === "month"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              This Month
            </button>
          </div>

          {/* 📋 Expense List */}
          {filteredExpenses.length === 0 ? (
            <p className="text-gray-500">No expenses found</p>
          ) : (
            filteredExpenses.map((e) => (
              <div key={e.id} className="bg-gray-50 p-4 rounded-lg mb-3">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{e.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(e.date).toLocaleString()}
                    </p>
                  </div>
                  <p className="font-bold">
                    ₹{formatAmount(e.amount)}
                  </p>
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
};