import { EditableType } from "@/components/editable/types";

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function formatDisplayValue(
  value: string | number | null | undefined,
  type: EditableType = "text"
): string {
  if (value == null || value === "") {
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
      return new Date(String(value)).toLocaleDateString("en-GB");

    default:
      return String(value);
  }
}

export function formatEditorValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return String(value);
}