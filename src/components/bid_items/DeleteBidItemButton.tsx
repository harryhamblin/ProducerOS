"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Trash2 } from "lucide-react";
import { deleteBidItemAction } from "@/actions/bid_items/deleteBidItem";

type DeleteBidItemButtonProps = {
  bidItemId: string;
  bidItemName: string;
  projectID: string;
  bidID: string;
};

export function DeleteBidItemButton({
  bidItemId,
  bidItemName,
  projectID,
  bidID,
}: DeleteBidItemButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="group inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent transition-colors hover:bg-blue-100"
      >
        <Trash2 className="h-4 w-4 text-red-500 transition-colors group-hover:text-black" />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Item?</AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete <strong>{bidItemName}</strong>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

            <form action={deleteBidItemAction}>
                    <input
                    type="hidden"
                    name="bidItemId"
                    value={bidItemId}
                    />

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction type="submit">
              Delete Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}