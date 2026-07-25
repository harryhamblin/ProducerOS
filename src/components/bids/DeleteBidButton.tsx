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
import { deleteBidAction } from "@/actions/bids/deleteBid";

type DeleteBidButtonProps = {
  bidId: string;
  bidItemName: string;
};

export function DeleteBidButton({
  bidId,
  bidItemName,
}: DeleteBidButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="group inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent transition-colors hover:bg-blue-100"
      >
        <Trash2 className="h-4 w-4 text-red-500 transition-colors group-hover:text-black" />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Bid?</AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete <strong>{bidItemName}</strong>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form action={deleteBidAction}>
          <input
            type="hidden"
            name="bidId"
            value={bidId}
          />

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction type="submit">
              Delete Bid
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}