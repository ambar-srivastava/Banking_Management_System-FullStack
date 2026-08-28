import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAccounts } from "@/features/accounts/accountSlice";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccountsSkeleton } from "@/components/skeletons/AccountsSkeleton";
import { OpenAccountDialog } from "@/features/accounts/OpenAccountDialog";
import { TransferFundsDialog } from "@/features/accounts/TransferFundsDialog";

export default function AccountsPage() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { list, status, error } = useSelector((state) => state.accounts);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAccounts());
    }
  }, [status, dispatch]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Accounts</h1>
          <div className="flex gap-2">
            <OpenAccountDialog />
            {list.length > 0 && <TransferFundsDialog accounts={list} />}
          </div>
        </div>

        {status === "loading" && <AccountsSkeleton />}
        {status === "failed" && <p className="text-destructive">{error}</p>}

        {status === "succeeded" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {list.length === 0 && (
              <p className="text-sm text-muted-foreground">
                You have no accounts yet - open one to get started.
              </p>
            )}

            {list.map((account) => (
              <Card key={account.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">
                    {account.account_number}
                  </CardTitle>
                  <Badge
                    variant={
                      account.status === "active" ? "default" : "secondary"
                    }
                  >
                    {account.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground capitalize">
                    {account.account_type}
                  </p>
                  <p className="text-2xl font-bold">
                    Rs. {parseFloat(account.balance).toFixed(2)}
                  </p>
                  <Button
                    render={
                      <Link to={`/accounts/${account.id}/transactions`} />
                    }
                    variant="link"
                    className="px-0 mt-2"
                    nativeButton={false}
                  >
                    View Transactions &rarr;
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
