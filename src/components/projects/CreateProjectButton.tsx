"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateProjectButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
  + New Project
</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create a new production project.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input placeholder="Project Name" />
          <Input placeholder="Project Code" />
          <Input type="number" placeholder="Current Award (£)" />
          <Input type="number" placeholder="Foreign Spend (£)" />
          <Input type="number" placeholder="Shot Count" />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}