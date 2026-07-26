export type EditableTable =
  | "bid_items"
  | "shots"
  | "assets"
  | "projects"
  | "bids"
  | "project_task_rates";

  export type EditableType =
  | "text"
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "select";

export interface SelectOption {
  label: string;
  value: string | number;
  colour?: string;
}

export interface EditableCellProps {
  table: EditableTable;
  rowId: string;

  field: string;

  value: string | number | null;

  type?: EditableType;

  options?: SelectOption[];

  placeholder?: string;

  disabled?: boolean;

  revalidatePath?: string;
}