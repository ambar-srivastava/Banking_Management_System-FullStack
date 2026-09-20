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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createStaffSchema } from "@/lib/validators";
import { createStaffUser } from "@/features/admin/adminSlice";

export function CreateStaffDialog() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const isSubmitting = useSelector(
    (state) => state.admin.createStatus === "loading",
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createStaffSchema),
    defaultValues: { fullName: "", email: "", password: "", role: "" },
  });

  async function onSubmit(values) {
    const result = await dispatch(createStaffUser(values));
    if (createStaffUser.fulfilled.match(result)) {
      toast.success("Staff account created");
      reset();
      setOpen(false);
    } else {
      toast.error(result.payload || "Could not create account");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Add Employee / Admin</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Staf Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field invalid={!!errors.fullName}>
            <FieldLabel>Full Name</FieldLabel>
            <FieldContent>
              <Input {...register("fullName")} />
            </FieldContent>
            <FieldError>{errors.fullName?.message}</FieldError>
          </Field>
          <Field invalid={!!errors.email}>
            <FieldLabel>Email</FieldLabel>
            <FieldContent>
              <Input type="email" {...register("email")} />
            </FieldContent>
            <FieldError>{errors.email?.message}</FieldError>
          </Field>
          <Field invalid={!!errors.password}>
            <FieldLabel>Temporary Password</FieldLabel>
            <FieldContent>
              <Input type="password" {...register("password")} />
            </FieldContent>
            <FieldError>{errors.password?.message}</FieldError>
          </Field>
          <Field invalid={!!errors.role}>
            <FieldLabel>Role</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldContent>
            <FieldError>{errors.role?.message}</FieldError>
          </Field>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
