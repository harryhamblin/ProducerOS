"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type UpdateCellParams = {
  table: string;
  rowId: string | number;
  field: string;
  value: string | number | null;
  revalidatePath?: string;
};

export async function updateCell({
  table,
  rowId,
  field,
  value,
  revalidatePath: path,
}: UpdateCellParams) {
  const supabase = await createClient();

  const { error } = await supabase
    .from(table)
    .update({
      [field]: value,
    })
    .eq("id", String(rowId));

  if (error) {
    throw new Error(error.message);
  }

  if (path) {
    revalidatePath(path);
  }
}