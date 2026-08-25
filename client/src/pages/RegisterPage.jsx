import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useDispatch, useSelector } from "react-redux";

import { registerUser } from "@/features/auth/authSlice";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { registerSchema } from "@/lib/validators";

export default function RegisterPage() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const isSubmitting = status === "loading";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  async function onSubmit(values) {
    const result = await dispatch(registerUser(values));

    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Sign up to start banking with us.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name Field */}
            <Field invalid={!!errors.fullName}>
              <FieldLabel>Full Name</FieldLabel>
              <FieldContent>
                <Input placeholder="Jane Doe" {...register("fullName")} />
              </FieldContent>
              <FieldError>{errors.fullName?.message}</FieldError>
            </Field>

            {/* Email Field */}
            <Field invalid={!!errors.email}>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  placeholder="jane@doe.com"
                  {...register("email")}
                />
              </FieldContent>
              <FieldError>{errors.email?.message}</FieldError>
            </Field>

            {/* Password Field */}
            <Field invalid={!!errors.password}>
              <FieldLabel>Password</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
              </FieldContent>
              <FieldError>{errors.password?.message}</FieldError>
            </Field>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
