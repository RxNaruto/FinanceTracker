import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const SettleUp = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentSettlements, setRecentSettlements] = useState<any[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const myUserId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

  const formatAmount = (value: number) =>
    new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

  const fetchRecentSettlements = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${API_URL}/e/spending/collective`,
        { headers: { Authorization: `Bearer ${token}` }, params: { type: "month", month: new Date().getMonth() + 1, year: new Date().getFullYear() } }
      );
      const settlements = (res.data.expenses || []).filter((e: any) => e.isSettlement);
      setRecentSettlements(settlements);
    } catch {
      setRecentSettlements([]);
    }
  };

  useEffect(() => {
    fetchRecentSettlements();
  }, []);

  const handleSettle = async () => {
    if (!amount) { toast.error("Enter amount"); return; }
    if (!token) { toast.error("Please login again"); return; }
    if (loading) return;
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/e/settle`,
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Settlement completed");
      setAmount("");
      await fetchRecentSettlements();
      navigate("/spending/collective");
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

        {recentSettlements.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mt-6 transition-colors">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Recent Settlements</h3>
            <div className="space-y-3">
              {recentSettlements.map((e) => (
                <div
                  key={e.id}
                  className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-4 rounded-lg"
                >
                  <div className="flex justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{e.title}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-800/60 dark:text-amber-200 font-medium">
                          Settlement
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(e.date).toLocaleString()}</p>
                    </div>
                    <p className="font-bold text-amber-700 dark:text-amber-300">₹{formatAmount(e.amount)}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${e.paidById === myUserId
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"}`}>
                    Settled by: {e.paidById === myUserId ? "You" : "Friend"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};