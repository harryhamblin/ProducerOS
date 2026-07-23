import { EditableType } from "@/components/editable/types";

export function parseValue(
  value: string,
  type: EditableType
): string | number | null {

  switch (type) {

    case "number": {

      const n = Number(value);

      if (Number.isNaN(n)) {
        throw new Error("Please enter a valid number.");
      }

      return n;

    }

    case "currency": {

      const n = Number(value);

      if (Number.isNaN(n)) {
        throw new Error("Please enter a valid currency value.");
      }

      return n;

    }

    case "percent": {

      const n = Number(value);

      if (Number.isNaN(n)) {
        throw new Error("Please enter a valid percentage.");
      }

      if (n < 0 || n > 100) {
        throw new Error("Percentage must be between 0 and 100.");
      }

      return n;

    }

    case "date": {

      if (!value) {
        return null;
      }

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        throw new Error("Please enter a valid date.");
      }

      return value;

    }

    default:
      return value;

  }

}