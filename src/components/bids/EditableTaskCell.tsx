"use client";

import { useEffect, useState, useTransition } from "react";
import { updateBidTask } from "@/app/(main)/projects/[projectID]/bids/[bidID]/actions";

type Props = {
  projectID: string;
  bidID: string;
  bidShotID: string;
  taskID: number;
  value: number;
};

export default function EditableTaskCell({
  projectID,
  bidID,
  bidShotID,
  taskID,
  value,
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
      await updateBidTask(
        projectID,
        bidID,
        bidShotID,
        taskID,
        isNaN(newValue) ? 0 : newValue
      );
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
        className="w-16 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-center outline-none"
      />
    );
  }

  return (
    <div
      onClick={() => !isPending && setEditing(true)}
      className="min-h-8 cursor-text rounded px-2 py-1 text-center hover:bg-slate-800"
    >
      {value === 0 ? "" : value}
    </div>
  );
}