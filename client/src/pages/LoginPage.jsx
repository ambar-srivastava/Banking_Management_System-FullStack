import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { loginSchema } from "@/lib/validators";
import { loginUser, verifyTwoFactorLogin } from "@/features/auth/authSlice";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const pending2FA = useSelector((state) => state.auth.pending2FA);
  const isSubmitting = status === "loading";
  const [otp, setOtp] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    const result = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(result)) {
      if (!result.payload.requires2FA) {
        toast.success(`Welcome back, ${result.payload.user.fullName}`);
        navigate("/dashboard");
      }
    } else {
      toast.error(result.payload || "Login failed");
    }
  }

  async function handleVerify2FA() {
    const result = await dispatch(
      verifyTwoFactorLogin({ preAuthToken: pending2FA, token: otp }),
    );
    if (verifyTwoFactorLogin.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.fullName}`);
      navigate("/dashboard");
    } else {
      toast.error(result.payload || "Invalid code");
      setOtp("");
    }
  }

  if (pending2FA) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              className="w-full"
              disabled={otp.length !== 6 || isSubmitting}
              onClick={handleVerify2FA}
            >
              {isSubmitting ? "Verifying…" : "Verify"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field invalid={!!errors.email}>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  placeholder="jane@example.com"
                  {...register("email")}
                />
              </FieldContent>
              <FieldError>{errors.email?.message}</FieldError>
            </Field>
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in…" : "Log in"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
