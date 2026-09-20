import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  setupTwoFactorRequest,
  verifyTwoFactorSetupRequest,
} from "@/services/twoFactorService";

export function TwoFactorSetup() {
  const [step, setStep] = useState("idle");
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleStart() {
    setIsLoading(true);
    try {
      const result = await setupTwoFactorRequest();
      setQrCode(result.qrCode);
      setSecret(result.secret);
      setStep("scanning");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify() {
    setIsLoading(true);
    try {
      await verifyTwoFactorSetupRequest(otp);
      toast.success("2FA enabled successfully");
      setStep("done");
    } catch (err) {
      toast.error(err.message);
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security using an authenticator app.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "idle" && (
          <Button onClick={handleStart} disabled={isLoading}>
            {isLoading ? "Starting…" : "Enable 2FA"}
          </Button>
        )}

        {step === "scanning" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Scan this QR code with Google Authenticator, Authy, or a similar
              app.
            </p>
            <img
              src={qrCode}
              alt="2FA QR Code"
              className="mx-auto h-48 w-48 rounded-md border"
            />
            <p className="text-center text-xs text-muted-foreground">
              Can't scan it? Enter this code manually:{" "}
              <code className="font-mono">{secret}</code>
            </p>
            <div className="flex flex-col items-center gap-3">
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
                onClick={handleVerify}
                disabled={otp.length !== 6 || isLoading}
                className="w-full"
              >
                {isLoading ? "Verifying…" : "Confirm & Enable"}
              </Button>
            </div>
          </div>
        )}

        {step === "done" && (
          <p className="text-sm text-green-600 dark:text-green-400">
            ✓ Two-factor authentication is now enabled on your account.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
