import { useState } from "react";
import axios from "axios";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const AddExpense = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [splitType, setSplitType] =
    useState<"INDIVIDUAL" | "BOTH">("INDIVIDUAL");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAddExpense = async () => {
    if (loading) return;

    if (!title || !amount) {
      alert("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        // "https://localhost:3000/e/exp",
        "https://financetracker.rithkchaudharytechnologies.xyz/e/exp",
        {
          title,
          amount: Number(amount),
          splitType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Expense added");
      setTimeout(()=>{
        navigate("/home");
      },1000)
    } catch (err: any) {
      toast.error("Failed to add expense");
      alert(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/home")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">Add Expense</h2>

          <div className="space-y-6">
            <InputBox
              label="Title"
              placeholder="Dinner"
              onChange={(e) => setTitle(e.target.value)}
            />

            <InputBox
              label="Amount"
              placeholder="500"
              onChange={(e) => setAmount(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium mb-3">
                Split Type
              </label>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSplitType("INDIVIDUAL")}
                  disabled={loading}
                  className={`py-3 px-4 rounded-lg ${
                    splitType === "INDIVIDUAL"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  Individual
                </button>

                <button
                  onClick={() => setSplitType("BOTH")}
                  disabled={loading}
                  className={`py-3 px-4 rounded-lg ${
                    splitType === "BOTH"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  Both
                </button>
              </div>
            </div>

            <Button
              label={loading ? "Adding..." : "Add Expense"}
              onClick={handleAddExpense}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
