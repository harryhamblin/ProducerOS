"use client";

import { useEffect, useState, useTransition } from "react";
import {
  editableFields,
  type EditableField,
} from "@/app/(main)/projects/[projectID]/bids/constants";
import {
  updateBidShot,
} from "@/app/(main)/projects/[projectID]/bids/[bidID]/actions";

type Props = {
  projectID: string;
  bidID: string;
  shotID: string;
  field: EditableField;
  value: string | number | null;
};

export default function EditableCell({
  projectID,
  bidID,
  shotID,
  field,
  value,
}: Props) {
  const [editing, setEditing] = useState(false);
const displayValue =
  value === null || value === 0
    ? ""
    : value.toString();

const [current, setCurrent] =
  useState(displayValue);
  const [isPending, startTransition] = useTransition();

useEffect(() => {
  setCurrent(
    value === null || value === 0
      ? ""
      : value.toString()
  );
}, [value]);

  function save() {
    setEditing(false);

    if (current === (value?.toString() ?? "")) {
      return;
    }

    startTransition(async () => {
      await updateBidShot(
        projectID,
        bidID,
        shotID,
        field,
        current
      );
    });
  }

  if (editing) {
    return (
      <input
  autoFocus
  type={
    field === "frames" ||
    field === "quantity" ||
    field === "foreign_spend"
      ? "number"
      : "text"
  }
  step={field === "foreign_spend" ? "0.01" : "1"}
  value={current}
  onChange={(e) => setCurrent(e.target.value)}
  onBlur={save}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      save();
    }

    if (e.key === "Escape") {
      setCurrent(value?.toString() ?? "");
      setEditing(false);
    }
  }}
  className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 outline-none"
/>
    );
  }

  return (
    <div
      onClick={() => !isPending && setEditing(true)}
      className="min-h-8 cursor-text rounded px-2 py-1 hover:bg-slate-800"
    >
      {field === "foreign_spend"
  ? current === ""
    ? ""
    : Number(current).toLocaleString("en-GB", {
        style: "currency",
        currency: "GBP",
      })
  : current}
    </div>
  );
}