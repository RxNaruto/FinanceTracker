import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const MonthlyExpenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const date = new Date();
    axios.get(
      `http://localhost:3000/expenses/month?month=${date.getMonth() + 1}&year=${date.getFullYear()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(res => setExpenses(res.data.expenses));
  }, []);

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

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Monthly Expenses</h1>

          <div className="space-y-3">
            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No expenses found for this month</p>
              </div>
            ) : (
              expenses.map(exp => (
                <div key={exp.id} className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                      <span className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                        {exp.splitType}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">₹{exp.amount}</p>
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
