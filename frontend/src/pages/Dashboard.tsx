import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      return;
    }

    axios.get(
      "https://financetracker.rithkchaudharytechnologies.xyz/e/balance",
      // "https://localhost:3000/e/balance", 
      {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setBalance(res.data.balance);
    })
    .catch(() => {
      alert("Failed to load balance");
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your expenses and balance</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Current Balance
            </p>
            {balance > 0 && (
              <div>
                <p className="text-5xl font-bold text-green-600 mb-2">
                  ₹{balance}
                </p>
                <p className="text-gray-600">You will receive</p>
              </div>
            )}
            {balance < 0 && (
              <div>
                <p className="text-5xl font-bold text-red-600 mb-2">
                  ₹{Math.abs(balance)}
                </p>
                <p className="text-gray-600">You owe</p>
              </div>
            )}
            {balance === 0 && (
              <div>
                <p className="text-5xl font-bold text-blue-600 mb-2">₹0</p>
                <p className="text-gray-600">All settled</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/add-expense"
            className="bg-white hover:bg-blue-50 rounded-xl shadow-md p-6 transition-all hover:shadow-lg border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">➕</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 text-center">Add Expense</h3>
            <p className="text-gray-600 text-sm text-center mt-2">Record a new expense</p>
          </Link>

          <Link
            to="/spending/individual"
            className="bg-white hover:bg-blue-50 rounded-xl shadow-md p-6 transition-all hover:shadow-lg border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 text-center">Individual Spending</h3>
            <p className="text-gray-600 text-sm text-center mt-2">View your personal expenses</p>
          </Link>

          <Link
            to="/spending/collective"
            className="bg-white hover:bg-blue-50 rounded-xl shadow-md p-6 transition-all hover:shadow-lg border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 text-center">Collective Spending</h3>
            <p className="text-gray-600 text-sm text-center mt-2">View shared expenses</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
