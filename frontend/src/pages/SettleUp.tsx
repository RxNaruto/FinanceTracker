import { useState } from "react";
import axios from "axios";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const SettleUp = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSettle = async () => {
    if (!amount) { toast.error("Enter amount"); return; }
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login again"); return; }
    if (loading) return;
    setLoading(true);
    try {
      await axios.post(
        "https://financetracker.rithkchaudharytechnologies.xyz/e/settle",
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Settlement completed");
      navigate("/home");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to settle");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate("/home")}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center">
            ← Back to Dashboard
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Settle Up</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Clear pending balance by recording a settlement</p>
          <div className="space-y-6">
            <InputBox label="Amount" placeholder="100" onChange={(e) => setAmount(e.target.value)} />
            <Button label={loading ? "Settling..." : "Settle Up"} onClick={handleSettle} />
          </div>
        </div>
      </div>
    </div>
  );
};