import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { fetchPendingLoans, decideLoan } from "./loanSlice";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export function EmployeeLoanQueue() {
  const dispatch = useDispatch();
  const { pendingLoans, pendingStatus } = useSelector((state) => state.loans);
  const isDeciding = useSelector(
    (state) => state.loans.decideStatus === "loading",
  );
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchPendingLoans());
  }, [dispatch]);

  async function handleConfirm() {
    const { loan, decision } = confirmTarget;
    const result = await dispatch(decideLoan({ loanId: loan.id, decision }));

    if (decideLoan.fulfilled.match(result)) {
      toast.success(`Loan ${decision}`);
    } else {
      toast.error(result.payload || "Could not process decision");
    }
    setConfirmTarget(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Loan Application</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Principal</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>EMI</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingStatus === "succeeded" && pendingLoans.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No pending applications
                </TableCell>
              </TableRow>
            )}
            {pendingLoans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.full_name}</TableCell>
                <TableCell>{loan.account_number}</TableCell>
                <TableCell>
                  Rs. {parseFloat(loan.principal).toFixed(2)}
                </TableCell>
                <TableCell>{loan.annual_interest_rate}%</TableCell>
                <TableCell>{loan.term_months} months</TableCell>
                <TableCell>
                  Rs. {parseFloat(loan.emi_amount).toFixed(2)}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      setConfirmTarget({ loan, decision: "approved" })
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      setConfirmTarget({ loan, decision: "rejected" })
                    }
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <AlertDialog
        open={!!confirmTarget}
        onOpenChange={(isOpen) => !isOpen && setConfirmTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmTarget?.decision === "approved"
                ? "Approve this loan?"
                : "Reject this loan"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmTarget && (
                <>
                  {confirmTarget.loan.full_name} - Rs.{" "}
                  {parseFloat(confirmTarget.loan.principal).toFixed(2)} over{" "}
                  {confirmTarget.loan.term_months} months. This action cannot be
                  undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeciding}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isDeciding}>
              {isDeciding ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
