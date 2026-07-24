export const cost_type = [
  { label: "Full Cost", value: "Full Cost" },
  { label: "Additional", value: "Additional" },
];

export type CostType = (typeof cost_type)[number];

export const editableFields = [
  "shot_code",
  "frames",
  "cost_type",
  "vfx_work_requirements",
  "vendor_notes",
  "foreign_spend",
  "quantity",
] as const;

export type EditableField = (typeof editableFields)[number];