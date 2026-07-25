import { createClient } from "@/lib/supabase/server";

export async function updateField(
  table: string,
  rowId: string,
  field: string,
  value: unknown
) {
  console.log("Updating", {
    table,
    rowId,
    field,
    value,
  });

  const supabase = await createClient();

  const { data, error } = await supabase
    .from(table)
    .update({
      [field]: value,
    })
    .eq("id", rowId)
    .select();

  console.log("Result:", data);

  if (error) {
    console.error(error);
    throw error;
  }
}