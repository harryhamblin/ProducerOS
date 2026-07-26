"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type UpdateFieldParams = {
  table: string;
  rowId: string;
  field: string;
  value: unknown;
  revalidatePath?: string;
};

export async function updateField({
  table,
  rowId,
  field,
  value,
  revalidatePath: path,
}: UpdateFieldParams) {
  const supabase = await createClient();

  const { error } = await supabase
    .from(table)
    .update({
      [field]: value,
    })
    .eq("id", rowId);

  if (error) throw error;

  if (path) {
    revalidatePath(path);
  }
}