import { EditableType } from "@/components/editable/types";

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function formatDisplayValue(
  value: string | number | null,
  type: EditableType = "text"
): string {
  if (value === null || value === "") {
    return "—";
  }

  switch (type) {
    case "currency":
      return currencyFormatter.format(Number(value));

    case "percent":
      return `${Number(value).toFixed(1)}%`;

    case "number":
      return Number(value).toLocaleString();

    case "date":
      return new Date(value.toString()).toLocaleDateString("en-GB");

    default:
      return value.toString();
  }
}

export function formatEditorValue(
  value: string | number | null
): string {
  if (value === null) {
    return "";
  }

  return value.toString();
}