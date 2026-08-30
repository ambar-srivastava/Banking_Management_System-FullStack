import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "./components/protected-route";

import { LoginSkeleton } from "./components/skeletons/LoginSkeleton";
import { RegisterSkeleton } from "./components/skeletons/RegisterSkeleton";
import { DashboardSkeleton } from "./components/skeletons/DashboardSkeleton";
import { AccountsSkeleton } from "./components/skeletons/AccountsSkeleton";
import { TransactionsSkeleton } from "./components/skeletons/TransactionsSkeleton";
import { LoansSkeleton } from "./components/skeletons/LoansSkeleton";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const AccountsPage = lazy(() => import("@/pages/AccountsPage"));
const TransactionsPage = lazy(() => import("@/pages/TransactionsPage"));
const LoansPage = lazy(() => import("@/pages/LoansPage"));

import { SocketManager } from "@/components/socket-manager";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <SocketManager />
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<LoginSkeleton />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<RegisterSkeleton />}>
              <RegisterPage />
            </Suspense>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="/accounts"
            element={
              <Suspense fallback={<AccountsSkeleton />}>
                <AccountsPage />
              </Suspense>
            }
          />

          <Route
            path="/accounts/:accountId/transactions"
            element={
              <Suspense fallback={<TransactionsSkeleton />}>
                <TransactionsPage />
              </Suspense>
            }
          />

          <Route
            path="/loans"
            element={
              <Suspense fallback={<LoansSkeleton />}>
                <LoansPage />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
