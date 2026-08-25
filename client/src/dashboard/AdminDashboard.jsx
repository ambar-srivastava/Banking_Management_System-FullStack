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

export function AdminDashboard({ data }) {
  if (!data) {
    return <div className="p-4 text-center">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Accounts</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {data.totalAccounts}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Bank Balance</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            Rs. {parseFloat(data.totalBankBalance).toFixed(2)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users by Role</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {data?.usersByRole?.map((item) => (
            <Badge key={item.role} variant="secondary">
              {item.role}: {item.count}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flagged Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.flaggedTransactions?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No flagged transactions at this time.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.flaggedTransactions?.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      {new Date(tx.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{tx.full_name}</TableCell>
                    <TableCell>{tx.account_number}</TableCell>
                    <TableCell>
                      Rs. {parseFloat(tx.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
