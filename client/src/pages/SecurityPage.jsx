import { Header } from "@/components/header";
import { TwoFactorSetup } from "@/features/auth/TwoFactorSetup";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-2xl space-y-6 p-6">
        <h1 className="text-2xl font-bold">Security Settings</h1>
        <TwoFactorSetup />
      </main>
    </div>
  );
}
