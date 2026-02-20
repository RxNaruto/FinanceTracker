import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Budget = () => {
  const [total, setTotal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const handleBudget = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "https://financetracker.rithkchaudharytechnologies.xyz/e/budget",
        { total: Number(total), startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Budget created successfully");
      navigate("/home");
    } catch {
      toast.error("Failed to create budget");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Allocate Budget</h2>

      <input
        type="number"
        placeholder="Total Budget"
        className="w-full p-3 border rounded mb-4"
        onChange={(e) => setTotal(e.target.value)}
      />

      <input
        type="date"
        className="w-full p-3 border rounded mb-4"
        onChange={(e) => setStartDate(e.target.value)}
      />

      <input
        type="date"
        className="w-full p-3 border rounded mb-4"
        onChange={(e) => setEndDate(e.target.value)}
      />

      <button
        onClick={handleBudget}
        className="w-full bg-blue-600 text-white py-3 rounded"
      >
        Set Budget
      </button>
    </div>
  );
};