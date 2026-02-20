import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { AddExpense } from "./pages/AddExpense";
import { IndividualSpending } from "./pages/IndividualSpending";
import { CollectiveSpending } from "./pages/CollectiveSpending";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthRedirect } from "./components/AuthRedirect";
import { Toaster } from "react-hot-toast";
import { SettleUp } from "./pages/SettleUp";

const isMobile = window.innerWidth < 640;
function App() {
  return (
    <>
      <Toaster
        position={isMobile ? "bottom-center" : "top-right"}
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
            maxWidth: "90vw",
          },
        }}
      />
      <BrowserRouter>
        <Routes>

          <Route
            path="/signin"
            element={
              <AuthRedirect>
                <Signin />
              </AuthRedirect>
            }
          />

          <Route
            path="/signup"
            element={
              <AuthRedirect>
                <Signup />
              </AuthRedirect>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-expense"
            element={
              <ProtectedRoute>
                <AddExpense />
              </ProtectedRoute>
            }
          />

          <Route
            path="/spending/individual"
            element={
              <ProtectedRoute>
                <IndividualSpending />
              </ProtectedRoute>
            }
          />
          <Route path="/settle" element={
            <ProtectedRoute>
              <SettleUp />
            </ProtectedRoute>
          } />

          <Route
            path="/spending/collective"
            element={
              <ProtectedRoute>
                <CollectiveSpending />
              </ProtectedRoute>
            }
          />


          <Route path="*" element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
