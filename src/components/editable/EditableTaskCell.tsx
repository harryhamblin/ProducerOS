"use client";

import { useEffect, useState, useTransition } from "react";
import { updateCell } from "@/actions/editable/updateCell";

type Props = {
  table: string;
  rowId: string | number;
  field: string;
  value: number;
  revalidatePath?: string;
};

export default function EditableTaskCell({
  table,
  rowId,
  field,
  value,
  revalidatePath,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState(value.toString());
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCurrent(value.toString());
  }, [value]);

  function save() {
    setEditing(false);

    const newValue = Number(current);

    if (newValue === value) {
      return;
    }

    startTransition(async () => {
      await updateCell({
        table,
        rowId,
        field,
        value: isNaN(newValue) ? 0 : newValue,
        revalidatePath,
      });
    });
  }

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        step="0.25"
        min="0"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();

          if (e.key === "Escape") {
            setCurrent(value.toString());
            setEditing(false);
          }
        }}
        className="w-full px-2 py-1 text-center outline-none bg-slate-800"
      />
    );
  }

  return (
    <div
      onClick={() => !isPending && setEditing(true)}
      className="
        w-full
        px-2
        py-1
        text-center
        cursor-text
        transition-colors
        duration-100
        hover:bg-slate-800
        "
    >
      {value}
    </div>
  );
}