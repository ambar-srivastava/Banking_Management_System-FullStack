import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { loanApplicationSchema } from "@/lib/validators";
import { calculateEMI } from "@/lib/loanCalculator";
import { applyForLoan } from "./loanSlice";

export function LoanApplicationForm() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.list);
  const isSubmitting = useSelector(
    (state) => state.loans.applyStatus === "loading",
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      accountId: "",
      principal: "",
      annualInterestRate: "",
      termMonths: "",
    },
  });

  const [principal, annualInterestRate, termMonths] = watch([
    "principal",
    "annualInterestRate",
    "termMonths",
  ]);
  const liveEMI = calculateEMI(principal, annualInterestRate, termMonths);

  async function onSubmit(values) {
    const result = await dispatch(
      applyForLoan({
        accountId: Number(values.accountId),
        principal: values.principal,
        annualInterestRate: values.annualInterestRate,
        termMonths: values.termMonths,
      }),
    );

    if (applyForLoan.fulfilled.match(result)) {
      toast.success("Loan application submitted");
      reset();
    } else {
      toast.error(result.payload || "Could not submit application");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for a Loan</CardTitle>
        <CardDescription>
          Your estimated EMI updates as you type.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field invalid={!!errors.accountId}>
            <FieldLabel>Account</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="accountId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select account to receive funds" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={String(acc.id)}>
                          {acc.account_number} ({acc.account_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldContent>
            <FieldError>{errors.accountId?.message}</FieldError>
          </Field>

          <Field invalid={!!errors.principal}>
            <FieldLabel>Loan Amount (Principal)</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                step="0.01"
                placeholder="50000"
                {...register("principal")}
              />
            </FieldContent>
            <FieldError>{errors.principal?.message}</FieldError>
          </Field>

          <Field invalid={!!errors.annualInterestRate}>
            <FieldLabel>Annual Interest Rate (%)</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                step="0.01"
                placeholder="10"
                {...register("annualInterestRate")}
              />
            </FieldContent>
            <FieldError>{errors.annualInterestRate?.message}</FieldError>
          </Field>

          <Field invalid={!!errors.termMonths}>
            <FieldLabel>Term (months)</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                placeholder="12"
                {...register("termMonths")}
              />
            </FieldContent>
            <FieldError>{errors.termMonths?.message}</FieldError>
          </Field>

          {liveEMI > 0 && (
            <div className="rounded-md border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Estimated Monthly EMI
              </p>
              <p className="text-2xl font-bold">Rs. {liveEMI.toFixed(2)}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
