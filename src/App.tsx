import {  Route, Routes, Navigate, HashRouter } from "react-router-dom";
import BudgetManager from "./components/test/BudgetManager";
import CategoryManager from "./components/test/CategoryManager";
import Dashboard from "./components/test/Dashboard";
import FinancialReport from "./components/test/FinancialReport";
import NavigationBar from "./components/test/NavigationBar";
import TransactionManager from "./components/test/TransactionManager";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./components/page/Login";
import { AuthProvider, useAuth } from "./utils/AuthContext";
import { JSX } from "react";
import DebtManager from "./components/test/DebtManager.tsx";
import RegisterPage from "./components/page/RegisterPage.tsx";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Hiển thị khi đang kiểm tra đăng nhập
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function App() {
  return (
    <AuthProvider>
        <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  <NavigationBar />
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/transactions" element={<TransactionManager />} />
                    <Route path="/reports" element={<FinancialReport />} />
                    <Route path="/categorys" element={<CategoryManager />} />
                    <Route path="/budgets" element={<BudgetManager />} />
                    <Route path="/debts" element={<DebtManager />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
        </HashRouter>
    </AuthProvider>
  );
}

export default App;
