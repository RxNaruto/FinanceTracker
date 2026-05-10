import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { alert("Please login again"); return; }
    axios.get("https://financetracker.rithkchaudharytechnologies.xyz/e/balance", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setBalance(res.data.balance))
      .catch(() => alert("Failed to load balance"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your expenses and balance</p>
        </div>

        {/* Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 transition-colors">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Current Balance
            </p>
            {balance > 0 && (
              <>
                <p className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">₹{balance}</p>
                <p className="text-gray-600 dark:text-gray-400">You will receive</p>
              </>
            )}
            {balance < 0 && (
              <>
                <p className="text-5xl font-bold text-red-600 dark:text-red-400 mb-2">₹{Math.abs(balance)}</p>
                <p className="text-gray-600 dark:text-gray-400">You owe</p>
              </>
            )}
            {balance === 0 && (
              <>
                <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">₹0</p>
                <p className="text-gray-600 dark:text-gray-400">All settled</p>
              </>
            )}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <Link to="/add-expense"
            className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl shadow-md p-6 transition-all hover:shadow-lg border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <span className="text-2xl">➕</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">Add Expense</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-2">Record a new expense</p>
          </Link>

          <Link to="/spending/individual"
            className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl shadow-md p-6 transition-all hover:shadow-lg border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">Individual Spending</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-2">View your personal expenses</p>
          </Link>

          <Link to="/spending/collective"
            className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl shadow-md p-6 transition-all hover:shadow-lg border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">Collective Spending</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-2">View shared expenses</p>
          </Link>

          <Link to="/settle"
            className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl shadow-md p-6 transition-all hover:shadow-lg border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                <span className="text-2xl">💸</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">Settle Up</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-2">Clear pending balance</p>
          </Link>

          <Link to="/budget"
            className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl shadow-md p-6 transition-all hover:shadow-lg border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">Set Budget</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">Manage your spending limit</p>
          </Link>

        </div>
      </div>
    </div>
  );
};