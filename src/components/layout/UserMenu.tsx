"use client";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type UserMenuProps = {
  displayName?: string | null;
};

export default function UserMenu({
  displayName,
}: UserMenuProps) {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
        {displayName ?? "Account"}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={signOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}