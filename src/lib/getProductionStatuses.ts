import { createClient } from "@/lib/supabase/server";

export type ProductionStatusOption = {
  value: number;
  label: string;
  colour: string;
};

export async function getProductionStatuses() {
  const supabase = await createClient();

const { data, error } = await supabase
  .from("production_statuses")
  .select("id, name, colour")
  .order("id", { ascending: true });

  console.log("RAW production_statuses:", data);
  console.log("ERROR:", error);

  if (error) throw error;

  return data.map(status => ({
    value: status.id,
    label: status.name,
    colour: status.colour,
  }));
}