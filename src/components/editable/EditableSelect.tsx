"use client";

import { useState, useTransition } from "react";

import { updateField } from "@/actions/updateField";
import type { EditableCellProps } from "@/types/editable";

export function EditableSelect({
  table,
  rowId,
  field,
  value,
  options = [],
  revalidatePath,
  disabled,
}: EditableCellProps) {
  const [currentValue, setCurrentValue] = useState(
    value?.toString() ?? ""
  );

  const [, startTransition] = useTransition();

  function handleChange(newValue: string) {
    setCurrentValue(newValue);

    const selected = options.find(
      option => option.value.toString() === newValue
    );

    startTransition(async () => {
      await updateField({
        table,
        rowId,
        field,
        value: selected?.value ?? newValue,
        revalidatePath,
      });
    });
  }

  return (
<select
    value={currentValue}
    disabled={disabled}
    onChange={(e) => handleChange(e.target.value)}
    className={`
        w-full
        bg-transparent
        px-2
        py-1
        outline-none
        transition-colors duration-100
        hover:bg-slate-800
        cursor-pointer
        disabled:opacity-50
    `}
>
      {options.map(option => (
        <option
          key={option.value.toString()}
          value={option.value.toString()}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}