import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "@/features/dashboard/dashboardSlice";
import { Header } from "@/components/header";
import { CustomerDashboard } from "@/dashboard/CustomerDashboard";
import { EmployeeDashboard } from "@/dashboard/EmployeeDashboard";
import { AdminDashboard } from "@/dashboard/AdminDashboard";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { role, data, status, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Welcome, {user?.fullName}</h1>

        {status === "loading" && <DashboardSkeleton />}
        {status === "failed" && <p className="text-destructive">{error}</p>}
        {status === "succeeded" && role === "customer" && (
          <CustomerDashboard data={data} />
        )}
        {status === "succeeded" && role === "employee" && (
          <EmployeeDashboard data={data} />
        )}
        {status === "succeeded" && role === "admin" && (
          <AdminDashboard data={data} />
        )}
      </main>
    </div>
  );
}
