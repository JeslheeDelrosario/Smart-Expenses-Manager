import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import {
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
  PieChart,
  Receipt,
  Settings,
  Wallet,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
}

interface AppLayoutContextValue {
  openSidebar: () => void;
  toggleSidebar: () => void;
}

const AppLayoutContext = createContext<AppLayoutContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAppLayout() {
  const context = useContext(AppLayoutContext);

  if (!context) {
    throw new Error("useAppLayout must be used within AppLayout");
  }

  return context;
}

interface MobileMenuButtonProps {
  children: ReactNode;
  className: string;
  toggle?: boolean;
}

export function MobileMenuButton({
  children,
  className,
  toggle = false,
}: MobileMenuButtonProps) {
  const { openSidebar, toggleSidebar } = useAppLayout();

  return (
    <button onClick={toggle ? toggleSidebar : openSidebar} className={className}>
      {children}
    </button>
  );
}

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Transactions", icon: Receipt, path: "/transactions" },
  { label: "Budgets", icon: PieChart, path: "/budgets" },
  { label: "Income", icon: ArrowUpRight, path: "/income" },
  { label: "Account", icon: Wallet, path: "/account" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#1e293b] border-r border-[#4b5563] flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-[#4b5563]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#818cf8] rounded-xl flex items-center justify-center shadow-lg shadow-[#818cf8]/25">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ExpenseTracker</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[#818cf8] text-white shadow-lg shadow-[#818cf8]/25"
                    : "text-gray-400 hover:bg-[#334155] hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#4b5563]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <AppLayoutContext.Provider
        value={{
          openSidebar: () => setSidebarOpen(true),
          toggleSidebar: () => setSidebarOpen((isOpen) => !isOpen),
        }}
      >
        {children}
      </AppLayoutContext.Provider>
    </div>
  );
}
