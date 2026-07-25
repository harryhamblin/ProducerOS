"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { updateField } from "@/actions/updateField";
import type { EditableCellProps } from "@/types/editable"

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
    let parsed: string | number | null;

    try {
      parsed = parseValue(text, type) as string | number | null;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Invalid value");
      cancel();
      return;
    }

    setEditing(false);

    startTransition(async () => {
      try {
        await updateField({
          table,
          rowId,
          field,
          value: parsed,
          revalidatePath,
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