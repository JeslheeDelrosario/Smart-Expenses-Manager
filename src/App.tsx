import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/Login";
import SignupPage from "./pages/Signup";
import DashboardPage from "./pages/Dashboard";
import TransactionsPage from "./pages/Transactions";
import IncomePage from "./pages/Income";
import BudgetsPage from "./pages/Budgets";
import AccountPage from "./pages/Account";
import SettingsPage from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/income" element={<IncomePage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;