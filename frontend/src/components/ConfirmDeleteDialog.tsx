import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

type ConfirmDialogProps = {
  open: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  cancelButtonText?: string;
  onCancelButton: () => void;
  deleteButtonText?: string;
  onDeleteButton: () => void;
};

export const ConfirmDeleteDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onChange,
  title,
  description,
  cancelButtonText = "Cancel",
  onCancelButton,
  deleteButtonText = "Delete",
  onDeleteButton,
}) => {
  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancelButton}>
            {cancelButtonText}
          </Button>
          <Button
            onClick={onDeleteButton}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
