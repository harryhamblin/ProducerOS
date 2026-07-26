export type Project = {
  id: string;
  project_name: string;
  project_code: string;
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

export type ProjectSummary = {
  currentAward: number;
  foreignSpend: number;
  labour: number;
  shotCount: number;
  assetCount: number;
  itemCount: number;
};