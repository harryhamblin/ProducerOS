import { createClient } from "@/lib/supabase/server";

export type ProductionStatusOption = {
  value: number;
  label: string;
  colour: string;
};

export async function getProductionStatuses(): Promise<ProductionStatusOption[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("production_statuses")
    .select("id, name, colour")
    .order("id");

  if (error) {
    throw error;
  }

  return data.map(status => ({
    value: status.id,
    label: status.name,
    colour: status.colour,
  }));
}