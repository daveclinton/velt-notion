"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { useDocumentStore, useDocumentActions } from "@/lib/document-store";
import { useAuthStore } from "@/lib/auth-store";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const { restoreDocument, deleteDocument } = useDocumentActions();

  // Get archived documents from Zustand store
  const documents = useDocumentStore((state) => {
    if (!user) return [];
    const allDocs = state.documents.filter((doc) => doc.userId === user.id);
    return allDocs.filter((doc) => doc.isArchived);
  });

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  const filteredDocuments = documents?.filter((document) =>
    document.title.toLowerCase().includes(search.toLowerCase())
  );

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: string
  ) => {
    event.stopPropagation();

    const restoredDoc = restoreDocument(documentId);

    toast.promise(Promise.resolve(restoredDoc), {
      loading: "Restoring note...",
      success: restoredDoc ? "Note restored!" : "Failed to restore note.",
      error: "Failed to restore note.",
    });
  };

  const onRemove = (documentId: string) => {
    const success = deleteDocument(documentId);

    toast.promise(Promise.resolve(success), {
      loading: "Deleting note...",
      success: success ? "Note deleted!" : "Failed to delete note.",
      error: "Failed to delete note.",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  if (!documents) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title"
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground">
          No documents found.
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document.id}
            role="button"
            onClick={() => onClick(document.id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 
              flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e) => onRestore(e, document.id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document.id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
