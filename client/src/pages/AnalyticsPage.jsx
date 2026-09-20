import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccounts } from "@/features/accounts/accountSlice";
import { fetchAnalytics } from "@/features/analytics/analyticsSlice";
import { Header } from "@/components/header";
import { MonthlyTrendChart } from "@/features/analytics/MonthlyTrendChart";
import { SpendingBreakdownChart } from "@/features/analytics/SpendingBreakdownChart";
import { BalanceTrendChart } from "@/features/analytics/BalanceTrendChart";
import { AnalyticsSkeleton } from "@/components/skeletons/AnalyticsSkeleton";

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const accountsStatus = useSelector((state) => state.accounts.status);
  const { monthlyTrend, spendingByType, status, error } = useSelector(
    (state) => state.analytics,
  );

  useEffect(() => {
    if (accountsStatus === "idle") dispatch(fetchAccounts());
    dispatch(fetchAnalytics());
  }, [dispatch, accountsStatus]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl space-y-6 p-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        {status === "loading" && <AnalyticsSkeleton />}
        {status === "failed" && <p className="text-destructive">{error}</p>}
        {status === "succeeded" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <MonthlyTrendChart data={monthlyTrend} />
              <SpendingBreakdownChart data={spendingByType} />
            </div>
            <BalanceTrendChart />
          </div>
        )}
      </main>
    </div>
  );
}
