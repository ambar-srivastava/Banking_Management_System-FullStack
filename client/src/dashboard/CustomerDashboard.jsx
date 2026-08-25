import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function CustomerDashboard({ data }) {
  if (!data) {
    return <div className="p-4 text-center">Loading Dashboard...</div>;
  }
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            Rs. {parseFloat(data.totalBalance).toFixed(2)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {data.accountCount}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {data.loanSummary.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No loan applications yet.
            </p>
          )}
          {data.loanSummary.map((item) => (
            <Badge key={item.status} variant="secondary">
              {item.status}: {item.count}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Account</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    {new Date(tx.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>Rs. {parseFloat(tx.amount).toFixed(2)}</TableCell>
                  <TableCell>{tx.account_number}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
