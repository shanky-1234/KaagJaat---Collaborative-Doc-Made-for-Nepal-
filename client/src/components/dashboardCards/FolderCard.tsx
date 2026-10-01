import { formatDateandTime } from "@/utils/dateandtime/formatDateandTime";
import { Clock, EllipsisVertical, FileText, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "#components/ui/alert-dialog";
import { Button } from "#components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "#components/ui/dialog";
import { Input } from "#components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#components/ui/dropdown-menu";

type FolderCardProps = {
  title: string;
  date: string;
  documentCount?: number;
  onClick?: () => void;
  onRename?: (name: string) => void | Promise<void>;
  onDelete?: () => void;
};

function FolderCard({
  title,
  date,
  documentCount ,
  onClick,
  onRename,
  onDelete,
}: FolderCardProps) {
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showRename, setShowRename] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(title);

  const handleRenameSubmit = async () => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === title) {
      setShowRename(false);
      return;
    }
    await onRename?.(trimmed);
    setShowRename(false);
  };
  
  return (
    <div
      role="button"
      tabIndex={0}
      className="group w-full max-w-[240px] cursor-pointer text-left"
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="relative pt-5 transition-transform duration-300 group-hover:-translate-y-1">
        <div className="absolute left-0 top-2 h-7 w-2/5 rounded-t-lg bg-neutral-300" />

        <div className="relative h-32 overflow-hidden rounded-[8px_14px_14px_14px] bg-neutral-200 px-4 pt-4 shadow-sm">
          <div className="absolute inset-x-4 bottom-4 top-5">
            <div className="absolute inset-x-4 top-0 h-20 rotate-[-5deg] rounded-lg border border-neutral-200 bg-white/70" />
            <div className="absolute inset-x-2 top-1 h-20 rotate-[3deg] rounded-lg border border-neutral-200 bg-white/85" />
            <div className="absolute inset-x-0 top-3 h-20 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-neutral-500">
                <FileText size={14} />
                <span className="text-xs font-medium">Documents</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-neutral-200" />
                <div className="h-1.5 w-4/5 rounded-full bg-neutral-200" />
                <div className="h-1.5 w-3/5 rounded-full bg-neutral-200" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[70%] rounded-[14px_14px_12px_12px] bg-neutral-300 transition-colors duration-300 group-hover:bg-neutral-400" />
        </div>
      </div>

      <div className="px-1 pt-3">
        <div className="flex items-center justify-between gap-2">
          <h5 className="truncate">{title}</h5>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`More options for ${title}`}
              className="shrink-0 rounded-full p-1 text-neutral-500 hover:bg-neutral-100"
              onClick={(event) => event.stopPropagation()}
            >
              <EllipsisVertical size={17} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-1 border-neutral-300 ring-0! outline-0!">
              <DropdownMenuItem
                className="ring-0 outline-0 border-0 cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  setNewName(title);
                  setShowRename(true);
                }}
              >
                <div className="flex items-center gap-2">
                  <Pencil size={14} />
                  <span>Rename</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="ring-0 outline-0 border-0 cursor-pointer hover:bg-neutral-400"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowDelete(true);
                }}
              >
                <div className="flex items-center gap-2">
                  <Trash size={14} />
                  <span>Delete</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2 text-neutral-500">
          <span className="text-xs">{documentCount} documents</span>
          <span className="flex items-center gap-1 text-xs">
            <Clock size={12} />
            {formatDateandTime(date)}
          </span>
        </div>
      </div>

      <Dialog open={showRename} onOpenChange={setShowRename}>
        <DialogContent
          className="bg-white border border-neutral-300 outline-0! ring-0!"
          onClick={(event) => event.stopPropagation()}
        >
          <div>
            <DialogHeader className="text-xl font-bold">Rename Folder</DialogHeader>
            <DialogDescription>Enter a new name for this folder</DialogDescription>
          </div>
          <Input
            autoFocus
            value={newName}
            placeholder="Folder name"
            className="placeholder:text-neutral-400 ring-0! border-neutral-500"
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleRenameSubmit();
              }
            }}
          />
          <DialogFooter className="border-0">
            <div className="flex gap-2">
              <DialogClose>
                <Button>Cancel</Button>
              </DialogClose>
              <Button
                className="bg-primary rounded-lg text-white"
                onClick={() => void handleRenameSubmit()}
              >
                Rename
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent
          className="bg-white ring-0 border border-neutral-200"
          onClick={(event) => event.stopPropagation()}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-primary text-primary">
              Delete Folder
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{title}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="bg-neutral-100 border-0">
            <AlertDialogCancel className="bg-primary text-white cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default FolderCard;
