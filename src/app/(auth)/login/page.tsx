"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={signIn}
        className="rounded-md bg-white px-6 py-3 text-black shadow hover:bg-gray-100"
      >
        Continue with Google
      </button>
    </main>
  );
}