"use client";

import { EditableInput } from "./EditableInput";
import { EditableDate } from "./EditableDate";
import { EditableSelect } from "./EditableSelect";

import { EditableCellProps } from "@/types/editable";

export function EditableCell(
  props: EditableCellProps
) {
  switch (props.type) {
    case "select":
      return <EditableSelect {...props} />;

    case "date":
      return <EditableDate {...props} />;

    case "text":
    case "number":
    case "currency":
    case "percent":
    default:
      return <EditableInput {...props} />;
  }
}