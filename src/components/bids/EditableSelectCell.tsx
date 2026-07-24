"use client";

import { useState, useTransition } from "react";
import { updateBidItem } from "@/actions/bids/actions";

type Props = {
  projectID: string;
  bidID: string;
  itemID: string;
  value: string | null;
  options: readonly string[];
};

export default function EditableSelectCell({
  projectID,
  bidID,
  itemID,
  value,
  options,
}: Props) {
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [, startTransition] = useTransition();

  function handleChange(newValue: string) {
    setCurrentValue(newValue);

    startTransition(async () => {
      await updateBidItem(
        projectID,
        bidID,
        itemID,
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