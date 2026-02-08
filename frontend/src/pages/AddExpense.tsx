import { useState } from "react";
import axios from "axios";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

export const AddExpense = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [splitType, setSplitType] =
    useState<"INDIVIDUAL" | "BOTH">("INDIVIDUAL");

  const navigate = useNavigate();

  const handleAddExpense = async () => {
    if (!title || !amount) {
      alert("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      return;
    }

    try {
      await axios.post(
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

      navigate("/home");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add expense");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/home")}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Expense</h2>

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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Split Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSplitType("INDIVIDUAL")}
                  className={`py-4 px-6 rounded-lg font-medium transition-all ${
                    splitType === "INDIVIDUAL"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Individual
                </button>

                <button
                  onClick={() => setSplitType("BOTH")}
                  className={`py-4 px-6 rounded-lg font-medium transition-all ${
                    splitType === "BOTH"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Both
                </button>
              </div>
            </div>

            <div className="pt-4">
              <Button label="Add Expense" onClick={handleAddExpense} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
