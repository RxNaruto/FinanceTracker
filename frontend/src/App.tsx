import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { AddExpense } from "./pages/AddExpense";
import { IndividualSpending } from "./pages/IndividualSpending";
import { CollectiveSpending } from "./pages/CollectiveSpending";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/home" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />

        <Route path="/spending/individual" element={<IndividualSpending />} />
        <Route path="/spending/collective" element={<CollectiveSpending />} />

        <Route path="*" element={<Signin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
