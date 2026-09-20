import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { logout } from "@/features/auth/authSlice";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = useSelector((state) => state.auth.user?.role);

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      {/* Left Side */}
      <div className="flex items-center gap-6">
        <span className="font-semibold">Banking Management System</span>
        <nav className="flex gap-4 text-sm">
          <Link
            to="/dashboard"
            className="text-muted-foreground hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            to="/accounts"
            className="text-muted-foreground hover:text-foreground"
          >
            Accounts
          </Link>
          <Link
            to="/loans"
            className="text-muted-foreground hover:text-foreground"
          >
            Loans
          </Link>
          <Link
            to="/security"
            className="text-muted-foreground hover:text-foreground"
          >
            Security
          </Link>
          <Link
            to="/analytics"
            className="text-muted-foreground hover:text-foreground"
          >
            Analytics
          </Link>

          {(role === "employee" || role === "admin") && (
            <Link
              to="/admin/users"
              className="text-muted-foreground hover:text-foreground"
            >
              Manage Users
            </Link>
          )}
        </nav>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button variant="outline" size="icon" onClick={handleLogout}>
          <LogOut className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Log out</span>
        </Button>
      </div>
    </header>
  );
}
