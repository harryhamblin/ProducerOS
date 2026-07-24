export type Project = {
  id: string;
  name: string;
  code: string;
  status_id: number;
  status: ProjectStatus;
  current_award: number | null;
  foreign_spend: number | null;
  item_count: number | null;
  created_at: string;
  updated_at: string;
};

export type ProjectStatus = {
  id: number;
  name: string;
  colour: string;
};