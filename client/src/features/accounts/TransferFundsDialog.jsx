import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { transferSchema } from "@/lib/validators";
import { transferFunds } from "./accountSlice";

export function TransferFundsDialog({ accounts = [] }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("form"); // 'form' | 'confirm'
  const [pendingValues, setPendingValues] = useState(null);
  const isSubmitting = useSelector(
    (state) => state.accounts.transferStatus === "loading",
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transferSchema),
    defaultValues: { fromAccountId: "", toAccountNumber: "", amount: "" },
  });

  function onReview(values) {
    setPendingValues(values);
    setStep("confirm");
  }

  async function handleConfirm() {
    const result = await dispatch(
      transferFunds({
        fromAccountId: Number(pendingValues.fromAccountId),
        toAccountNumber: pendingValues.toAccountNumber,
        amount: pendingValues.amount,
      }),
    );
    if (transferFunds.fulfilled.match(result)) {
      toast.success("Transfer Successful");
      reset();
      setStep("form");
      setOpen(false);
    } else {
      toast.error(result.payload || "Transfer Failed");
      setStep("form");
    }
  }

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setStep("form");
      reset();
    }
  }

  const fromAccount = accounts.find(
    (a) => String(a.id) === pendingValues?.fromAccountId,
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="secondary" />}>
        Transfer Funds
      </DialogTrigger>
      <DialogContent>
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>Transfer Funds</DialogTitle>
              <DialogDescription>
                Enter the transfer details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onReview)} className="space-y-4">
              <Field invalid={!!errors.fromAccountId}>
                <FieldLabel>From Account</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="fromAccountId"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((acc) => (
                            <SelectItem key={acc.id} value={String(acc.id)}>
                              {acc.account_number} - Rs.{" "}
                              {parseFloat(acc.balance).toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FieldContent>
                <FieldError>{errors.fromAccountId?.message}</FieldError>
              </Field>

              <Field invalid={!!errors.toAccountNumber}>
                <FieldLabel>To Account Number</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="Recipient account number"
                    {...register("toAccountNumber")}
                  />
                </FieldContent>
                <FieldError>{errors.toAccountNumber?.message}</FieldError>
              </Field>

              <Field invalid={!!errors.amount}>
                <FieldLabel>Amount</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("amount")}
                  />
                </FieldContent>
                <FieldError>{errors.amount?.message}</FieldError>
              </Field>

              <DialogFooter>
                <Button type="submit">Review Transfer</Button>
              </DialogFooter>
            </form>
          </>
        )}

        {step === "confirm" && pendingValues && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Transfer</DialogTitle>
              <DialogDescription>
                Please review the details - this cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 rounded-md border p-4 text-sm">
              <p>
                <span className="text-muted-foreground mr-1">Form:</span>
                {fromAccount?.account_number}
              </p>
              <p>
                <span className="text-muted-foreground mr-1">To:</span>
                {pendingValues.toAccountNumber}
              </p>
              <p>
                <span className="text-muted-foreground mr-1">Amount:</span>
                Rs. {parseFloat(pendingValues.amount).toFixed(2)}
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("form")}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button onClick={handleConfirm} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Confirm & Send"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
