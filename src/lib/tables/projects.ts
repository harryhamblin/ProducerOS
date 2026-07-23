import { EditableType } from "@/components/editable/types";

export interface ColumnDefinition {

  field: string;

  title: string;

  type?: EditableType;

  editable?: boolean;

  align?: "left" | "center" | "right";

  width?: string;

}

export const ProjectColumns: ColumnDefinition[] = [

{
  field: "name",
  title: "Project",
  type: "text",
  editable: true,
},

{
  field: "code",
  title: "Code",
  type: "text",
  editable: true,
},

{
  field: "status",
  title: "Status",
  type: "select",
  editable: true,
},

{
  field: "current_award",
  title: "Award",
  type: "currency",
  editable: true,
  align: "right",
},

{
  field: "foreign_spend",
  title: "Foreign",
  type: "currency",
  editable: true,
  align: "right",
},

{
  field: "foreign_percentage",
  title: "Foreign %",
  editable: false,
  align: "right",
},

{
  field: "shot_count",
  title: "Shots",
  editable: false,
  align: "right",
},

];