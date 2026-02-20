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

    if (!totalAmount || !startDate || !endDate) {
      toast.error("Fill all fields");
      return;
    }

    try {
      await axios.post(
        "https://financetracker.rithkchaudharytechnologies.xyz/e/budget",
        {
          totalAmount: Number(totalAmount),
          startDate,
          endDate
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Budget created");
      navigate("/home");
    } catch {
      toast.error("Failed to create budget");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6">Set Budget</h2>

        <InputBox
          label="Total Budget Amount"
          placeholder="1000"
          onChange={(e) => setTotalAmount(e.target.value)}
        />

        <div className="mt-4">
          <label className="block text-sm mb-2">Start Date</label>
          <input
            type="date"
            className="w-full border rounded-lg p-3"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm mb-2">End Date</label>
          <input
            type="date"
            className="w-full border rounded-lg p-3"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="mt-6">
          <Button label="Create Budget" onClick={handleCreate} />
        </div>
      </div>
    </div>
  );
};