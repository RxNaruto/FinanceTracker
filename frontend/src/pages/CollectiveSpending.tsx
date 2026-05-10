import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const CollectiveSpending = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("month");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const myUserId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

  const fetchData = async () => {
    const params: any = {};
    if (filter === "today") params.type = "today";
    if (filter === "month") {
      const d = new Date();
      params.type = "month";
      params.month = d.getMonth() + 1;
      params.year = d.getFullYear();
    }
    const res = await axios.get(
      "https://financetracker.rithkchaudharytechnologies.xyz/e/spending/collective",
      { headers: { Authorization: `Bearer ${token}` }, params }
    );
    setExpenses(res.data.expenses);
    setTotal(res.data.total);
  };

  useEffect(() => { fetchData(); }, [filter]);

  const filteredExpenses = expenses.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate("/home")}
            className="text-blue-600 dark:text-blue-400 font-medium">
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 transition-colors">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Collective Spending</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Shared expenses with others</p>

          <input type="text" placeholder="Search by title..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-6 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500" />

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent Together</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">₹{total}</p>
          </div>

          <div className="flex gap-3 mb-6">
            {["all", "today", "month"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-lg ${filter === f ? "bg-blue-600 text-white dark:bg-blue-500" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}>
                {f === "all" ? "All" : f === "today" ? "Today" : "This Month"}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No expenses found</p>
              </div>
            ) : (
              filteredExpenses.map(e => (
                <div key={e.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{e.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(e.date).toLocaleString()}</p>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-gray-100">₹{e.amount}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${e.paidById === myUserId
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"}`}>
                    Paid by: {e.paidById === myUserId ? "You" : "Friend"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};