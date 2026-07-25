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

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProjectAction } from "@/actions/projects/projects";

type DeleteProjectButtonProps = {
  projectId: string;
  projectName: string;
};

export function DeleteProjectButton({
  projectId,
  projectName,
}: DeleteProjectButtonProps) {
  return (
    <AlertDialog>
        <AlertDialogTrigger
          className="group inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent transition-colors hover:bg-blue-100"
        >
          <Trash2 className="h-4 w-4 text-red-500 transition-colors group-hover:text-black" />
        </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Project?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete <strong>{projectName}</strong>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form action={deleteProjectAction}>
          <input
            type="hidden"
            name="projectId"
            value={projectId}
          />

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction type="submit">
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}