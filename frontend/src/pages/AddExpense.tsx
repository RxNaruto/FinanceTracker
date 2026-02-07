import { useState } from "react";
import api from "../api/axios";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

export const AddExpense = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [splitType, setSplitType] = useState<"INDIVIDUAL" | "BOTH">("INDIVIDUAL");
  const [participants, setParticipants] = useState<number[]>([1]);
  const navigate = useNavigate();

  const handleAdd = async () => {
    try {
      await api.post("/expenses", {
        title,
        amount: Number(amount),
        splitType,
        participantIds: participants,
        date: new Date().toISOString(),
      });

      navigate("/home");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add expense");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Add Expense</h1>

      <InputBox label="Title" placeholder="Dinner" onChange={e => setTitle(e.target.value)} />
      <InputBox label="Amount" placeholder="500" onChange={e => setAmount(e.target.value)} />

      <div className="space-x-4">
        <button onClick={() => setSplitType("INDIVIDUAL")}>
          Individual
        </button>
        <button onClick={() => setSplitType("BOTH")}>
          Both
        </button>
      </div>

      <Button label="Add Expense" onClick={handleAdd} />
    </div>
  );
};
