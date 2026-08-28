import { useSelector } from "react-redux";
import { Header } from "@/components/header";
import { CustomerLoanView } from "@/features/loans/CustomerLoanView";
import { EmployeeLoanQueue } from "@/features/loans/EmployeeLoanQueue";

export default function LoansPage() {
  const role = useSelector((state) => state.auth.user?.role);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl space-y-6 p-6">
        <h1 className="text-2xl font-bold">Loans</h1>
        {role === "customer" && <CustomerLoanView />}
        {(role === "employee" || role === "admin") && <EmployeeLoanQueue />}
      </main>
    </div>
  );
}
