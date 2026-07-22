"use client";

import { useState } from "react";

import { createBidAction } from "@/actions/bids";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Props = {
  projectId: string;
};

export function CreateBidButton({ projectId }: Props) {
  const [open, setOpen] = useState(false);

  const action = createBidAction.bind(null, projectId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        New Bid
        </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Bid</DialogTitle>
          <DialogDescription>
            Create a new bid for this project.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-6">
          <div className="grid gap-4">
            <Input
              name="name"
              placeholder="Bid Name"
              required
            />

            <Input
              name="version"
              type="number"
              defaultValue={1}
              required
            />

            <Input
              name="status"
              defaultValue="Draft"
              required
            />

            <Input
              name="currency"
              defaultValue="GBP"
              required
            />

            <Input
              name="notes"
              placeholder="Notes (optional)"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              Create Bid
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}