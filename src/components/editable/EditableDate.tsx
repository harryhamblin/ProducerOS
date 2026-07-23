"use client";

import { EditableInput } from "./EditableInput";
import { EditableCellProps } from "./types";

export function EditableDate(
  props: EditableCellProps
) {
  return (
    <EditableInput
      {...props}
      type="date"
    />
  );
}