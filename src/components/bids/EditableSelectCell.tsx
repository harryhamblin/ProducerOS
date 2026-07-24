"use client";

import { useState, useTransition } from "react";
import { updateBidShot } from "@/actions/bids/actions";

type Props = {
  projectID: string;
  bidID: string;
  shotID: string;
  value: string | null;
  options: readonly string[];
};

export default function EditableSelectCell({
  projectID,
  bidID,
  shotID,
  value,
  options,
}: Props) {
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [, startTransition] = useTransition();

  function handleChange(newValue: string) {
    setCurrentValue(newValue);

    startTransition(async () => {
      await updateBidShot(
        projectID,
        bidID,
        shotID,
        "cost_type",
        newValue
      );
    });
  }

  return (
    <select
      value={currentValue}
      onChange={(e) => handleChange(e.target.value)}
      className="w-full bg-transparent border-0 outline-none px-2 py-1 text-sm"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}