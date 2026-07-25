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
        `
        w-full
        bg-transparent
        px-2
        py-1
        outline-none
        transition-colors duration-100
        `,
        editing
          ? "bg-slate-800"
          : "hover:bg-slate-800 cursor-text",
        className
      )}
    />
  );
});

EditableTextInput.displayName = "EditableTextInput";