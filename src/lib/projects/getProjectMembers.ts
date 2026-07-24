import { createClient } from "@/lib/supabase/server";

export async function getProjectMembers(projectId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_members")
    .select(`
      user:users (
        id,
        display_name,
        email,
        user_group
      )
    `)
    .eq("project_id", projectId);

  if (error) {
    throw error;
  }

  return data.map((member) => member.user);
}