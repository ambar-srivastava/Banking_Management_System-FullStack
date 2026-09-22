import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "@/features/transactions/transactionSlice";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TableBody,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { TransactionsSkeleton } from "@/components/skeletons/TransactionsSkeleton";

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "deposit", label: "Deposit" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "transfer_in", label: "Transfer In" },
  { value: "transfer_out", label: "Transfer Out" },
];

const emptyFilters = {
  type: "all",
  startDate: "",
  endDate: "",
  minAmount: "",
  maxAmount: "",
};

export default function TransactionsPage() {
  const { accountId } = useParams();
  const dispatch = useDispatch();
  const { items, page, totalPages, total, status, error } = useSelector(
    (state) => state.transactions,
  );
  const account = useSelector((state) =>
    state.accounts.list.find((a) => String(a.id) === accountId),
  );
  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState({
    ...emptyFilters,
    page: 1,
  });

  useEffect(() => {
    const { type, ...rest } = appliedFilters;
    dispatch(
      fetchTransactions({
        accountId,
        filters: { ...rest, type: type === "all" ? undefined : type },
      }),
    );
  }, [dispatch, accountId, appliedFilters]);

  function applyFilters(e) {
    e.preventDefault();
    setAppliedFilters({ ...draftFilters, page: 1 });
  }

  function resetFilters() {
    setDraftFilters(emptyFilters);
    setAppliedFilters({ ...emptyFilters, page: 1 });
  }

  function goToPage(newPage) {
    setAppliedFilters((prev) => ({ ...prev, page: newPage }));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
        <div>
          <Link
            to="/accounts"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            U+02190 Back to Accounts
          </Link>
          <h1 className="mt-1 text-2xl font-bold">
            Transaction History {account ? `- ${account.account_number}` : ""}
          </h1>
        </div>

        <form
          onSubmit={applyFilters}
          className="flex flex-wrap items-end gap-3"
        >
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Type</label>
            <Select
              value={draftFilters.type}
              onValueChange={(v) => setDraftFilters((f) => ({ ...f, type: v }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">From</label>
            <Input
              type="date"
              value={draftFilters.startDate}
              onChange={(e) =>
                setDraftFilters((f) => ({ ...f, startDate: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">To</label>
            <Input
              type="date"
              value={draftFilters.endDate}
              onChange={(e) =>
                setDraftFilters((f) => ({ ...f, endDate: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Min Amount</label>
            <Input
              type="number"
              step="0.01"
              className="w-28"
              value={draftFilters.minAmount}
              onChange={(e) =>
                setDraftFilters((f) => ({ ...f, minAmount: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Max Amount</label>
            <Input
              type="number"
              step="0.01"
              className="w-28"
              value={draftFilters.maxAmount}
              onChange={(e) =>
                setDraftFilters((f) => ({ ...f, maxAmount: e.target.value }))
              }
            />
          </div>
          <Button type="submit">Apply</Button>
          <Button type="button" variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </form>

        {status === "loading" && <TransactionsSkeleton />}
        {status === "failed" && <p className="text-destructive">{error}</p>}

        {status === "succeeded" && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Balance After
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No transactions match these filters.
                    </TableCell>
                  </TableRow>
                )}
                {items.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      {new Date(tx.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="capitalize">
                      {tx.type.replace("_", " ")}
                    </TableCell>
                    <TableCell>
                      Rs. {parseFloat(tx.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      Rs. {parseFloat(tx.balance_after).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Page {page} of {totalPages || 1} ({total} total)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => goToPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
