"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { updateEditableField } from "@/actions/updateField";

import { EditableCellProps } from "./types";

import {
  formatDisplayValue,
  formatEditorValue,
} from "@/components/editable/formatters";

import { parseValue } from "@/components/editable/validation";

import { EditableTextInput } from "./EditableTextInput";

export function EditableInput({
  table,
  rowId,
  field,
  value,
  type = "text",
  placeholder,
  disabled = false,
  revalidatePath,
}: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(formatEditorValue(value));
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) {
      setText(formatEditorValue(value));
    }
  }, [value, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function cancel() {
    setText(formatEditorValue(value));
    setEditing(false);
  }

  function save() {
    let parsed: unknown;

    try {
      parsed = parseValue(text, type);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Invalid value");
      cancel();
      return;
    }

    setEditing(false);

    startTransition(async () => {
      try {
        await updateEditableField({
          table,
          rowId,
          field,
          value: parsed,
          revalidate: revalidatePath,
        });
      } catch {
        setText(formatEditorValue(value));
      }
    });
  }

  return (
    <EditableTextInput
      ref={inputRef}
      editing={editing}
      readOnly={!editing}
      value={editing ? text : formatDisplayValue(value, type)}
      disabled={disabled || isPending}
      placeholder={placeholder}
      onClick={() => {
        if (!disabled && !editing) {
          setEditing(true);
        }
      }}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        if (editing) {
          save();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          save();
        }

        if (e.key === "Escape") {
          e.preventDefault();
          cancel();
        }
      }}
    />
  );
}