"use server";

import { revalidatePath } from "next/cache";
import { updateField } from "@/lib/editable/updateField";

interface UpdateFieldArgs {
  table: string;
  rowId: string;
  field: string;
  value: unknown;
  revalidate?: string;
}

export async function updateEditableField({
  table,
  rowId,
  field,
  value,
  revalidate,
}: UpdateFieldArgs) {
  await updateField(table, rowId, field, value);

  if (revalidate) {
    revalidatePath(revalidate);
  }
}
