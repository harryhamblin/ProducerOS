"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface EditableTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  editing: boolean;
}

export const EditableTextInput = React.forwardRef<
  HTMLInputElement,
  EditableTextInputProps
>(({ className, editing, ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        "h-9 w-full rounded-md border px-3 text-sm outline-none transition-colors",
        editing
          ? "border-blue-500 bg-slate-900"
          : "border-transparent bg-transparent hover:border-slate-700 hover:bg-slate-800",
        className
      )}
    />
  );
});

EditableTextInput.displayName = "EditableTextInput";