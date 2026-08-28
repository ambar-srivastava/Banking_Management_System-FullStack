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
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { openAccountSchema } from "@/lib/validators";
import { openAccount } from "./accountSlice";

export function OpenAccountDialog() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const isSubmitting = useSelector(
    (state) => state.accounts.openStatus === "loading",
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(openAccountSchema),
    defaultValues: { accountType: "" },
  });

  async function onSubmit(values) {
    const result = await dispatch(openAccount(values));
    if (openAccount.fulfilled.match(result)) {
      toast.success("Account created");
      reset();
      setOpen(false);
    } else {
      toast.error(result.payload || "Could not create account");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Open New Account</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Open a new account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field invalid={!!errors.accountType}>
            <FieldLabel>Account Type</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="accountType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="checking">Checking</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldContent>
            <FieldError>{errors.accountType?.message}</FieldError>
          </Field>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Opening..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
