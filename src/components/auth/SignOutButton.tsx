"use client";

import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  async function signOut() {
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <button
      onClick={signOut}
      className="mt-8 rounded bg-red-600 px-4 py-2 hover:bg-red-700"
    >
      Sign Out
    </button>
  );
}