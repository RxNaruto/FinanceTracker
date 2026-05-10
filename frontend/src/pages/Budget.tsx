import { useState } from "react";
import axios from "axios";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const Budget = () => {
  const [totalAmount, setTotalAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    if (!totalAmount || !startDate || !endDate) { toast.error("Fill all fields"); return; }
    try {
      await axios.post(
        "https://financetracker.rithkchaudharytechnologies.xyz/e/budget",
        { totalAmount: Number(totalAmount), startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Budget created");
      navigate("/home");
    } catch { toast.error("Failed to create budget"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate("/home")}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            ← Back to Dashboard
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Set Budget</h2>
          <InputBox label="Total Budget Amount" placeholder="1000" onChange={(e) => setTotalAmount(e.target.value)} />
          <div className="mt-4">
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Start Date</label>
            <input type="date" onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>
          <div className="mt-4">
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">End Date</label>
            <input type="date" onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>
          <div className="mt-6">
            <Button label="Create Budget" onClick={handleCreate} />
          </div>
        </div>
      </div>
    </div>
  );
};