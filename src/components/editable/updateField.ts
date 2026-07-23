import { createClient } from "@/lib/supabase/server";

export async function updateField(
  table: string,
  rowId: string,
  field: string,
  value: unknown
) {

  const supabase = await createClient();

  const { error } = await supabase
    .from(table)
    .update({
      [field]: value,
    })
    .eq("id", rowId);

  if (error) {
    throw error;
  }

}