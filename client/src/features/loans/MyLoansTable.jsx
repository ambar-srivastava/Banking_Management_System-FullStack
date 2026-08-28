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

const STATUS_VARIANT = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

export function MyLoansTable({ loans = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Loan Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Principal</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>EMI</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No loan applications yet.
                </TableCell>
              </TableRow>
            )}
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>
                  Rs. {parseFloat(loan.principal).toFixed(2)}
                </TableCell>
                <TableCell>{loan.annual_interest_rate}%</TableCell>
                <TableCell>{loan.term_months} mo</TableCell>
                <TableCell>
                  Rs. {parseFloat(loan.emi_amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={STATUS_VARIANT[loan.status]}
                    className="capitalize"
                  >
                    {loan.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
