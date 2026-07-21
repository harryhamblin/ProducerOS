"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function signIn() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for a login link.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-slate-800 p-8">
        <h1 className="text-3xl font-bold">ProducerOS</h1>

        <input
          className="w-full rounded border border-slate-700 bg-slate-900 p-2"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="w-full rounded bg-blue-600 p-2 hover:bg-blue-700"
          onClick={signIn}
        >
          Send Magic Link
        </button>

        {message && (
          <p className="text-sm text-slate-400">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}