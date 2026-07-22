"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleContinue() {
    setError("");

    if (!displayName.trim()) {
      setError("Please enter a display name.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("users").insert({
      id: user.id,
      display_name: displayName.trim(),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow">
        <h1 className="text-2xl font-bold">
          Welcome to ProducerOS
        </h1>

        <p className="mt-2 text-muted-foreground">
          Choose a display name for your account.
        </p>

        <Input
          className="mt-6"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        {error && (
          <p className="mt-3 text-sm text-red-500">
            {error}
          </p>
        )}

        <Button
          className="mt-6 w-full"
          disabled={loading}
          onClick={handleContinue}
        >
          {loading ? "Creating Account..." : "Continue"}
        </Button>
      </div>
    </main>
  );
}