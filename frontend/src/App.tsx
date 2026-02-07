import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { AddExpense } from "./pages/AddExpense";
import { MonthlyExpenses } from "./pages/MonthlyExpenses";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/monthly" element={<MonthlyExpenses />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
