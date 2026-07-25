"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

type EditableTable =
  | "bid_items"
  | "shots"
  | "assets"
  | "projects";

type Params = {
  table: EditableTable;
  rowId: string;
  field: string;
  value: string | number | null;
  revalidatePath?: string;
};

export async function updateField({
  table,
  rowId,
  field,
  value,
  revalidatePath: path,
}: Params) {
  const supabase = await createClient();
  const updates: Record<string, string | number | null> = {
    [field]: value,
  };

  const { error } = await supabase
    .from(table)
    .update(updates)
    .eq("id", rowId);

  if (error) throw error;

  if (path) {
    revalidatePath(path);
  }
}