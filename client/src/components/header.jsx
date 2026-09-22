import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Menu } from "lucide-react";
import { logout } from "@/features/auth/authSlice";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/accounts", label: "Accounts" },
  { to: "/loans", label: "Loans" },
  { to: "/security", label: "Security" },
  { to: "/analytics", label: "Analytics" },
];

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.user?.role);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
  }

  const links = [
    ...NAV_LINKS,
    ...(role === "employee" || role === "admin"
      ? [{ to: "/admin/users", label: "Manage Users" }]
      : []),
  ];

  return (
    <header className="flex items-center justify-between border-b px-4 py-4 sm:px-6">
      <div className="flex items-center gap-6">
        <span className="font-semibold">Banking Management System</span>
        <nav className="hidden gap-4 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button variant="outline" size="icon" onClick={handleLogout}>
          <LogOut className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Log out</span>
        </Button>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4 mt-4">
              {links.map((link) => (
                <SheetClose key={link.to} asChild>
                  <Link
                    to={link.to}
                    className="block rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
