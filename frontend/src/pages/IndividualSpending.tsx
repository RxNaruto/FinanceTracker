import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const IndividualSpending = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("month"); // ✅ default monthly
  const [search, setSearch] = useState("");      // ✅ search state
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

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
      "https://financetracker.rithkchaudharytechnologies.xyz/e/spending/individual",
      {
        headers: { Authorization: `Bearer ${token}` },
        params
      }
    );

    setExpenses(res.data.expenses);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  // ✅ search filtering
  const filteredExpenses = expenses.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-6">
          <button
            onClick={() => navigate("/home")}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Individual Spending
          </h2>

          <p className="text-gray-600 mb-6">
            Your personal expenses
          </p>

          {/* ✅ Search Bar */}
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-6 p-3 border rounded-lg"
          />

          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-1">Total Spent</p>
            <p className="text-4xl font-bold text-blue-600">₹{total}</p>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setFilter("today")}
              className={`px-6 py-2 rounded-lg font-medium ${
                filter === "today"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Today
            </button>

            <button
              onClick={() => setFilter("month")}
              className={`px-6 py-2 rounded-lg font-medium ${
                filter === "month"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              This Month
            </button>
          </div>

          <div className="space-y-3">
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No expenses found</p>
              </div>
            ) : (
              filteredExpenses.map(e => (
                <div key={e.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{e.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(e.date).toLocaleString()}
                      </p>
                    </div>
                    <p className="font-bold">₹{e.amount}</p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};