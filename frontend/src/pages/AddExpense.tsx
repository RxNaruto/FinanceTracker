import { useState } from "react";
import axios from "axios";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const AddExpense = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [splitType, setSplitType] = useState<"INDIVIDUAL" | "BOTH">("INDIVIDUAL");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddExpense = async () => {
    if (loading) return;
    if (!title || !amount) { toast.error("Please fill all fields"); return; }
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login again"); return; }
    setLoading(true);
    try {
      const res = await axios.post(
        "https://financetracker.rithkchaudharytechnologies.xyz/e/exp",
        { title, amount: Number(amount), splitType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Expense added");
      if (res.data.warning) toast.error(res.data.warning);
      setTimeout(() => navigate("/home"), 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add expense");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate("/home")}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            ← Back to Dashboard
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-300">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Add Expense</h2>
          <div className="space-y-6">
            <InputBox label="Title" placeholder="Dinner" onChange={(e) => setTitle(e.target.value)} />
            <InputBox label="Amount" placeholder="500" onChange={(e) => setAmount(e.target.value)} />
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Split Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setSplitType("INDIVIDUAL")} disabled={loading}
                  className={`py-3 px-4 rounded-lg transition-colors ${splitType === "INDIVIDUAL" ? "bg-blue-600 text-white dark:bg-blue-500" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}>
                  Individual
                </button>
                <button onClick={() => setSplitType("BOTH")} disabled={loading}
                  className={`py-3 px-4 rounded-lg transition-colors ${splitType === "BOTH" ? "bg-blue-600 text-white dark:bg-blue-500" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}>
                  Both
                </button>
              </div>
            </div>
            <Button label={loading ? "Adding..." : "Add Expense"} onClick={handleAddExpense} />
          </div>
        </div>
      </div>
    </div>
  );
};