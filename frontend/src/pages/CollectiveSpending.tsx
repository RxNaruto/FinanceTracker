import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const CollectiveSpending = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const myUserId = token
    ? JSON.parse(atob(token.split(".")[1])).userId
    : null;

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
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      }
    );

    setExpenses(res.data.expenses);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Collective Spending</h2>
          <p className="text-gray-600 mb-6">Shared expenses with others</p>

          <div className="bg-green-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-1">Total Spent Together</p>
            <p className="text-4xl font-bold text-green-600">₹{total}</p>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("today")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === "today"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter("month")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === "month"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              This Month
            </button>
          </div>

          <div className="space-y-3">
            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No expenses found</p>
              </div>
            ) : (
              expenses.map((e) => (
                <div key={e.id} className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{e.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(e.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">₹{e.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      e.paidById === myUserId
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      Paid by: {e.paidById === myUserId ? "You" : `Friend (User ID: ${e.paidById})`}
                    </span>
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
