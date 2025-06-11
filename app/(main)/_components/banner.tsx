"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { deleteDocument, restoreDocument } from "@/lib/data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
  documentId: string;
}

export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();
  const onRemove = () => {
    const success = deleteDocument(documentId);

    toast.promise(Promise.resolve(success), {
      loading: "Deleting note...",
      success: success ? "Note deleted!" : "Failed to delete note.",
      error: "Failed to delete note.",
    });

    if (success) {
      router.push("/documents");
    }
  };

  const onRestore = () => {
    const restoredDoc = restoreDocument(documentId);

    toast.promise(Promise.resolve(restoredDoc), {
      loading: "Restoring note...",
      success: restoredDoc ? "Note restored!" : "Failed to restore note.",
      error: "Failed to restore note.",
    });
  };

  return (
    <div
      className="w-full bg-rose-500 text-center text-sm p-2
        text-white flex items-center gap-x-2 justify-center"
    >
      <p>This page is in the Trash</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5
           text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5
           text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};
