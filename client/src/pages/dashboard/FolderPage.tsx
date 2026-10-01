import DocumentCard from "#components/dashboardCards/DocumentCard";
import DocumentCardList from "#components/dashboardCards/DocumentCardList";
import { Button } from "#components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "#components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";
import { documentHandler } from "@/services/documentHandler";
import { folderService } from "@/services/folderHandler";
import type { DocumentResponse } from "@/types/documentResponse";
import type { folderResponseProps } from "@/types/folder";
import { ArrowLeft, Grid3X3, List, ListFilter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router";

type ViewType = "grid" | "list";
type SortType = "latest" | "earliest" | "az" | "za";

function FolderPage() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [folderData, setFolderData] = useState<folderResponseProps>();
  const [folderDocuments, setFolderDocuments] = useState<DocumentResponse[]>([]);
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [sortBy, setSortBy] = useState<SortType>("latest");
  const [error, setError] = useState("");

  const fetchFolderDocuments = async () => {
    if (!folderId) return;
    const response = await folderService.getDocumentFolder(folderId);
    if (response.success) setFolderDocuments(response.document);
  };

  useEffect(() => {
    if (!folderId) {
      setError("Folder not found.");
      setLoading(false);
      return;
    }

    let isActive = true;
    setLoading(true);
    setError("");

    Promise.all([
      folderService.getSingleFolder(folderId),
      folderService.getDocumentFolder(folderId),
    ])
      .then(([folderResponse, documentResponse]) => {
        if (!isActive) return;
        if (folderResponse.success) setFolderData(folderResponse.folder);
        if (documentResponse.success) setFolderDocuments(documentResponse.document);
      })
      .catch((requestError) => {
        if (isActive) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load this folder.");
        }
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [folderId]);

  const sortedDocuments = useMemo(() => {
    return [...folderDocuments].sort((first, second) => {
      if (sortBy === "az") return first.name.localeCompare(second.name);
      if (sortBy === "za") return second.name.localeCompare(first.name);

      const firstDate = new Date(first.updatedAt).getTime();
      const secondDate = new Date(second.updatedAt).getTime();
      return sortBy === "earliest" ? firstDate - secondDate : secondDate - firstDate;
    });
  }, [folderDocuments, sortBy]);

  const handleDelete = async (
    event: ReactMouseEvent<HTMLDivElement>,
    documentId: string,
  ) => {
    event.stopPropagation();
    try {
      const response = await documentHandler.deleteDocument(documentId);
      if (response.success) {
        await fetchFolderDocuments();
        toast.success("Deleted successfully");
      }
    } catch (deleteError) {
      toast.error(deleteError instanceof Error ? deleteError.message : "Unable to delete document");
    }
  };

  if (loading) {
    return <main className="mx-8 mt-8 text-sm text-neutral-500">Loading folder...</main>;
  }

  if (error) {
    return (
      <main className="mx-8 mt-8 rounded-xl border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
        {error}
      </main>
    );
  }



  return (
    <main className="mx-8 mt-8">
      <section className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Folders</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{folderData?.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="icon" aria-label="Back to dashboard" onClick={() => navigate("/")}>
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h2>{folderData?.name}</h2>
              <p className="text-sm text-neutral-500">
                {folderDocuments.length} {folderDocuments.length === 1 ? "document" : "documents"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-neutral-100 p-1" aria-label="Document view">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Grid view"
                aria-pressed={viewType === "grid"}
                onClick={() => setViewType("grid")}
                className={`h-8 w-8 cursor-pointer ${viewType === "grid" ? "bg-white text-primary shadow-sm" : "text-neutral-500"}`}
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="List view"
                aria-pressed={viewType === "list"}
                onClick={() => setViewType("list")}
                className={`h-8 w-8 cursor-pointer ${viewType === "list" ? "bg-white text-primary shadow-sm" : "text-neutral-500"}`}
              >
                <List size={16} />
              </Button>
            </div>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortType)}>
              <SelectTrigger className="w-fit border-0 bg-neutral-200 focus-visible:ring-0">
                <div className="flex items-center gap-2 p-2">
                  <ListFilter size={14} />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="border-neutral-300 bg-white ring-0" position="popper" align="end">
                <SelectItem value="latest">By Latest Edited</SelectItem>
                <SelectItem value="earliest">By Earliest Edited</SelectItem>
                <SelectItem value="az">By Name: A–Z</SelectItem>
                <SelectItem value="za">By Name: Z–A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section>
        {sortedDocuments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
            This folder has no documents yet.
          </div>
        ) : viewType === "list" ? (
          <div className="flex flex-col gap-3">
            {sortedDocuments.map((document) => (
              <DocumentCardList
                key={document._id}
                title={document.name}
                content={document.content}
                author={document.ownerUser?.fullname ?? "You"}
                date={document.updatedAt}
                onClick={() => navigate(`/documents/n/${document._id}`)}
                onClickDelete={(event) => handleDelete(event, document._id)}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {sortedDocuments.map((document) => (
              <DocumentCard
                key={document._id}
                title={document.name}
                content={document.content}
                author={document.ownerUser?.fullname ?? "You"}
                date={document.updatedAt}
                onClick={() => navigate(`/documents/n/${document._id}`)}
                onClickDelete={(event) => handleDelete(event, document._id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default FolderPage;
