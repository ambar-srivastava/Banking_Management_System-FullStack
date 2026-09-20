import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchBalancTrend } from "@/features/analytics/analyticsSlice";

const chartConfig = { balance: { label: "Balance", color: "var(--chart-1)" } };

export function BalanceTrendChart() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.list);
  const { balanceTrend, balanceTrendStatus } = useSelector(
    (state) => state.analytics,
  );
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    if (accounts.length > 0 && !accountId) setAccountId(String(accounts[0].id));
  }, [accounts, accountId]);

  useEffect(() => {
    if (accountId) dispatch(fetchBalancTrend(accountId));
  }, [dispatch, accountId]);

  const formatted = balanceTrend.map((row) => ({
    date: new Date(row.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    balance: parseFloat(row.balance_after),
  }));

  const selectedAccount = accounts.find(
    (acc) => String(acc.id) === String(accountId),
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Balance Over Time</CardTitle>
          <CardDescription>Based on transaction history</CardDescription>
        </div>
        {/* <Select value={accountId} onValueChange={setAccountId}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((acc) => (
              <SelectItem key={acc.id} value={String(acc.id)}>
                {acc.account_number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
        <Select value={accountId} onValueChange={setAccountId}>
          <SelectTrigger className="w-60"> {/* Slightly wider to fit the type */}
            <SelectValue placeholder="Select account">
              {selectedAccount
                ? `${selectedAccount.account_number} (${selectedAccount.account_type})`
                : "Select account"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {accounts.map((acc) => (
              <SelectItem key={acc.id} value={String(acc.id)}>
                {acc.account_number} ({acc.account_type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {balanceTrendStatus === "succeeded" && formatted.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No transactions yet on this account.
          </p>
        )}
        {formatted.length > 0 && (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <LineChart data={formatted}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={60} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="balance"
                type="monotone"
                stroke="var(--color-balance)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
