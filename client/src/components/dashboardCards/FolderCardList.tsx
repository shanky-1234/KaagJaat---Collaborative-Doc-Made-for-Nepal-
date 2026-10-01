import { formatDateandTime } from "@/utils/dateandtime/formatDateandTime";
import { Clock, EllipsisVertical, FileText } from "lucide-react";

type FolderCardListProps = {
  title: string;
  date: string;
  documentCount?: number;
  onClick?: () => void;
};

function FolderCardList({
  title,
  date,
  documentCount = 3,
  onClick,
}: FolderCardListProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#D1D1D1] px-3 py-2 text-left transition-colors duration-200 hover:bg-neutral-50"
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="relative h-10 w-14 shrink-0 pt-2">
        <div className="absolute left-0 top-1 h-3 w-6 rounded-t-md bg-neutral-300" />
        <div className="absolute inset-x-2 top-0 h-9 rotate-[-5deg] rounded-md border border-neutral-200 bg-white" />
        <div className="absolute inset-x-1 top-1 h-9 rotate-[3deg] rounded-md border border-neutral-200 bg-white" />
        <div className="absolute inset-x-0 bottom-0 h-8 rounded-md bg-neutral-200" />
        <div className="absolute inset-x-0 bottom-0 h-5 rounded-md bg-neutral-300 transition-colors group-hover:bg-neutral-400" />
        <FileText className="absolute bottom-1 left-1/2 -translate-x-1/2 text-neutral-500" size={13} />
      </div>

      <div className="min-w-0 flex-1">
        <h5 className="truncate">{title}</h5>
        <span className="text-xs text-neutral-500">{documentCount} documents</span>
      </div>

      <div className="hidden shrink-0 items-center gap-1 text-neutral-500 sm:flex">
        <Clock size={12} />
        <span className="whitespace-nowrap text-xs">
          Edited {formatDateandTime(date)}
        </span>
      </div>
      <button
        type="button"
        aria-label={`More options for ${title}`}
        className="shrink-0 rounded-full p-1 text-neutral-500 hover:bg-neutral-100"
        onClick={(event) => event.stopPropagation()}
      >
        <EllipsisVertical size={17} />
      </button>
    </div>
  );
}

export default FolderCardList;
